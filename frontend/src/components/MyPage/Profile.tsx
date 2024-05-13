import { fetchMyProfile } from "@/services/MyPage";
import { useQuery } from "@tanstack/react-query";
import { editModeStore } from "@/store/myPageStore";
import { tokenStore } from "@/store/tokenStore";

const Profile = () => {
  const { setEditMode } = editModeStore();

  // FIXME isLoading, isError
  const {
    data: myProfile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => fetchMyProfile(),
  });

  if (isLoading) {
    // 로딩 컴포넌트 x
    return (
      <div className="min-w-[240px] h-full py-[40px] flex flex-col items-center bg-[#777777] bg-opacity-30"></div>
    );
  }

  if (isError) {
    return <div>에러</div>;
  }

  const nickname = myProfile.nickName;
  const image = myProfile.profileImg;

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

  return (
    <div className="min-w-[240px] h-full py-[40px] flex flex-col items-center bg-[#777777] bg-opacity-30">
      <EditButton />
      <div className="relative">
        <img
          src={image}
          className="w-[140px] h-[140px] rounded-full object-cover mt-[15px] mb-[25px]"
        />
      </div>

      <div>
        <span className="text-[24px] font-bold">{nickname}</span>
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
