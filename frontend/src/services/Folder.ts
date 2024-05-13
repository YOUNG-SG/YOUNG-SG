import { axiosAuthRequest } from "./axios";

export const folderCreate = async (title: string) => {
  const res = await axiosAuthRequest.post("/api/meeting/folder/create", { title: title });
  return res.data;
};

export const folderList = async () => {
  const res = await axiosAuthRequest.get("/api/meeting/folder-list");
  return res.data.data;
};

export const saveMeeting = async (folderId: number | null, roomId: number | null) => {
  const res = await axiosAuthRequest.post("/api/meeting/save-meeting", {
    folderId: folderId,
    roomId: roomId,
  });
  return res.data;
};
