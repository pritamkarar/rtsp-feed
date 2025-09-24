import {
  AxiosServerError,
  ServerError,
  StartStreamResponse,
  StreamListResponse,
} from "@/lib/utils";
import axios from "axios";

const apiClient = axios.create({
  baseURL: `/`,
});
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosServerError) => {
    const { response } = error;
    if (response) {
      const errorObject = response.data;
      throw errorObject;
    }
    throw error;
  }
);

// ---- PATHS ----
export async function listPaths(): Promise<StreamListResponse> {
  const { data } = await apiClient.get<StreamListResponse>("/api/listPaths");
  return data;
}

export async function startStream(rtspUrl: string) {
  return await apiClient.post<ServerError, StartStreamResponse>(
    "/api/startStream",
    {
      rtspUrl,
    }
  );
}

export async function stopStream(path: string) {
  const { data } = await apiClient.post("/api/stopStream", { path });
  return data;
}
