import { axiosAuthRequest } from "./axios";

// 내 정보
export const fetchMyProfile = async () => {
  const res = await axiosAuthRequest.get("/api/oauth/mypage/profile");
  return res.data.data;
};

// TODO 내 정보 수정
export const updateMyProfile = async (profile: { profileImg: string; nickName: string }) => {
  const res = await axiosAuthRequest.put("/api/mypage/profile/edit", profile);
  return res;
};

// TODO 폴더 목록 조회
export const fetchFolderList = async () => {
  const res = await axiosAuthRequest.get("/api/meeting/folder-list");
  return res;
};

// TODO 폴더 회의 목록 조회
export const fetchFolderMeetingList = async (folderId: number) => {
  const res = await axiosAuthRequest.get(`/api/meeting/detail/${folderId}`);
  return res;
};

// TODO 타임라인
export const fetchTimeline = async () => {
  const res = await axiosAuthRequest.get("/api/mypage/timeline");
  return res;
};

// TODO 회의 삭제
export const deleteMeeting = async (meetingId: number) => {
  const res = await axiosAuthRequest.delete(`/api/mypage/delete/${meetingId}`);
  return res;
};
