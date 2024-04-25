import TimelineYear from "@/components/MyPage/TimelineYear";
import { useState } from "react";

const Timeline = () => {
  // const expandList = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [expanded, setExpanded] = useState(false);
  console.log(expanded);

  const ExpandBtn: React.FC<{ btnName: string; handleExpand: () => void }> = (props) => {
    return (
      <div
        className="w-[160px] h-[48px] bg-[#EEEEEE] bg-opacity-30 rounded-lg flex justify-center items-center text-[18px] mb-[16px]"
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
            btnName={"모두 펼치기"}
            handleExpand={() => {
              setExpanded(true);
            }}
          />
          <ExpandBtn
            btnName={"모두 접기"}
            handleExpand={() => {
              setExpanded(false);
            }}
          />
        </div>
        <TimelineYear />
      </div>
    </div>
  );
};

export default Timeline;
