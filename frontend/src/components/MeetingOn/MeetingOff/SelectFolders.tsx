import { useEffect, useState } from "react";
import AddFolderModal from "./AddFolder";
import { saveMeeting, folderList } from "@/services/Folder";
import { useNavigate } from "react-router-dom";
import createRoomStore from "@/store/createRoomStore";
import Folder from "./Folder";
import { addFolderStore, selectFolderStore } from "@/store/meetingOffStore";

interface FolderType {
  folderId: number | null;
  title: string;
  date: string;
}

const SelectFolder = () => {
  const navigate = useNavigate();
  const { selectFolder } = selectFolderStore();
  const { isAddFolder, setIsAddFolder } = addFolderStore();
  const [folders, setFolders] = useState<FolderType[]>([]);
  const { roomId } = createRoomStore();

  const toggleAddFolderModal = () => {
    setIsAddFolder(!isAddFolder);
  };

  const handleFolderList = async () => {
    const data: FolderType[] = await folderList();
    console.log(data);
    setFolders(data);
  };

  const handleSaveMeeting = async (folderId: number | null, roomId: number | null) => {
    if (folderId && roomId) {
      console.log(folderId, roomId);
      try {
        const data = await saveMeeting(folderId, roomId);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
      navigate("/mypage");
    }
  };

  const AddFolderButton = () => {
    return (
      <div
        onClick={toggleAddFolderModal}
        className="text-[20px] border-2 border-dashed border-white border-opacity-50 rounded-lg flex justify-center items-center cursor-pointer hover:text-[22px] hover:font-bold"
      >
        폴더 추가
      </div>
    );
  };

  const SaveButton = () => {
    return (
      <div
        onClick={() => handleSaveMeeting(selectFolder, roomId)}
        className="flex-[12] w-1/3 text-[20px] flex justify-center items-center rounded-lg bg-[#EEEEEE] bg-opacity-30 h-12 cursor-pointer hover:bg-opacity-40"
      >
        저장
      </div>
    );
  };

  useEffect(() => {
    handleFolderList();
  }, []);

  return (
    <>
      {isAddFolder && <AddFolderModal onFolderCreated={handleFolderList} />}
      <div className="h-screen w-screen items-center justify-center flex">
        <div
          className="bg-e-20 rounded-xl justify-center items-center"
          style={{ width: "calc(100% - 380px)", height: "calc(100% - 200px)" }}
        >
          <div className="flex flex-col gap-[36px] h-full px-[70px] py-[50px] items-center">
            <div className="flex-[88] overflow-scroll grid grid-cols-2 auto-rows-[80px] gap-[16px] w-full py-[6px]">
              <AddFolderButton />
              {folders.map((folder) => (
                <Folder key={folder.folderId} folder={folder} />
              ))}
            </div>
            <SaveButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectFolder;
