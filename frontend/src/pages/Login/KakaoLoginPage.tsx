import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { kakaoLoginFetch } from "@/services/Login";
import { tokenStore } from "@/store/tokenStore";

const KakaoLoginPage = () => {
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get("code");

  async function getToken(code: string) {
    try {
      const token = await kakaoLoginFetch(code); // { accessToken: "", refreshToken: "" }
      tokenStore.setState({ token: token.accessToken }); // accessToken
      alert("로그인 되었습니다.");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (code) {
      getToken(code);
    }
  }, [code]);

  return (
    <>
      <div></div>
    </>
  );
};

export default KakaoLoginPage;
