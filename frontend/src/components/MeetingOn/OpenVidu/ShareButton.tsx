import { shareKakao } from "@/utils/shareKakaoLink";
import { useEffect } from "react";
import KakaoLogo from "@/assets/Login/KakaoLogo.svg?react";

interface shareProps {
  sessionId: string;
  title: string;
}

const ShareButton = ({ sessionId, title }: shareProps) => {
  const route = `https://k10d208.p.ssafy.io/meeting/on/${sessionId}`;

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
    <div
      className="rounded text-[16px] bg-[#EEEEEE] bg-opacity-30 hover:bg-opacity-40 w-[90px] h-[36px] flex justify-center items-center gap-[6px]"
      onClick={() => shareKakao(route, title)}
    >
      <KakaoLogo className="w-[16px]" />
      <div>공유</div>
    </div>
  );
};

export default ShareButton;
