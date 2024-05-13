import { useState } from "react";
import { folderCreate } from "@/services/Folder";

interface AddFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddFolderModal = ({ isOpen, onClose }: AddFolderModalProps) => {
  const [title, setTitle] = useState<string>("");
  if (!isOpen) return null;

  const handleModalClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
  };

  const handleFolderCreate = async (title: string) => {
    const { message, data } = await folderCreate(title);
    if (data === true) {
      console.log(data);
      console.log(message);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center "
      onClick={onClose}
    >
      <div
        className="bg-white bg-opacity-80 p-8 rounded shadow-lg w-1/3"
        onClick={handleModalClick}
      >
        <h2 className="text-lg mb-4 font-semibold text-black">새 폴더 추가</h2>
        <input
          onChange={handleChange}
          type="text"
          placeholder="폴더 이름"
          value={title}
          className="border p-2 rounded w-full mb-4 text-black"
        />
        <div className="flex justify-end">
          <button
            onClick={async () => {
              await handleFolderCreate(title); // 폴더 생성을 기다린 후
              onClose(); // 모달 닫기
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 "
          >
            추가
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFolderModal;
