import { clickButtonStore } from "@/store/myPageStore";
import TimelineYear from "@/components/MyPage/TimelineYear";

const Timeline = () => {
  // const expandList = [];
  const { setIsClick, setIsAllExpanded } = clickButtonStore();

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
          <TimelineYear />
          <TimelineYear />
          <TimelineYear />
        </div>
      </div>
    </div>
  );
};

export default Timeline;
