import { create } from "zustand";

interface RoomState {
  title: string;
  sessionId: string; // inviteCode 초대코드로 사용할 예정
  roomId: number | null;

  setTitle: (title: string) => void;
  setSessionId: (inviteCode: string) => void;
  setRoomId: (roomId: number | null) => void;
}

const createRoomStore = create<RoomState>((set) => ({
  title: "",
  sessionId: "",
  roomId: null,

  setTitle: (title) => set({ title }),
  setSessionId: (sessionId) => set({ sessionId }),
  setRoomId: (roomId) => set({ roomId }),
}));

export default createRoomStore;
