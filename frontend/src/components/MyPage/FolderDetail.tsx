import FolderDetailMeeting from "./FolderDetailMeeting";

const FolderDetail = () => {
  return (
    <div className="flex-[1.05] h-full bg-[#EEEEEE] bg-opacity-20 rounded-2xl" onClick={() => {}}>
      {/* <div className="p-[40px] h-full box-border bg-[black]"> */}
      <div className="p-[40px] h-full">
        <div className="h-[24px] text-[18px] text-[#CCCCCC]">시작일 24.04.08</div>
        <div className="h-[40px] flex justify-between items-end mt-[14px] mb-[40px]">
          <div className="text-[32px] font-extrabold">자율 PJT 기획 회의</div>
          <div className="text-[16px] text-[#CCCCCC]">4시간 30분</div>
        </div>
        <div
          className="flex flex-col gap-[10px] overflow-scroll"
          style={{ height: "calc(100% - 118px)" }}
        >
          <FolderDetailMeeting />
          <FolderDetailMeeting />
          <FolderDetailMeeting />
          <FolderDetailMeeting />
          <FolderDetailMeeting />
        </div>
      </div>
    </div>
  );
};

export default FolderDetail;
