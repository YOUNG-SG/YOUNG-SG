import { useNavigate } from "react-router-dom";
import { fetchMyProfile } from "@/services/MyPage";
import { useQuery } from "@tanstack/react-query";
import SkeletonLoader from "@/components/@common/SkeletonLoader";
import DefaultProfile from "@/assets/@common/Profile.svg?react";
import LogoImage from "@/assets/@common/LogoImage.svg?react";
import LogoTitle from "@/assets/@common/LogoTitle.svg?react";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState(false);

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
    <nav className="min-w-[80px] h-screen bg-[#777777] bg-opacity-40 backdrop-blur-4 flex flex-col justify-between items-center py-[35px]">
      <div
        onClick={() => navigate("/")}
        onMouseOver={() => setIsHover(true)}
        onMouseOut={() => setIsHover(false)}
      >
        {isHover ? (
          <LogoImage className="w-[55px] h-[55px] cursor-pointer" />
        ) : (
          <LogoTitle className="w-[60px] h-[60px] cursor-pointer" />
        )}
      </div>
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
