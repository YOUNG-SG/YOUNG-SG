import { useEffect, useState } from "react";
import { selectFolderStore } from "@/store/myPageStore";
import Profile from "@/components/MyPage/Profile";
import FolderList from "@/components/MyPage/FolderList";
import FolderDetail from "@/components/MyPage/FolderDetail";
import Timeline from "@/components/MyPage/Timeline";

const MyPage = () => {
  const [select, setSelect] = useState("folder");
  const { selectFolder, setSelectFolder } = selectFolderStore();

  useEffect(() => {
    if (selectFolder > -1) {
      setSelectFolder(-1);
    }
  }, []);

  return (
    <div className="flex h-screen">
      <Profile />
      <div
        className="w-full h-full flex flex-col px-[50px] py-[40px]"
        // style={{ width: "calc(100% - 240px)" }}
      >
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
              <Timeline />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
