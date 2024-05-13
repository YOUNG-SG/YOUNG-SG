import { DetailBoxProps } from "@/types/MeetingDetail";

const DetailBox: React.FC<DetailBoxProps> = (props) => {
  return (
    <div className="w-full h-full bg-e-20 rounded-2xl flex justify-center items-center cursor-default">
      <div style={{ width: "calc(100% - 60px)", height: "calc(100% - 60px)" }}>
        <div className="flex justify-between">
          <div className="text-[28px] font-extrabold mb-[15px]">{props.title}</div>
          <>{props.icon}</>
          <>{props.button}</>
        </div>
        {props.children}
      </div>
    </div>
  );
};

export default DetailBox;
