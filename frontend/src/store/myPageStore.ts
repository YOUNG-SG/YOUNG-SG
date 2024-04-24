import create from "zustand";

interface Folder {
  id: number;
}

interface FolderState {
  selectFolder: Folder | null;
  setSelectFolder: (folder: Folder | null) => void;
}

const selectFolder = create<FolderState>((set) => ({
  selectFolder: null,
  setSelectFolder: (folder: Folder | null) => set({ selectFolder: folder }),
}));

export default selectFolder;
