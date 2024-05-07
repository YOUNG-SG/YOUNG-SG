import { create } from "zustand";
import { persist } from "zustand/middleware";

type TokenState = {
  token: string | null;
  setToken: (token: string | null) => void;
};

export const tokenStore = create(
  persist<TokenState>(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    { name: "token", getStorage: () => localStorage },
  ),
);
