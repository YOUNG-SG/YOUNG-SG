import { shareKakao } from "@/utils/shareKakaoLink";
import { useEffect } from "react";
import kakao from "../../../assets/chattingIcons/kakao.png";

const ShareButton = () => {
  const route = "https://k10d208.p.ssafy.io";
  const title = "제목입니당";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <button onClick={() => shareKakao(route, title)}>
        <img src={kakao} alt="" />
      </button>
    </>
  );
};

export default ShareButton;
