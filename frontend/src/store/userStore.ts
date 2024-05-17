import { create } from "zustand";

interface UserState {
  id: number | null;
  name: string | null;
  profile: string | null;
  emotion: number;

  setId: (id: number | null) => void;
  setName: (id: string | null) => void;
  setProfile: (id: string | null) => void;
  setEmotion: (emotion: number) => void;
}

const userStore = create<UserState>((set) => ({
  id: null,
  name: null,
  profile: null,
  emotion: 0,

  setId: (id) => set({ id }),
  setName: (name) => set({ name }),
  setProfile: (profile) => set({ profile }),
  setEmotion: (emotion) => set({ emotion }),
}));

export default userStore;
