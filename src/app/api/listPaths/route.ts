import { listActivePaths } from "@/lib/mediamtxClient.server";
import { StreamListResponse } from "@/lib/utils";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const data: StreamListResponse = await listActivePaths();
    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message ?? "Failed to list paths" },
      { status: 500 }
    );
  }
}
