import { editModeStore } from "@/store/myPageStore";
import Profile from "@/components/MyPage/Profile";
import ProfileEdit from "@/components/MyPage/ProfileEdit";
import MyPageTabLayout from "./MyPageTabLayout";
import MyPageTab from "@/components/MyPage/MyPageTab";
import { useEffect } from "react";

const MyPage = () => {
  const { editMode, setEditMode } = editModeStore();

  useEffect(() => {
    setEditMode(false);
  }, []);

  return (
    <div className="flex h-screen">
      {editMode ? <ProfileEdit /> : <Profile />}
      <div
        className="w-full h-full flex flex-col px-[50px] py-[40px]"
        // style={{ width: "calc(100% - 240px)" }}
      >
        <MyPageTab />
        <MyPageTabLayout />
      </div>
    </div>
  );
};

export default MyPage;
