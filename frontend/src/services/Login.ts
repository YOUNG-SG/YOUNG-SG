import { axiosRequest } from "./axios";

export const kakaoLoginFetch = async (code: string) => {
  const res = await axiosRequest.get(`/api/oauth/token?code=${code}`);
  return res.data;
};
