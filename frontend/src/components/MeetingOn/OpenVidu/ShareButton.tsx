import { shareKakao } from "@/utils/shareKakaoLink";
import { useEffect } from "react";
import kakao from "../../../assets/chattingIcons/kakao.png";

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
    <>
      <button
        className="w-16 p-2 mt-4 flex justify-center text-center text-white rounded"
        style={{ backgroundColor: "rgb(43, 46, 51)" }}
        onClick={() => shareKakao(route, title)}
      >
        <img className="w-7 h-7" src={kakao} alt="" />
      </button>
    </>
  );
};

export default ShareButton;
