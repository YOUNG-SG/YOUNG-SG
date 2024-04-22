import TestIcon from "@/assets/@test/Pencil.svg?react";
import KakaoLogin from "@/assets/Login/KakaoLogin.svg?react";

const Login = () => {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  const link = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  const loginHandler = () => {
    window.location.href = link;
  };

  return (
    <div className="w-[400px] h-[550px] bg-gray-200 bg-opacity-20 rounded-lg backdrop-blur-10 flex flex-col justify-center items-center">
      <div className="text-[28px] font-bold">YOUNG 서기</div>
      <TestIcon className="w-[200px]" />
      <KakaoLogin className="w-[230px] cursor-pointer" onClick={loginHandler} />
    </div>
  );
};

export default Login;
