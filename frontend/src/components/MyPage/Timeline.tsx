import { clickButtonStore } from "@/store/myPageStore";
import TimelineYear from "@/components/MyPage/TimelineYear";
import { useQuery } from "@tanstack/react-query";
import { fetchTimeline } from "@/services/MyPage";
import { ExpandButtonProps, YearData } from "@/types/MyPage";
import SpinnerLoader from "@/components/@common/SpinnerLoader";
import ErrorMessage from "@/components/@common/ErrorMessage";

const Timeline = () => {
  const { setIsClick, setIsAllExpanded } = clickButtonStore();

  const {
    isLoading,
    isError,
    data: timeline,
  } = useQuery<YearData>({
    queryKey: ["timeline"],
    queryFn: () => fetchTimeline(),
  });

  const ExpandButton: React.FC<ExpandButtonProps> = ({ btnName, handleExpand }) => {
    return (
      <div
        className="w-[160px] h-[48px] bg-[#EEEEEE] bg-opacity-30 hover:bg-opacity-50 rounded-lg flex justify-center items-center text-[18px] mb-[16px] cursor-pointer"
        onClick={handleExpand}
      >
        {btnName}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-full">
        <SpinnerLoader />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {isError ? (
        <ErrorMessage>타임라인을 불러올 수 없습니다</ErrorMessage>
      ) : timeline && Object.entries(timeline).length ? (
        <>
          <div className="h-full border-l-[4px] border-[white] ml-[40px] absolute" />
          <div className="w-full h-full">
            <div className="flex justify-end gap-[16px]">
              <ExpandButton
                btnName="모두 펼치기"
                handleExpand={() => {
                  setIsAllExpanded(false);
                  setIsClick(true);
                }}
              />
              <ExpandButton
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
              {Object.entries(timeline).map(([year, months]) => (
                <TimelineYear key={year} year={year} months={months} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <ErrorMessage>아직 진행된 회의가 없어요 {": ("}</ErrorMessage>
      )}
    </div>
  );
};

export default Timeline;
