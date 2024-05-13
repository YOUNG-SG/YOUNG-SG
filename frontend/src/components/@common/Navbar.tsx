import { useNavigate } from "react-router-dom";
import { fetchMyProfile } from "@/services/MyPage";
import { useQuery } from "@tanstack/react-query";

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

  // FIXME isLoading, isError
  if (isLoading) {
    console.log("로딩중");
  }
  if (isError) {
    navigate("/login");
    return;
  }

  return (
    <nav className="min-w-[80px] h-screen bg-[#777777] bg-opacity-40 backdrop-blur-4 flex flex-col justify-between items-center py-[40px]">
      <img
        src="../../src/assets/@test/logo.png"
        className="w-[30px] h-[30px] cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      />
      <img
        src={isLoading || isError ? "src/assets/@common/Profile.svg" : myProfile?.profileImg}
        className="w-[50px] h-[50px] rounded-full object-cover cursor-pointer"
        onClick={() => {
          if (!isLoading && !isError) {
            navigate("/mypage");
          }
        }}
      />
    </nav>
  );
};

export default Navbar;
