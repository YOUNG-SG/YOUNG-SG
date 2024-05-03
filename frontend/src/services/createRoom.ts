import { axiosAuthRequest, axiosRequest } from "./axios";

export const createRoom = async (roomTitle: string) => {
  const res = await axiosAuthRequest.post("/api/meeting/create-meeting", { title: roomTitle });
  return res.data;
};

export const getRoomId = async (inviteCode: string) => {
  const res = await axiosRequest.post("api/meeting/get-room-id", { code: inviteCode });
  return res.data;
};

export const joinRoom = async (roomId: number) => {
  const res = await axiosAuthRequest.post(`api/meeting/join/${roomId}`);
  return res.data;
};

export const leaveRoom = async (roomId: number) => {
  const res = await axiosAuthRequest.post("api/meeting/leave", { roomId: roomId });
  return res.data;
};
