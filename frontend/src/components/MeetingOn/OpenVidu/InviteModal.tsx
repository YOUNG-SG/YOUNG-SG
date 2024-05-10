import { baseURL } from "@/services/axios";
// import kakao from "../../../assets/chattingIcons/kakao.png";
import ShareButton from "./ShareButton";
import createRoomStore from "@/store/createRoomStore";

interface InviteModalProps {
  sessionId: string;
  toggleInvite: () => void;
}

const InviteModal = ({ sessionId, toggleInvite }: InviteModalProps) => {
  const { title } = createRoomStore();
  const urlToCopy = `${baseURL}/meeting/on/${sessionId}`;

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(urlToCopy);
      alert("URL이 클립보드에 복사되었습니다."); // 사용자에게 알림
    } catch (err) {
      console.error("복사 실패:", err);
      alert("URL 복사에 실패하였습니다."); // 에러 발생시 사용자에게 알림
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="p-5 w-[400px] h-[250px] " style={{ backgroundColor: "rgb(54, 57, 63)" }}>
        <div className="mb-2" style={{ color: "rgb(250, 250, 250)" }}>
          {title}
        </div>
        <div
          style={{ color: "rgb(250, 250, 250)" }}
          className="w-[300px] text-white font-bold text-xl mb-4"
        >
          초대 URL
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            className="text-white p-2 rounded-lg text-lg w-full"
            value={`${baseURL}/meeting/on/${sessionId}`}
            style={{
              backgroundColor: "rgb(43, 46, 51)",
              color: "rgb(200, 201, 202)",
              border: "rgb(39, 41, 46)",
            }}
          />
          <button
            onClick={handleCopyClick}
            className="w-20 rounded"
            style={{ backgroundColor: "rgb(114, 137, 218)" }}
          >
            복사
          </button>
        </div>
        <div className="mt-4 justify-end gap-2 flex">
          {/* 카톡 공유 */}
          <ShareButton sessionId={sessionId} title={title} />
          {/* <button
            className="w-16 p-2 mt-4 flex justify-center text-center text-white rounded"
            style={{ backgroundColor: "rgb(43, 46, 51)" }}
          >
            <img className="w-7 h-7" src={kakao} alt="" />
          </button> */}
          <button
            className="mt-4 p-2 w-16 text-white rounded"
            onClick={toggleInvite}
            style={{ backgroundColor: "rgb(114, 137, 218)" }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
