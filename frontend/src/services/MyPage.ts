import { axiosAuthRequest } from "./axios";

export const fetchMyProfile = async () => {
  const res = await axiosAuthRequest.get("/api/oauth/mypage/profile");
  return res.data.data;
};
