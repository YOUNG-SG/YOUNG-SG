import { selectMeetingStore } from "@/store/meetingDetailStore";
import { ArrowButtonProps } from "@/types/MeetingDetail";
import Prev from "@/assets/MeetingDetail/PrevButton.svg?react";
import Next from "@/assets/MeetingDetail/NextButton.svg?react";
import "@/index.css";

const ArrowButton: React.FC<ArrowButtonProps> = ({ prev, next }) => {
  const buttonClass = "w-[30px] h-[30px] rounded-lg flex justify-center items-center";
  const [enable, disable] = [
    "bg-[#eeeeee] bg-opacity-55 cursor-pointer",
    "bg-[#eeeeee] bg-opacity-10 cursor-default",
  ];

  const { selectMeeting, setSelectMeeting, setMeetingId } = selectMeetingStore();

  return (
    <div className="flex mt-[4px] gap-[6px]">
      <div
        className={`${buttonClass} ${selectMeeting > 0 ? enable : disable}`}
        onClick={() => {
          if (selectMeeting > 0) {
            if (prev) {
              setMeetingId(prev.toString());
            }
            setSelectMeeting(selectMeeting - 1);
          }
        }}
      >
        <Prev className={selectMeeting > 0 ? "" : "disable-stroke"} />
      </div>
      <div
        className={`${buttonClass} ${selectMeeting < 2 ? enable : disable}`}
        onClick={() => {
          if (selectMeeting < 2) {
            if (next) {
              setMeetingId(next.toString());
            }
            setSelectMeeting(selectMeeting + 1);
          }
        }}
      >
        <Next className={selectMeeting < 2 ? "" : "disable-stroke"} />
      </div>
    </div>
  );
};

export default ArrowButton;
