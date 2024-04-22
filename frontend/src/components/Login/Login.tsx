import TestIcon from "@/assets/@test/Pencil.svg?react";
import KakaoLogin from "@/assets/Login/KakaoLogin.svg?react";

const Login = () => {
  return (
    <div className="w-[400px] h-[550px] bg-gray-200 bg-opacity-20 rounded-lg backdrop-blur-10 flex flex-col justify-center items-center">
      <div className="text-[28px] font-bold">YOUNG 서기</div>
      <TestIcon className="w-[200px]" />
      <KakaoLogin className="w-[230px] cursor-pointer" />
    </div>
  );
};

export default Login;
