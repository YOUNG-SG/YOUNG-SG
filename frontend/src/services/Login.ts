import { axiosRequest } from "./axios";

export const kakaoLoginFetch = async (code: string) => {
  const res = await axiosRequest.get(`/api/oauth/token?code=${code}`);
  console.log(res.headers.authorization);
  return res.headers.authorization;
};
