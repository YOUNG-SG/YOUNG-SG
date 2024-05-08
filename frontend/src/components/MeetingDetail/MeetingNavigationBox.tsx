import { MeetingNavigationBoxProps } from "@/types/MeetingDetail";
import { selectMeetingStore } from "@/store/meetingDetailStore";
import DetailBox from "@/components/MeetingDetail/DetailBox";
import ArrowButton from "@/components/MeetingDetail/ArrowButton";
import MeetingNavigationInfo from "@/components/MeetingDetail/MeetingNavigationInfo";

const MeetingNavigationBox: React.FC<MeetingNavigationBoxProps> = ({
  prev,
  next,
  cur,
  title,
  date,
}) => {
  const { selectMeeting } = selectMeetingStore();

  return (
    <DetailBox
      title={(!selectMeeting ? "이전" : selectMeeting === 1 ? "현재" : "다음") + " 회의"}
      button={<ArrowButton prev={prev} next={next} />}
    >
      <div
        className="flex flex-col justify-center items-center"
        style={{ height: "calc(100% - 60px)" }}
      >
        <MeetingNavigationInfo
          move={[
            [prev, "이전"],
            [null, "현재"], // 인덱스 사용을 위한 값
            [next, "다음"],
          ]}
          cur={cur}
          title={title}
          date={date}
        />
      </div>
    </DetailBox>
  );
};

export default MeetingNavigationBox;
