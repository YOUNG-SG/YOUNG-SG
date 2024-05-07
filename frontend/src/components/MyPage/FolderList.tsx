import Folder from "./Folder";
import { FolderType } from "@/types/MyPage";
import { useQuery } from "@tanstack/react-query";
import { fetchFolderList } from "@/services/MyPage";

const FolderList = () => {
  const { data: folders, isLoading } = useQuery({
    queryKey: ["folderList"],
    queryFn: () => fetchFolderList(),
  });

  if (isLoading) {
    return (
      <div className="flex-[0.95] flex flex-col gap-[16px] h-full overflow-scroll overflow-x-hidden"></div>
    );
  }

  return (
    <div className="flex-[0.95] flex flex-col gap-[16px] h-full overflow-scroll overflow-x-hidden">
      {folders.map((folder: FolderType) => (
        <Folder key={folder.folderId} folder={folder} />
      ))}
    </div>
  );
};

export default FolderList;
