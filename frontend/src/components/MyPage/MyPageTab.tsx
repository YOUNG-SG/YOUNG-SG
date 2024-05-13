import { tabStore } from "@/store/myPageStore";
import { TabProps } from "@/types/MyPage";
import { useNavigate } from "react-router-dom";

const MyPageTab = () => {
  const navigate = useNavigate();
  const { selectTab, setSelectTab } = tabStore();

  const handleTabClick = (tab: string) => {
    setSelectTab(tab);
    navigate(
      {
        pathname: "/mypage",
        search: `?meeting=${tab}`,
      },
      { replace: true },
    );
  };

  const Tab: React.FC<TabProps> = ({ tab }) => {
    return (
      <div
        className={
          selectTab === tab
            ? "font-x border-b-[2.5px] cursor-default"
            : "text-[#AAAAAA] cursor-pointer"
        }
        onClick={() => {
          handleTabClick(tab);
        }}
      >
        {tab === "folder" ? "회의목록" : "타임라인"}
      </div>
    );
  };

  return (
    <nav className="flex gap-[20px] min-h-[50px] text-[30px] font-extrabold">
      <Tab tab="folder" />
      <Tab tab="timeline" />
    </nav>
  );
};

export default MyPageTab;
