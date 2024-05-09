import { create } from "zustand";

// [이전-현재-다음] 회의
type selectMeetingState = {
  selectMeeting: number;
  setSelectMeeting: (selectMeeting: number) => void;
  meetingId: string | null;
  setMeetingId: (meetingId: string | null) => void;
};

export const selectMeetingStore = create<selectMeetingState>((set) => ({
  // pre:0, cur:1, next:2
  selectMeeting: 1,
  setSelectMeeting: (selectMeeting: number) => set({ selectMeeting }),
  meetingId: null,
  setMeetingId: (meetingId: string | null) => set({ meetingId }),
}));
