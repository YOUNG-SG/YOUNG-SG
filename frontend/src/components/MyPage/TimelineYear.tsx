import TimelineMonth from "@/components/MyPage/TimelineMonth";

const TimelineYear = () => {
  return (
    <div>
      <div className="flex gap-[16px] items-center mb-[30px]">
        <span className="w-[24px] h-[24px] ml-[30px] bg-[white] rounded-full"></span>
        <div className="text-[28px] font-extrabold">2024</div>
      </div>
      <div className="flex flex-col gap-[20px]">
        <TimelineMonth />
        <TimelineMonth />
      </div>
    </div>
  );
};

export default TimelineYear;
