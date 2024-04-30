interface AddFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddFolderModal = ({ isOpen, onClose }: AddFolderModalProps) => {
  if (!isOpen) return null;

  const handleModalClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
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
          type="text"
          placeholder="폴더 이름"
          className="border p-2 rounded w-full mb-4 text-black"
        />
        <div className="flex justify-end">
          <button
            onClick={onClose}
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
