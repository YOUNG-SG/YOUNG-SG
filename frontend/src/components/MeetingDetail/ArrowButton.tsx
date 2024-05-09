import { selectMeetingStore } from "@/store/meetingDetailStore";
import { ArrowButtonProps } from "@/types/MeetingDetail";
import Prev from "@/assets/MeetingDetail/PrevButton.svg?react";
import Next from "@/assets/MeetingDetail/NextButton.svg?react";

const ArrowButton: React.FC<ArrowButtonProps> = ({ prev, next }) => {
  const buttonClass = "w-[30px] h-[30px] rounded-lg bg-[#eeeeee] flex justify-center items-center";
  const [enable, disable] = [
    "bg-opacity-30 hover:bg-opacity-50 cursor-pointer",
    "bg-opacity-30 opacity-30 cursor-default",
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
        <Prev />
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
        <Next />
      </div>
    </div>
  );
};

export default ArrowButton;
