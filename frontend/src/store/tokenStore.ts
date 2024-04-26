import { create } from "zustand";

type TokenState = {
  token: string | null;
  setToken: (token: string | null) => void;
};

export const tokenStore = create<TokenState>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
}));
