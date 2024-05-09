import { axiosAuthRequest } from "./axios";

// 내 정보
export const fetchMyProfile = async () => {
  const res = await axiosAuthRequest.get("/api/oauth/mypage/profile");
  return res.data.data;
};

// 내 정보 수정
export const updateMyProfile = async (profile: FormData) => {
  const res = await axiosAuthRequest.put("/api/oauth/mypage/profile/edit", profile);
  return res;
};

// 폴더 목록 조회
export const fetchFolderList = async () => {
  const res = await axiosAuthRequest.get("/api/meeting/folder-list");
  return res.data.data;
};

// 폴더 회의 목록 조회
export const fetchFolderMeetingList = async (folderId: number) => {
  const res = await axiosAuthRequest.get(`/api/meeting/detail-list/${folderId}`);
  return res.data.data;
};

// 타임라인
export const fetchTimeline = async () => {
  const res = await axiosAuthRequest.get("/api/oauth/mypage/timeline");
  return res.data.timeLineList;
};

// 회의 삭제
export const deleteMeeting = async (meetingId: number) => {
  const res = await axiosAuthRequest.delete(`/api/oauth/mypage/delete/${meetingId}`);
  return res;
};
