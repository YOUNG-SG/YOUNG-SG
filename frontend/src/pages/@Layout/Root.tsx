import { Outlet } from "react-router";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { tokenStore } from "@/store/tokenStore";

const Root = () => {
  const path = useLocation().pathname;
  const { token, setToken } = tokenStore();

  useEffect(() => {
    // 로그인, 로그인 콜백 페이지는 토큰 유효 검사 필요 x
    if (path !== "/login" && path !== "/oauth/callback/kakao") {
      const storageTokenState = localStorage.getItem("token");
      if (storageTokenState) {
        const storageToken = JSON.parse(storageTokenState).state.token;
        if (token !== storageToken) {
          setToken(storageToken);
        }
      }
    }
  }, [path]);

  return <Outlet />;
};

export default Root;
