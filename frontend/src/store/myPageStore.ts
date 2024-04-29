import { create } from "zustand";

// 마이페이지 선택된폴더 id 관리
type FolderState = {
  selectFolder: number;
  setSelectFolder: (folder: number) => void;
};

export const selectFolderStore = create<FolderState>((set) => ({
  selectFolder: -1,
  setSelectFolder: (folder: number) => set({ selectFolder: folder }),
}));

// 타임라인 펼치기 버튼 관리
type ButtonState = {
  isClick: boolean;
  setIsClick: (isClick: boolean) => void;
  // isAllExpanded: [F]모두접기 [T]모두펼치기
  isAllExpanded: boolean;
  setIsAllExpanded: (isAllExpanded: boolean) => void;
};

export const clickButtonStore = create<ButtonState>((set) => ({
  isClick: true,
  setIsClick: (isClick) => set({ isClick }),
  isAllExpanded: false,
  setIsAllExpanded: (isAllExpanded) => set({ isAllExpanded }),
}));
