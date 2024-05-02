import { useState } from "react";
import bg from "../../../assets/chattingIcons/bgImage.jpg";
import AddFolderModal from "./AddFolder";

const Folders = () => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isAddFolder, setIsAddFolder] = useState<boolean>(false);

  const handleFolderClick = (folderName: string) => {
    setSelectedFolder(folderName);
  };

  const toggleAddFolderModal = () => {
    setIsAddFolder(!isAddFolder);
  };

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
                {["폴더1", "폴더2", "폴더3", "폴더4", "폴더5"].map((folderName) => (
                  <div
                    key={folderName}
                    onClick={() => handleFolderClick(folderName)}
                    className={`rounded-lg text-white flex justify-center items-center p-4 cursor-pointer ${
                      selectedFolder === folderName ? "bg-gray-600" : "bg-opacity-50 bg-white"
                    } hover:bg-opacity-70`}
                  >
                    {folderName}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center items-center rounded-lg text-white bg-opacity-80 bg-gray-500 h-12 cursor-pointer hover:bg-gray-600">
              선택
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Folders;
