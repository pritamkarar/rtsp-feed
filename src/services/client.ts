import {
  StreamListResponse,
} from "@/lib/utils";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `/`,
});


// ---- PATHS ----
export async function listPaths(): Promise<StreamListResponse> {
  const { data } = await apiClient.get<StreamListResponse>("/api/listPaths");
  return data;
}

export async function startStream(rtspUrl: string) {
  const { data } = await apiClient.post(
    "/api/startStream",
    {
      rtspUrl,
    }
  );  
  return data
}

export async function stopStream(path: string) {
  const { data } = await apiClient.post("/api/stopStream", { path });
  return data;
}
