import { fetchMyProfile } from "@/services/MyPage";
import { useQuery } from "@tanstack/react-query";
import { editModeStore } from "@/store/myPageStore";
import { tokenStore } from "@/store/tokenStore";
import SkeletonLoader from "@/components/@common/SkeletonLoader";
import DefaultProfile from "@/assets/@common/Profile.svg?react";

const Profile = () => {
  const { setEditMode } = editModeStore();

  const {
    isLoading,
    isError,
    data: myProfile,
  } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => fetchMyProfile(),
  });

  const EditButton = () => {
    return (
      <div className="w-full flex justify-end mr-[30px] text-[14px] gap-[6px]">
        <u
          className="cursor-pointer"
          onClick={() => {
            setEditMode(true);
          }}
        >
          수정
        </u>
      </div>
    );
  };

  if (isLoading || isError) {
    return (
      <div className="min-w-[240px] h-full py-[40px] flex flex-col items-center bg-[#777777] bg-opacity-30">
        <div className="h-[20px]"></div>
        {isLoading ? (
          <div className="mt-[15px] mb-[25px]">
            <SkeletonLoader round="full" w={140} h={140} opacity={50} />
          </div>
        ) : (
          <DefaultProfile className="w-[140px] h-[140px] rounded-full object-cover mt-[15px] mb-[25px]" />
        )}
        {isLoading ? <SkeletonLoader round="lg" w={140} h={40} opacity={50} /> : <></>}
      </div>
    );
  }

  return (
    <div className="min-w-[240px] h-full py-[40px] flex flex-col items-center bg-[#777777] bg-opacity-30">
      <EditButton />
      <img
        src={myProfile.profileImg}
        className="w-[140px] h-[140px] rounded-full object-cover mt-[15px] mb-[25px]"
      />

      <div>
        <span className="text-[24px] font-bold">{myProfile.nickName}</span>
        <span className="text-[20px] font-[#CCCCCC]">님</span>
      </div>
      <u
        className="text-[14px] fixed bottom-[40px] cursor-pointer"
        onClick={() => {
          if (confirm("로그아웃 하시겠어요?")) {
            tokenStore.setState({ token: null });
          }
        }}
      >
        로그아웃
      </u>
    </div>
  );
};

export default Profile;
