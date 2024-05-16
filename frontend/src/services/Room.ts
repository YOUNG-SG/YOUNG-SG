import { axiosAuthRequest } from "./axios";

// 방 만들기
export const createRoom = async (roomTitle: string) => {
  const res = await axiosAuthRequest.post("/api/meeting/create-meeting", { title: roomTitle });
  console.log(res.data);
  return res.data;
};

// 다른 유저가 url로 접속할 때 얻어오는 방 번호
export const getRoomId = async (inviteCode: string) => {
  const res = await axiosAuthRequest.post("/api/meeting/get-room-id", { code: inviteCode });
  return res.data;
};

// 방 입장
export const joinRoom = async (roomId: number) => {
  const res = await axiosAuthRequest.post(`/api/meeting/join/${roomId}`);
  return res.data;
};

// 방 나가기
export const leaveRoom = async (roomId: number) => {
  const res = await axiosAuthRequest.post("/api/meeting/leave", { roomId: roomId });
  return res.data;
};

// 텍스트 요약 (방 나가면서 호출)
export const sendText = async (roomId: number) => {
  const res = await axiosAuthRequest.post("/api/meeting/send-text", { roomId: roomId });
  console.log("잘되나오바 ㅋㅋ")
  console.log(res.data);
  
  return res.data;
};
