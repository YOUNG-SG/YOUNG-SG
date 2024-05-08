import { create } from "zustand";

interface UserState {
  id: number | null;
  name: string | null;
  profile: string | null;

  setId: (id: number | null) => void;
  setName: (id: string | null) => void;
  setProfile: (id: string | null) => void;
}

const userStore = create<UserState>((set) => ({
  id: null,
  name: null,
  profile: null,

  setId: (id) => set({ id }),
  setName: (name) => set({ name }),
  setProfile: (profile) => set({ profile }),
}));

export default userStore;
