import {
  ServerError,
  StartStreamResponse,
  StreamListResponse,
} from "@/lib/utils";
import { listPaths, startStream, stopStream } from "@/services/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function usePaths() {
  return useQuery<StreamListResponse>({
    queryKey: ["paths"],
    queryFn: listPaths,
  });
}

// Start a new stream
export function useStartStream() {
  const qc = useQueryClient();

  return useMutation<StartStreamResponse, ServerError, string>({
    mutationFn: (rtspUrl: string) => startStream(rtspUrl),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["paths"] }),
    onError: (error) => {
      alert("Error starting stream:" + error.error);
    },
  });
}
// Stop a stream
export function useStopStream() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (path: string) => stopStream(path),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["paths"] }),
  });
}
