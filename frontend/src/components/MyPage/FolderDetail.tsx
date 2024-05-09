import FolderDetailMeeting from "./FolderDetailMeeting";
import { fetchFolderList, fetchFolderMeetingList } from "@/services/MyPage";
import { selectFolderStore } from "@/store/myPageStore";
import { FolderData, FolderMeetingData } from "@/types/MyPage";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Loading from "../@common/Loading";

const FolderDetail = () => {
  // 선택된 폴더
  const { selectFolder } = selectFolderStore();
  const [folder, setFolder] = useState({ folderId: -1, title: "", date: "" });

  // 폴더 목록에서 선택된 폴더 id 사용해 title, createAt 받아오기
  const { data: folders } = useQuery({
    queryKey: ["folderList"],
    queryFn: () => fetchFolderList(),
  });

  // 선택된 폴더 정보
  useEffect(() => {
    if (selectFolder > -1) {
      setFolder(folders?.find((fld: FolderData) => fld.folderId === selectFolder));
    }
  }, [selectFolder]);

  // 선택된 폴더의 회의 목록
  const { data: folderDetails, isLoading } = useQuery({
    queryKey: ["folderDetails", selectFolder],
    queryFn: () => fetchFolderMeetingList(selectFolder),
  });

  if (selectFolder < 0) {
    return (
      <div className="flex-[1.05] min-h-full bg-e-20 rounded-2xl text-[#CCCCCC] flex justify-center items-center">
        폴더를 선택해주세요
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-[1.05] min-h-full bg-e-20 rounded-2xl text-[#CCCCCC] flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex-[1.05] h-full bg-e-20 rounded-2xl">
      <div className="p-[40px] h-full">
        <div className="h-[24px] text-[18px] text-[#CCCCCC] cursor-default">
          시작일 {folder.date.slice(2)}
        </div>

        <div className="h-[40px] mt-[14px] mb-[40px] text-[32px] font-extrabold cursor-default">
          {folder.title}
        </div>

        <div
          className="flex flex-col gap-[10px] overflow-scroll"
          style={{ height: "calc(100% - 118px)" }}
        >
          {folderDetails.length ? (
            folderDetails.map((meeting: FolderMeetingData) => (
              <FolderDetailMeeting key={meeting.detailId} meeting={meeting} />
            ))
          ) : (
            <div className="w-full h-full flex justify-center items-center text-[#CCCCCC] cursor-default">
              폴더에 회의가 없어요
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderDetail;
