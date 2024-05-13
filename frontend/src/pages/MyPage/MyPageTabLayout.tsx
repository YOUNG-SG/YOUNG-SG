import { tabStore } from "@/store/myPageStore";
import FolderList from "@/components/MyPage/FolderList";
import FolderDetail from "@/components/MyPage/FolderDetail";
import Timeline from "@/components/MyPage/Timeline";

const MyPageTabLayout = () => {
  const { selectTab } = tabStore();
  return (
    <div className="flex gap-[16px] mt-[25px] w-full h-full overflow-hidden">
      {selectTab === "folder" ? (
        <>
          <FolderList />
          <FolderDetail />
        </>
      ) : (
        <>
          <Timeline />
        </>
      )}
    </div>
  );
};

export default MyPageTabLayout;
