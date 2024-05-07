import { useNavigate } from "react-router-dom";
import { TimelineDayType } from "@/types/MyPage";

const TimelineMeeting: React.FC<{ month: string; day: TimelineDayType }> = ({ month, day }) => {
  const navigate = useNavigate();

  // FIXME 삭제버튼
  return (
    <div
      className="w-full h-[110px] flex gap-[20px] ml-[62px] cursor-pointer"
      onClick={() => {
        navigate(`/meeting/${day.meetingId}`);
      }}
    >
      <div className="w-[100px] h-full flex flex-col justify-center items-center">
        <div className="text-[14px]">{month}월</div>
        <div className="text-[26px] font-bold">{day.createdDay}일</div>
      </div>
      <div
        className="h-full bg-[#CCCCCC] bg-opacity-20 rounded-lg px-[36px] py-[20px] box-border"
        style={{ width: "calc(100% - 182px)" }}
      >
        <div className="text-[16px] text-[#CCCCCC]">{day.folderTitle}</div>
        <div className="text-[30px]">{day.roomTitle}</div>
      </div>
    </div>
  );
};

export default TimelineMeeting;
