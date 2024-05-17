import { selectFolderStore } from "@/store/meetingOffStore";

interface Folder {
  folderId: number | null;
  title: string;
  date: string;
}

const Folder: React.FC<{ folder: Folder }> = ({ folder }) => {
  const { selectFolder, setSelectFolder } = selectFolderStore();
  return (
    <div
      onClick={() => setSelectFolder(folder.folderId)}
      className={`rounded-lg text-[22px] p-4 flex justify-center items-center cursor-pointer bg-white ${
        selectFolder === folder.folderId
          ? "bg-opacity-40 text-[#ffffff] shadow-md font-extrabold"
          : "bg-opacity-10 hover:bg-opacity-20"
      }`}
    >
      {folder.title}
    </div>
  );
};

export default Folder;
