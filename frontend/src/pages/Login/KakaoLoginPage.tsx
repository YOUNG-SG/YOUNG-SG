import { useEffect } from "react";
import { kakaoLoginFetch } from "@/services/Login";
import { tokenStore } from "@/store/tokenStore";
// import { useNavigate } from "react-router-dom";

const KakaoLoginPage = () => {
  // const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get("code");

  async function getToken(code: string) {
    try {
      const token = await kakaoLoginFetch(code);
      tokenStore.setState({ token: token });
      // navigate("/");
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
