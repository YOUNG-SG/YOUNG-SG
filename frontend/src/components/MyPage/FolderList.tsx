import Folder from "./Folder";

const FolderList = () => {
  return (
    <div className="flex-[0.95] flex flex-col gap-[16px] h-full overflow-scroll overflow-x-hidden">
      <Folder />
      <Folder />
      <Folder />
      <Folder />
      <Folder />
      <Folder />
    </div>
  );
};

export default FolderList;
