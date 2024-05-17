import { FolderProps } from "@/types/MyPage";
import { selectFolderStore } from "@/store/myPageStore";

const Folder: React.FC<FolderProps> = ({ folder }) => {
  const { setSelectFolder } = selectFolderStore();

  return (
    <div
      className="w-full min-h-[160px] p-[40px] rounded-2xl bg-[#EEEEEE] bg-opacity-20 cursor-pointer hover:bg-opacity-30"
      onClick={() => {
        setSelectFolder(folder.folderId);
      }}
    >
      <div className="text-[32px] font-extrabold">{folder.title}</div>
      <div className="text-[#CCCCCC]">{folder.date.slice(2)}</div>
    </div>
  );
};

export default Folder;
