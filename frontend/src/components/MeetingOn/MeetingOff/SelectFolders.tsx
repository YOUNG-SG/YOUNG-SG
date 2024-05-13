import { useEffect, useState } from "react";
import bg from "../../../assets/chattingIcons/bgImage.jpg";
import AddFolderModal from "./AddFolder";
import { saveMeeting, folderList } from "@/services/Folder";
import { useNavigate } from "react-router-dom";
import createRoomStore from "@/store/createRoomStore";

interface Folder {
  folderId: number | null;
  title: string;
  date: string;
}

const SelectFolder = () => {
  const navigate = useNavigate();
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [isAddFolder, setIsAddFolder] = useState<boolean>(false);
  const [folders, setFolders] = useState<Folder[]>([{ folderId: null, title: "", date: "" }]);
  const { roomId } = createRoomStore();

  const handleFolderClick = (folderId: number | null) => {
    setSelectedFolder(folderId);
  };

  const toggleAddFolderModal = () => {
    setIsAddFolder(!isAddFolder);
  };

  const handleFolderList = async () => {
    const data: Folder[] = await folderList();
    console.log(data);
    setFolders(data);
  };

  const handleSaveMeeting = async (folderId: number | null, roomId: number | null) => {
    if (folderId) {
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

  useEffect(() => {
    handleFolderList();
  }, []);

  return (
    <>
      <AddFolderModal isOpen={isAddFolder} onClose={toggleAddFolderModal} />
      <div
        className="h-screen w-screen items-center justify-center flex"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="bg-black bg-opacity-30 rounded-lg justify-center items-center w-4/5 h-3/5">
          <div className="grid grid-rows-12 w-full h-full p-4">
            <div className="flex flex-wrap gap-4 overflow-auto p-4 row-span-10">
              {/* 추가 */}
              <div
                onClick={toggleAddFolderModal}
                className="border-2 border-dashed border-white rounded-lg w-full h-12 flex justify-center items-center text-white cursor-pointer hover:bg-white hover:bg-opacity-10"
              >
                + 추가
              </div>
              {/* 폴더 리스트 */}
              <div className="grid grid-cols-2 gap-4 w-full">
                {folders.map((folder, index) => (
                  <div
                    key={index}
                    onClick={() => handleFolderClick(folder.folderId)}
                    className={`rounded-lg text-white flex justify-center items-center p-4 cursor-pointer ${
                      selectedFolder === folder.folderId ? "bg-gray-600" : "bg-opacity-50 bg-white"
                    } hover:bg-opacity-70`}
                  >
                    {folder.title}
                  </div>
                ))}
              </div>
            </div>
            <div
              onClick={() => handleSaveMeeting(selectedFolder, roomId)}
              className="flex justify-center items-center rounded-lg text-white bg-opacity-80 bg-gray-500 h-12 cursor-pointer hover:bg-gray-600"
            >
              저장
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectFolder;
