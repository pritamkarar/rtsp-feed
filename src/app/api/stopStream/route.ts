// app/api/mediamtx/stopStream/route.ts
import { deletePathConfig } from "@/lib/mediamtxClient.server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { path } = body;

    if (!path)
      return NextResponse.json({ error: "path required" }, { status: 400 });

    await deletePathConfig(path);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message ?? "Failed to stop stream" },
      { status: 500 }
    );
  }
}
