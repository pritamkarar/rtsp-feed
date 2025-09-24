import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export interface StartStreamResponse {
  path: string;
  hlsUrl: string;
  webrtcUrl: string;
}
export type ServerError = { error: string };
export type AxiosServerError = AxiosError<ServerError>;
export interface PathConfig {
  source: string;
  sourceOnDemand?: boolean;
  sourceOnDemandStartTimeout?: string;
  maxReaders?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface GlobalConfigUpdate {
  [key: string]: string | number | boolean | undefined;
}

export interface StreamItem {
  name: string;
  confName: string;
  source: {
    type: string;
    id: string;
  };
  ready: boolean;
  readyTime: string | null;
  tracks: any[];
  bytesReceived: number;
  bytesSent: number;
  readers: any[];
}

export interface StreamListResponse {
  itemCount: number;
  pageCount: number;
  items: StreamItem[] | [];
}
