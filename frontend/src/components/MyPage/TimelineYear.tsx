import TimelineMonth from "@/components/MyPage/TimelineMonth";
import { useState } from "react";

const TimelineYear = () => {
  const [isShow, setIsShow] = useState(false);
  return (
    <div className="w-full overflow-scroll" style={{ height: "calc(100% - 64px)" }}>
      <div className="flex gap-[16px] items-center mb-[30px]">
        <span
          className="w-[24px] h-[24px] ml-[30px] bg-[white] rounded-full"
          onClick={() => {
            setIsShow(!isShow);
          }}
        ></span>
        <div className="text-[28px] font-extrabold">2024</div>
      </div>
      {isShow && (
        <div>
          <TimelineMonth />
          <TimelineMonth />
        </div>
      )}
    </div>
  );
};

export default TimelineYear;
