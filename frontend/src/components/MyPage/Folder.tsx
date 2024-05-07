import { FolderType } from "@/types/MyPage";
import { selectFolderStore } from "@/store/myPageStore";

const Folder: React.FC<{ folder: FolderType }> = ({ folder }) => {
  const { setSelectFolder } = selectFolderStore();

  return (
    <div
      className="w-full min-h-[160px] p-[40px] rounded-2xl bg-e-20 cursor-pointer"
      onClick={() => {
        setSelectFolder(folder.folderId);
      }}
    >
      <div className="text-[32px] font-extrabold">{folder.title}</div>
      {/* FIXME folder.createdAt */}
      <div className="text-[#CCCCCC]">
        23.04.23
        {/* {folder.createdAt} */}
      </div>
    </div>
  );
};

export default Folder;
