import { selectMeetingStore } from "@/store/meetingDetailStore";
import { useQuery } from "@tanstack/react-query";
import { fetchMeetingDetail } from "@/services/MeetingDetail";
import { MeetingDetailData, MeetingNavigationInfoProps } from "@/types/MeetingDetail";
import { useNavigate } from "react-router-dom";

const MeetingNavigationInfo: React.FC<MeetingNavigationInfoProps> = ({
  move,
  cur,
  title,
  date,
}) => {
  const navigate = useNavigate();

  const { selectMeeting, setSelectMeeting, meetingId } = selectMeetingStore();
  const [id, meet] = move[selectMeeting];

  const { data: meetingDetail, isLoading } = useQuery<MeetingDetailData>({
    queryKey: ["meetingDetail", meetingId],
    queryFn: () => fetchMeetingDetail(meetingId ? meetingId : cur),
  });

  const Info: React.FC<{ info: string; content: string | undefined }> = ({ info, content }) => {
    /* 
      - 26px:  0- 9글자
      - 24px: 10-11글자 
      - 20px: 12-13글자 
      - 18px: 14-15글자 
    */
    const textSize =
      !content || content?.length < 10
        ? 26
        : content?.length < 12
          ? 24
          : content?.length < 14
            ? 20
            : 18;
    return (
      <>
        {info === "date" ? (
          <div className="text-[16px] text-[#CCCCCC] cursor-pointer">{content}</div>
        ) : (
          <div className={`text-center text-[${textSize}px]`}>{content}</div>
        )}
      </>
    );
  };

  if (isLoading) {
    return <div>로딩 중</div>;
  }

  if (selectMeeting === 1) {
    return (
      <>
        <div className="cursor-default">
          <Info info="title" content={title}></Info>
        </div>
        <Info info="date" content={date}></Info>
      </>
    );
  } else {
    return (
      <>
        {id ? (
          <>
            <div
              className="cursor-pointer"
              onClick={() => {
                navigate(`/meeting/${id}`);
                setSelectMeeting(1);
              }}
            >
              <Info info="title" content={meetingDetail?.title}></Info>
            </div>
            <Info info="date" content={meetingDetail?.date}></Info>
          </>
        ) : (
          <div className="text-[#CCCCCC] cursor-default">{meet} 회의가 없습니다</div>
        )}
      </>
    );
  }
};

export default MeetingNavigationInfo;
