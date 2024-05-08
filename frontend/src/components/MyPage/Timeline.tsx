import { clickButtonStore } from "@/store/myPageStore";
import TimelineYear from "@/components/MyPage/TimelineYear";
import { useQuery } from "@tanstack/react-query";
import { fetchTimeline } from "@/services/MyPage";
import { YearData } from "@/types/MyPage";

const Timeline = () => {
  const { setIsClick, setIsAllExpanded } = clickButtonStore();

  const { data: timeline, isLoading } = useQuery<YearData>({
    queryKey: ["timeline"],
    queryFn: () => fetchTimeline(),
  });

  const ExpandBtn: React.FC<{ btnName: string; handleExpand: () => void }> = (props) => {
    return (
      <div
        className="w-[160px] h-[48px] bg-[#EEEEEE] bg-opacity-30 hover:bg-opacity-50 rounded-lg flex justify-center items-center text-[18px] mb-[16px] cursor-pointer"
        onClick={props.handleExpand}
      >
        {props.btnName}
      </div>
    );
  };

  if (isLoading) {
    return <div>로딩중</div>;
  }

  console.log(timeline?.length); // undefined (0일때)
  console.log(timeline);

  return (
    <div className="w-full h-full relative">
      <div className="h-full border-l-[4px] border-[white] ml-[40px] absolute" />
      <div className="w-full h-full">
        <div className="flex justify-end gap-[16px]">
          <ExpandBtn
            btnName="모두 펼치기"
            handleExpand={() => {
              setIsAllExpanded(false);
              setIsClick(true);
            }}
          />
          <ExpandBtn
            btnName="모두 접기"
            handleExpand={() => {
              setIsAllExpanded(true);
              setIsClick(true);
            }}
          />
        </div>
        <div
          className="w-full overflow-scroll flex flex-col gap-[80px]"
          style={{ height: "calc(100% - 64px)" }}
        >
          {timeline &&
            Object.entries(timeline).map(([year, months]) => (
              <TimelineYear key={year} year={year} months={months} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
