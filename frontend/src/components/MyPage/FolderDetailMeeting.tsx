import { FolderMeetingType } from "@/types/MyPage";
import { useNavigate } from "react-router-dom";

const FolderDetailMeeting: React.FC<{ meeting: FolderMeetingType }> = ({ meeting }) => {
  const navigate = useNavigate();

  const GradationLine = () => {
    return <div className="h-[0.8px] w-[98px] bg-gradient-to-r from-transparent to-white" />;
  };

  return (
    <div
      className="w-full h-[100px] px-[25px] py-[20px] bg-e-20 rounded-lg cursor-pointer"
      onClick={() => {
        navigate(`/meeting/${meeting.detailId}`);
      }}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="text-[14px] font-l text-[#CCCCCC]">{meeting.createAt}</div>
          <div className="text-[24px] font-bold">{meeting.title}</div>
        </div>
        <div className="flex flex-col items-end text-[14px]">
          <div>{meeting.totalTime}</div>
          <GradationLine />
          <div>{meeting.participantCnt}명</div>
          <GradationLine />
          <div>댓글 {meeting.commentCnt}개</div>
        </div>
      </div>
    </div>
  );
};

export default FolderDetailMeeting;
