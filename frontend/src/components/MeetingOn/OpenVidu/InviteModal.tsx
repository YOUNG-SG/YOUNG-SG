import { baseURL } from "@/services/axios";
import ShareButton from "./ShareButton";
import createRoomStore from "@/store/createRoomStore";
import CloseButton from "@/assets/MeetingDetail/X.svg?react";
import CopyIcon from "@/assets/chattingIcons/Copy.svg?react";

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
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={toggleInvite}
    >
      <div
        className="bg-[#EEEEEE] bg-opacity-45 cursor-default px-[36px] py-[20px] rounded-xl shadow-lg w-[500px] h-[300px] flex flex-col justify-center gap-[12px]"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="flex justify-between items-start">
          <div className="w-[22px]" />
          <div className="flex justify-center text-[26px] font-bold mt-[4px]">회의 초대</div>
          <CloseButton className="cursor-pointer w-[22px] opacity-60" onClick={toggleInvite} />
        </div>

        <div className="text-[20px] my-[4px]">
          <span className="font-l">회의명 |</span> <span className="font-x">{title}</span>
        </div>

        <div className="flex flex-col gap-[4px]">
          <label className="text-[14px] opacity-80">초대 URL</label>
          <input
            type="text"
            readOnly
            className="h-[40px] p-2 rounded text-lg w-full bg-[#2b2e33] bg-opacity-50 text-[#c8c9ca] border-[#27292e] focus:outline-none"
            value={`${baseURL}/meeting/on/${sessionId}`}
          />
        </div>

        <div className="mt-[16px] gap-2 flex items-center justify-end">
          <div
            className="rounded text-[16px] bg-[#EEEEEE] bg-opacity-30 hover:bg-opacity-40 w-[90px] h-[36px] flex justify-center items-center gap-[8px]"
            onClick={handleCopyClick}
          >
            <CopyIcon className="w-[18px]" />
            복사
          </div>
          <ShareButton sessionId={sessionId} title={title} />
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
