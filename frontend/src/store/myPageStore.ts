import { create } from "zustand";

/* 프로필 */
// 프로필 수정
type editModeState = {
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
};

export const editModeStore = create<editModeState>((set) => ({
  editMode: false,
  setEditMode: (editMode: boolean) => set({ editMode }),
}));

/* 탭 */
// 선택된 탭
type tabState = {
  selectTab: string;
  setSelectTab: (selectTab: string) => void;
};

export const tabStore = create<tabState>((set) => ({
  selectTab: "folder",
  setSelectTab: (selectTab: string) => set({ selectTab }),
}));

/* 회의목록 */
// 선택된폴더 id 관리
type FolderState = {
  selectFolder: number;
  setSelectFolder: (folder: number) => void;
};

export const selectFolderStore = create<FolderState>((set) => ({
  selectFolder: -1,
  setSelectFolder: (folder: number) => set({ selectFolder: folder }),
}));

/* 타임라인 */
// 모두 접기/펼치기 버튼 관리
type ButtonState = {
  allToggleActive: boolean; // 모두 접기/펼치기 버튼 활성화
  setAllToggleActive: (allToggleActive: boolean) => void;
  clickAllOpen: boolean; // 클릭된버튼: [T]모두펼치기 [F]모두접기
  setClickAllOpen: (clickAllOpen: boolean) => void;
};

export const clickButtonStore = create<ButtonState>((set) => ({
  allToggleActive: false,
  setAllToggleActive: (allToggleActive) => set({ allToggleActive }),
  clickAllOpen: true,
  setClickAllOpen: (clickAllOpen) => set({ clickAllOpen }),
}));
