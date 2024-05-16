import Logo from "@/assets/@common/LoginLogo.svg?react";
import KakaoLogo from "@/assets/Login/KakaoLogo.svg?react";
import { tokenStore } from "@/store/tokenStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { token } = tokenStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      alert("이미 로그인 되었습니다");
      navigate("/");
    }
  }, []);

  const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  const link = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const loginHandler = () => {
    window.location.href = link;
  };

  return (
    <div className="w-[400px] h-[500px] bg-e-20 rounded-lg backdrop-blur-10 flex flex-col gap-[20px] justify-center items-center">
      <Logo className="w-[200px] opacity-80" />
      <div
        className="w-[200px] h-[40px] bg-white bg-opacity-10 hover:scale-[1.1] hover:bg-opacity-30 shadow-md rounded-md flex gap-[16px] justify-center items-center cursor-pointer"
        onClick={loginHandler}
      >
        <KakaoLogo />
        <div className="text-[14px]">카카오 로그인</div>
      </div>
    </div>
  );
};

export default Login;
