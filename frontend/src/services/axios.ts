import { tokenStore } from "@/store/tokenStore";
import axios, { InternalAxiosRequestConfig } from "axios";

const SetAuth = (config: InternalAxiosRequestConfig) => {
  const token = tokenStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("토큰없음");
  }

  return config;
};

/*
const SetHeader = (config: InternalAxiosRequestConfig) => {
  const token = "";
  if (token) {
    config.headers.Authorization = token;
    config.headers["Content-Type"] = "multipart/form-data";
  }

  return config;
};
*/

export const baseURL = import.meta.env.VITE_API_BASE_URL;

export const axiosRequest = axios.create({ baseURL: baseURL });
export const axiosAuthRequest = axios.create({ baseURL: baseURL });
export const axiosHeadersRequest = axios.create({ baseURL: baseURL });

axiosAuthRequest.interceptors.request.use(SetAuth);
// axiosHeadersRequest.interceptors.request.use(SetHeader);
