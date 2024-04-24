import { useState } from "react";
import Profile from "@/components/MyPage/Profile";
import FolderList from "@/components/MyPage/FolderList";
import FolderDetail from "@/components/MyPage/FolderDetail";
import TimelineMeeting from "@/components/MyPage/TimelineMeeting";

const MyPage = () => {
  const [select, setSelect] = useState("folder");

  return (
    <div className="flex h-screen">
      <Profile />
      <div className="w-full h-full flex flex-col px-[50px] py-[40px]">
        <nav className="flex gap-[20px] min-h-[50px] text-[30px] font-extrabold">
          <div
            className={
              select === "folder" ? "font-x border-b-[2.5px]" : "text-[#AAAAAA] cursor-pointer"
            }
            onClick={() => {
              setSelect("folder");
            }}
          >
            회의목록
          </div>
          <div
            className={
              select === "timeline" ? "font-x border-b-[2.5px]" : "text-[#AAAAAA] cursor-pointer"
            }
            onClick={() => {
              setSelect("timeline");
            }}
          >
            타임라인
          </div>
        </nav>
        <div className="flex gap-[16px] mt-[25px] w-full h-full overflow-hidden">
          {select === "folder" ? (
            <>
              <FolderList />
              <FolderDetail />
            </>
          ) : (
            <>
              <TimelineMeeting />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
