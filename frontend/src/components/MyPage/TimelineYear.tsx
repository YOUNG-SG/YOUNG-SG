import TimelineMonth from "@/components/MyPage/TimelineMonth";
import { TimelineMonthsType } from "@/types/MyPage";

const TimelineYear: React.FC<{ year: string; months: TimelineMonthsType[] }> = ({
  year,
  months,
}) => {
  console.log(months);
  return (
    <div>
      <div className="flex gap-[16px] items-center mb-[30px]">
        <span className="w-[24px] h-[24px] ml-[30px] bg-[white] rounded-full"></span>
        <div className="text-[28px] font-extrabold">{year}</div>
      </div>
      <div className="flex flex-col gap-[20px]">
        {Object.entries(months).map(([month, days]) => (
          <TimelineMonth month={month} days={days} />
        ))}
      </div>
    </div>
  );
};

export default TimelineYear;
