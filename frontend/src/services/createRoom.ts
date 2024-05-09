import { axiosAuthRequest } from "./axios";

export const createRoom = async (roomTitle: string) => {
  const res = await axiosAuthRequest.post("/api/meeting/create-meeting", { title: roomTitle });
  return res.data;
};
