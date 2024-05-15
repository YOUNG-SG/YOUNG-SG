import { useNavigate } from "react-router-dom";
import { fetchMyProfile } from "@/services/MyPage";
import { useQuery } from "@tanstack/react-query";
import SkeletonLoader from "@/components/@common/SkeletonLoader";
import DefaultProfile from "@/assets/@common/Profile.svg?react";

const Navbar = () => {
  const navigate = useNavigate();

  const {
    isLoading,
    isError,
    data: myProfile,
  } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => fetchMyProfile(),
  });

  if (isError) {
    navigate("/login");
    return;
  }

  return (
    <nav className="min-w-[80px] h-screen bg-[#777777] bg-opacity-40 backdrop-blur-4 flex flex-col justify-between items-center py-[40px]">
      <img
        src="../src/assets/@test/logo.png"
        className="w-[30px] h-[30px] cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      />
      {isLoading ? (
        <SkeletonLoader round="full" w={50} h={50} />
      ) : isError ? (
        <DefaultProfile className="w-[50px] h-[50px] rounded-full object-cover" />
      ) : (
        <img
          src={myProfile?.profileImg}
          className="w-[50px] h-[50px] rounded-full object-cover cursor-pointer"
          onClick={() => {
            navigate("/mypage");
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
