import { create } from "zustand";

interface RoomState {
  title: string;
  sessionId: string; // inviteCode 초대코드로 사용할 예정
  roomId: number | null;
  roomStatus: string | null;
  owner: string | null;

  setTitle: (title: string) => void;
  setSessionId: (inviteCode: string) => void;
  setRoomId: (roomId: number | null) => void;
  // 0: 회의 전, 1: 회의 중, 2: 회의 끝
  setRoomStatus: (roomStatus: string | null) => void;
  setOwner: (owner: string) => void;
}

const createRoomStore = create<RoomState>((set) => ({
  title: "",
  sessionId: "",
  roomId: null,
  roomStatus: null,
  owner: null,

  setTitle: (title) => set({ title }),
  setSessionId: (sessionId) => set({ sessionId }),
  setRoomId: (roomId) => set({ roomId }),
  setRoomStatus: (roomStatus) => set({ roomStatus }),
  setOwner: (owner) => set({ owner }),
}));

export default createRoomStore;
