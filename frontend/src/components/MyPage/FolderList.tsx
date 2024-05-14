import Folder from "./Folder";
import { FolderData } from "@/types/MyPage";
import { useQuery } from "@tanstack/react-query";
import { fetchFolderList } from "@/services/MyPage";
import ErrorMessage from "@/components/@common/ErrorMessage";

const FolderList = () => {
  const {
    isLoading,
    isError,
    data: folders,
  } = useQuery({
    queryKey: ["folderList"],
    queryFn: () => fetchFolderList(),
  });

  const FolderSkeleton = () => {
    return <div className="w-full min-h-[160px] p-[40px] rounded-2xl bg-e-20" />;
  };

  if (isLoading) {
    return (
      <div className="flex-[0.95] flex flex-col gap-[16px] h-full">
        <FolderSkeleton />
        <FolderSkeleton />
        <FolderSkeleton />
      </div>
    );
  }

  if (isError) {
    return <div className="flex-[0.95] h-full bg-e-20 rounded-2xl" />;
  }

  return (
    <div className="flex-[0.95] flex flex-col gap-[16px] h-full overflow-scroll overflow-x-hidden">
      {!folders.length ? (
        folders.map((folder: FolderData) => <Folder key={folder.folderId} folder={folder} />)
      ) : (
        <ErrorMessage>
          <div>폴더가 없어요</div>
          <div>회의참여 후 폴더를 생성할 수 있어요!</div>
        </ErrorMessage>
      )}
    </div>
  );
};

export default FolderList;
