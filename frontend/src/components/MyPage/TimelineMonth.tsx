import TimelineMeeting from "@/components/MyPage/TimelineMeeting";
import { useState } from "react";

const TimelineMonth = () => {
  const [isShow, setIsShow] = useState(false);
  return (
    <div className="mb-[20px]">
      <div className="flex gap-[20px] items-center">
        <span
          className="w-[16px] h-[16px] ml-[34px] bg-[white] rounded-full"
          onClick={() => {
            setIsShow(!isShow);
          }}
        ></span>
        <div className="text-[22px] font-b">4월</div>
      </div>
      {/* 일 map 함수 */}
      {isShow && (
        <div className="flex flex-col gap-[16px] my-[16px]">
          <TimelineMeeting />
          <TimelineMeeting />
          <TimelineMeeting />
        </div>
      )}
    </div>
  );
};

export default TimelineMonth;
