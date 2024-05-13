import Folder from "./Folder";
import { FolderData } from "@/types/MyPage";
import { useQuery } from "@tanstack/react-query";
import { fetchFolderList } from "@/services/MyPage";

const FolderList = () => {
  // FIXME isLoading, isError
  const {
    data: folders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["folderList"],
    queryFn: () => fetchFolderList(),
  });

  if (isLoading) {
    return (
      <div className="flex-[0.95] flex flex-col gap-[16px] h-full overflow-scroll overflow-x-hidden"></div>
    );
  }

  if (isError) {
    return <div>에러</div>;
  }

  return (
    <div className="flex-[0.95] flex flex-col gap-[16px] h-full overflow-scroll overflow-x-hidden">
      {folders.length ? (
        folders.map((folder: FolderData) => <Folder key={folder.folderId} folder={folder} />)
      ) : (
        <div className="w-full h-full flex justify-center items-center flex-col text-[#CCCCCC]">
          <div>폴더가 없어요</div>
          <div>회의참여 후 폴더를 생성할 수 있어요!</div>
        </div>
      )}
    </div>
  );
};

export default FolderList;
