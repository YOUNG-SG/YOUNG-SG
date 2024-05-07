import { useEffect, useState } from "react";
import { clickButtonStore } from "@/store/myPageStore";
import TimelineMeeting from "@/components/MyPage/TimelineMeeting";
import UnfoldState from "@/assets/MyPage/CaretDown.svg?react"; // 펼친 상태
import FoldState from "@/assets/MyPage/CaretRight.svg?react"; // 접힌 상태
import { TimelineMonthsType } from "@/types/MyPage";

const TimelineMonth: React.FC<{ month: string; days: TimelineMonthsType }> = ({ month, days }) => {
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
        <div className="text-[22px] font-b">{month}월</div>
      </div>
      {/* 일 map 함수 */}
      {isShow && (
        <div className="flex flex-col gap-[16px] my-[16px]">
          {Object.values(days).map((day) => (
            <TimelineMeeting month={month} day={day} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TimelineMonth;

// 타입 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// 타임라인
export type TimelineDayType = {
  meetingId: number;
  createdDay: number;
  folderTitle: string;
  roomTitle: string;
};

export type TimelineMonthsType_ = {
  [month: string]: TimelineDayType[];
};

/*

// year - string
"2024": 

// months - TimelineMonthsType
{
  // month - string
  "5": 
  
  // days - TimelineDayType[]
  [

    // day - TimelineDayType
      {
          "meetingId": 6,
          "createdDay": 5,
          "folderTitle": "유나 심번이용",
          "roomTitle": "다섯 번째 회의"
      },
      {
          "meetingId": 5,
          "createdDay": 5,
          "folderTitle": "유나 이번이용",
          "roomTitle": "네 번째 회의"
      }
  ],
  "4": [
      {
          "meetingId": 4,
          "createdDay": 12,
          "folderTitle": "유나 이번이용",
          "roomTitle": "세 번째 회의"
      }
  ]
},
*/
