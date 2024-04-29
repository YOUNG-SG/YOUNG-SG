import { useEffect, useState } from "react";
import { clickButtonStore } from "@/store/myPageStore";
import TimelineMeeting from "@/components/MyPage/TimelineMeeting";
import UnfoldState from "@/assets/MyPage/CaretDown.svg?react"; // 펼친 상태
import FoldState from "@/assets/MyPage/CaretRight.svg?react"; // 접은 상태

const TimelineMonth = () => {
  const { isClick, setIsClick, isAllExpanded } = clickButtonStore();
  const [isShow, setIsShow] = useState(true);

  useEffect(() => {
    if (isClick) {
      if (isAllExpanded) {
        setIsShow(false);
      } else {
        setIsShow(true);
      }
    }
  }, [isClick, isAllExpanded]);

  return (
    <div>
      <div className="flex items-center">
        <div
          className="w-[34px] cursor-pointer"
          onClick={() => {
            setIsShow(!isShow);
            setIsClick(false);
          }}
        >
          {isShow ? <UnfoldState /> : <FoldState />}
        </div>
        <span className="w-[16px] h-[16px] mr-[20px] bg-[white] rounded-full"></span>
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
