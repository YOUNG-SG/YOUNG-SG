import { useEffect, useRef, useState } from "react";
import { clickButtonStore } from "@/store/myPageStore";
import TimelineMeeting from "@/components/MyPage/TimelineMeeting";
import ToggleButton from "@/assets/MyPage/CaretRight.svg?react"; // 접힌 상태
import { TimelineMonthProps } from "@/types/MyPage";

const TimelineMonth: React.FC<TimelineMonthProps> = ({ month, days }) => {
  const monthRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(true); // 각 month
  const { allToggleActive, setAllToggleActive, clickAllOpen } = clickButtonStore(); // 모든 month

  /* 처음에 maxHeight 설정 */
  useEffect(() => {
    if (!monthRef || !monthRef.current) {
      return;
    }
    // isOpen: true니까 maxHeight = scrollHeight
    monthRef.current.style.maxHeight = `${isOpen ? monthRef.current.scrollHeight : 0}px`;
  }, []);

  /* AllToggleButton 눌렀을 때 handleAllToggle 실행 */
  useEffect(() => {
    if (allToggleActive) {
      handleAllToggle();
    }
  }, [allToggleActive, clickAllOpen]);

  /* 모든 month toggle 관리 */
  const handleAllToggle = () => {
    if (!monthRef || !monthRef.current) {
      return;
    }
    // 모두펼치기 : 각 month 펼치기, maxHeight=scrollHeight
    // 모두접기   : 각 month 접기,   maxHeight=0
    monthRef.current.style.maxHeight = `${clickAllOpen ? monthRef.current.scrollHeight : 0}px`;
    setIsOpen(clickAllOpen);
  };

  /* 각각의 month toggle 관리 */
  const handleToggle = () => {
    if (!monthRef || !monthRef.current) {
      return;
    }
    // 펼친상태면 maxHeight = 0, 접힌상태면 maxHeight = scrollHeight
    monthRef.current.style.maxHeight = `${isOpen ? 0 : monthRef.current.scrollHeight}px`;
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="flex items-center">
        <div
          className="w-[34px] cursor-pointer"
          onClick={() => {
            handleToggle();
            setAllToggleActive(false);
          }}
        >
          {/* 각 month toggle 버튼 */}
          <ToggleButton
            className={`transition-rotate duration-300 ease-out ${isOpen ? "transform rotate-90" : ""}`}
          />
        </div>
        <span className="w-[16px] h-[16px] mr-[20px] bg-[white] rounded-full"></span>
        <div className="text-[22px] font-b cursor-default">{month}월</div>
      </div>
      {/* Day map 함수 */}
      <div
        className="flex flex-col gap-[16px] my-[16px] overflow-hidden transition-max-height duration-300 ease-out"
        ref={monthRef}
      >
        {days.map((day) => (
          // meetingId: roomId
          <TimelineMeeting key={day.meetingId} month={month} day={day} />
        ))}
      </div>
    </div>
  );
};

export default TimelineMonth;
