"use server";
import axios from "axios";
import { GlobalConfigUpdate, PathConfig, StreamListResponse } from "./utils";

const MTX_BASE = process.env.MEDIAMTX_CONTROL_BASE ?? "http://mediamtx:9997";

const mediamtxApi = axios.create({
  baseURL: `${MTX_BASE}/v3`,
  timeout: 10_000,
});

// ---------------- CONFIG ----------------
export async function getGlobalConfig() {
  const { data } = await mediamtxApi.get("/config/global/get");
  return data;
}

export async function patchGlobalConfig(update: GlobalConfigUpdate) {
  const { data } = await mediamtxApi.patch("/config/global/patch", update);
  return data;
}

// ---------------- PATH CONFIG ----------------
export async function listPathConfigs() {
  const { data } = await mediamtxApi.get("/config/paths/list");
  return data;
}

export async function getPathConfig(name: string) {
  const { data } = await mediamtxApi.get(`/config/paths/get/${name}`);
  return data;
}

export async function addPathConfig(name: string, conf: PathConfig) {
  const { data } = await mediamtxApi.post(`/config/paths/add/${name}`, conf);
  return data;
}

export async function deletePathConfig(name: string) {
  const { data } = await mediamtxApi.delete(`/config/paths/delete/${name}`);
  return data;
}

// ---------------- ACTIVE PATHS ----------------
export async function listActivePaths(): Promise<StreamListResponse> {
  const { data } = await mediamtxApi.get<StreamListResponse>("/paths/list");
  return data;
}

export async function getActivePath(name: string) {
  const { data } = await mediamtxApi.get(`/paths/get/${name}`);
  return data;
}
