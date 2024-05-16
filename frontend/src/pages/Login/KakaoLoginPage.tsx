import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { kakaoLoginFetch } from "@/services/Login";
import { tokenStore } from "@/store/tokenStore";
import SpinnerLoader from "@/components/@common/SpinnerLoader";

const KakaoLoginPage = () => {
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get("code");

  const getToken = async (code: string) => {
    try {
      const token = await kakaoLoginFetch(code); // { accessToken: "", refreshToken: "" }
      tokenStore.setState({ token: token.accessToken }); // accessToken
      alert("로그인 되었습니다");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (code) {
      getToken(code);
    }
  }, [code]);

  return <SpinnerLoader />;
};

export default KakaoLoginPage;
