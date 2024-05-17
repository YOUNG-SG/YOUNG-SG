import { create } from "zustand";

type selectFolderState = {
  selectFolder: number | null;
  setSelectFolder: (selectFolder: number | null) => void;
};

export const selectFolderStore = create<selectFolderState>((set) => ({
  selectFolder: null,
  setSelectFolder: (selectFolder: number | null) => set({ selectFolder }),
}));

type addFolderState = {
  isAddFolder: boolean;
  setIsAddFolder: (isAddFolder: boolean) => void;
};

export const addFolderStore = create<addFolderState>((set) => ({
  isAddFolder: false,
  setIsAddFolder: (isAddFolder: boolean) => set({ isAddFolder }),
}));
