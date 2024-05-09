import { axiosRequest } from "./axios";

// 회의 시작 버튼
export const meetingRecordStart = async (roomId: number) => {
  const res = await axiosRequest.post("/api/meeting/record/start", { roomId: roomId });
  return res.data;
};

export const meetingRecordEnd = async (roomId: number) => {
  const res = await axiosRequest.post("api/meeting/record/end", { roomId: roomId });
  return res.data;
};

export const meetingRecordPause = async (roomId: number) => {
  const res = await axiosRequest.post(`api/meeting/pause/${roomId}`);
  return res.data;
};
