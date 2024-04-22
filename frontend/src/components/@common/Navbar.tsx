import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    // [REMOVE] h: 100vh, ml-auto으로 (화면우측 고정)
    <nav className="w-[80px] h-screen bg-gray-700 bg-opacity-40 backdrop-blur-4 ml-auto flex flex-col justify-between items-center py-[40px]">
      <img
        src="src/assets/@test/logo.png"
        className="w-[30px] h-[30px] cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      />
      <img
        src="src/assets/@test/profile.jpg"
        className="w-[50px] h-[50px] rounded-full object-cover cursor-pointer"
        onClick={() => {
          navigate("/profile");
        }}
      />
    </nav>
  );
};

export default Navbar;
