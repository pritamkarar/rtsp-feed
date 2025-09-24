"use client";
import { useState, useRef } from "react";
import Hls from "hls.js";
import { useStartStream, useStopStream } from "@/hooks/useMediamtx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";



export default function LiveFeedPage() {
    const [rtspUrl, setRtspUrl] = useState("");
    const [currentPath, setCurrentPath] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null); // hidden video
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const animationRef = useRef<number | null>(null);

    const { mutateAsync: hlsMutation, isPending: isHlsPending } = useStartStream();
    const { mutateAsync: webRtcMutation, isPending: isWebRtcPending } = useStartStream();

    const { mutateAsync: stopStreamMutation, isPending: isStopPending } = useStopStream();

    const drawToCanvas = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        const drawFrame = () => {
            ctx.drawImage(videoRef.current!, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
            animationRef.current = requestAnimationFrame(drawFrame);
        };
        drawFrame();
    };
    const showCanvasError = (message: string) => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.fillStyle = "#ff0000";
        ctx.font = "24px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(message, canvasRef.current.width / 2, canvasRef.current.height / 2);
    }
    const startHls = async () => {
        if (!rtspUrl) return alert("Enter RTSP URL");
        const { path, hlsUrl } = await hlsMutation(rtspUrl);
        setCurrentPath(path);



        if (Hls.isSupported() && videoRef.current) {
            const hls = new Hls();
            hls.loadSource(hlsUrl);
            hls.attachMedia(videoRef.current);
            hls.on(Hls.Events.ERROR, (data) => {
                console.error("HLS error:", data);
                showCanvasError("HLS stream failed");
            });
            hlsRef.current = hls;
            videoRef.current.play().catch(() => showCanvasError("Unable to play video"));
            drawToCanvas();
        } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
            videoRef.current.src = hlsUrl;
            videoRef.current.play().catch(() => showCanvasError("Unable to play video"));
            drawToCanvas();
        }
    };

    const startWebRtc = async () => {
        if (!rtspUrl) return alert("Enter RTSP URL");
        const { path, webrtcUrl } = await webRtcMutation(rtspUrl);
        setCurrentPath(path);
        try {
            const pc = new RTCPeerConnection();
            pc.addTransceiver("video", { direction: "recvonly" });
            pc.addTransceiver("audio", { direction: "recvonly" });
            pc.ontrack = (event) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = event.streams[0];
                    videoRef.current.play().catch(() => showCanvasError("Unable to play WebRTC stream"));
                    drawToCanvas();
                }
            };
            pc.createDataChannel("chat");
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
           
            const res = await fetch(webrtcUrl, {
                method: "POST",
                headers: { "Content-Type": "application/sdp" },
                body: offer.sdp,
            });
            if (!res.ok) throw new Error("WebRTC SDP request failed");
            const answerSdp = await res.text();
            await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });
        } catch (err) {
            console.error("WebRTC error:", err);
            showCanvasError("WebRTC stream failed");
        }
    };

    const stopStream = async () => {
        if (!currentPath) return;
        await stopStreamMutation(currentPath);
        setCurrentPath(null);

        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.src = "";
            videoRef.current.srcObject = null;
        }

        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    return (
        <Card className="p-4 space-y-4">
            <CardHeader>
                <CardTitle>Live Feed Viewer (Canvas)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input
                    placeholder="Enter RTSP URL"
                    value={rtspUrl}
                    onChange={(e) => setRtspUrl(e.target.value)}
                />
                <div className="flex gap-2">
                    <Button variant="default" onClick={startHls} disabled={isHlsPending}>
                        Start HLS
                    </Button>
                    <Button variant="secondary" onClick={startWebRtc} disabled={isWebRtcPending}>
                        Start WebRTC
                    </Button>
                    <Button variant="destructive" onClick={stopStream} disabled={!currentPath || isStopPending}>
                        Stop Stream
                    </Button>
                </div>
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={500}
                    className="bg-black rounded"
                ></canvas>
                <video ref={videoRef} style={{ display: "none" }}></video>
            </CardContent>
        </Card>
    );
}