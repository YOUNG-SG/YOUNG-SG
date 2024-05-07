import { useNavigate } from "react-router-dom";
import { fetchMyProfile } from "@/services/MyPage";
import { useQuery } from "@tanstack/react-query";

const Navbar = () => {
  const navigate = useNavigate();

  const { data: myProfile, isLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => fetchMyProfile(),
  });

  return (
    <nav className="min-w-[80px] h-screen bg-[#777777] bg-opacity-40 backdrop-blur-4 flex flex-col justify-between items-center py-[40px]">
      <img
        src="../../src/assets/@test/logo.png"
        className="w-[30px] h-[30px] cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      />
      {isLoading ? ( // 로딩 컴포넌트 x
        <div className="bg-white w-[50px] h-[50px] rounded-full"></div>
      ) : (
        <img
          src={myProfile.image}
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
