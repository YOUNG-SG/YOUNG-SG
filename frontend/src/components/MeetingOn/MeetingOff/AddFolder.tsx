import { useState } from "react";
import { folderCreate } from "@/services/Folder";
import { addFolderStore } from "@/store/meetingOffStore";

interface AddFolderModalProps {
  onFolderCreated: () => void;
}

const AddFolderModal = ({ onFolderCreated }: AddFolderModalProps) => {
  const [title, setTitle] = useState<string>("");
  const { setIsAddFolder } = addFolderStore();

  const handleModalClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
  };

  const onClose = () => {
    setIsAddFolder(false);
    setTitle("");
  };

  const handleFolderCreate = async (title: string) => {
    if (title.length > 10) {
      alert("폴더명은 10글자 이하로 설정 가능합니다");
      return;
    }
    const { message, data } = await folderCreate(title);
    if (data === true) {
      console.log(data);
      console.log(message);
      onFolderCreated();
      onClose(); // 모달 닫기
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <div className="fixed inset-0 bg-[url('@/assets/@common/bgImage.jpg')] bg-cover bg-bottom opacity-95">
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-20 backdrop-blur-sm">
        <div
          className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center"
          onClick={onClose}
        >
          <div
            className="bg-[#EEEEEE] bg-opacity-20 px-[40px] rounded-xl shadow-lg w-[500px] h-[300px] flex flex-col gap-[20px] justify-center"
            onClick={handleModalClick}
          >
            <div className="flex flex-col justify-end items-center">
              <h2 className="text-[26px] font-bold">폴더 추가</h2>
              <span className="opacity-50 text-[14px]">폴더명은 10글자 이하로 설정해주세요</span>
            </div>
            <div className="flex flex-col gap-[2px] items-start">
              <label className="text-[16px] ml-[4px]">폴더명</label>
              <input
                onChange={handleChange}
                type="text"
                value={title}
                className="bg-e-20 w-full h-[45px] text-[18px] focus:outline-none p-2 rounded"
              />
            </div>
            <div className="flex gap-[10px] justify-center">
              <button
                onClick={async () => {
                  await handleFolderCreate(title); // 폴더 생성을 기다린 후
                }}
                className="w-[100px] h-[40px] bg-[#EEEEEE] bg-opacity-30 hover:bg-opacity-40 rounded"
              >
                추가
              </button>
              <button
                onClick={onClose}
                className="w-[100px] h-[40px] bg-[#EEEEEE] bg-opacity-10 hover:bg-opacity-40 rounded"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFolderModal;
