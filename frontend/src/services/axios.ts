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

export const baseURL = import.meta.env.VITE_API_BASE_URL;

export const axiosRequest = axios.create({ baseURL: baseURL });
export const axiosAuthRequest = axios.create({ baseURL: baseURL });
export const axiosHeadersRequest = axios.create({ baseURL: baseURL });

axiosAuthRequest.interceptors.request.use(SetAuth);
axiosAuthRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    /* error 처리 */
    if (error.response) {
      // 서버가 응답
      console.log(error.response.status);
    } else if (error.request) {
      // 요청이 만들어졌으나 응답 받지 x
      console.log(error.request);
    } else {
      // 요청을 만드는 중에 문제 발생
      console.log(error.message);
    }
    return Promise.reject(error);
  },
);
