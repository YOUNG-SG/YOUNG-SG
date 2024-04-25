const TimelineMeeting = () => {
  return (
    <div className="w-full h-[110px] flex gap-[20px] ml-[62px]">
      <div className="w-[100px] h-full flex flex-col justify-center items-center">
        <div className="text-[14px]">4월</div>
        <div className="text-[26px] font-bold">17일</div>
      </div>
      <div
        className="h-full bg-[#CCCCCC] bg-opacity-20 rounded-lg px-[36px] py-[20px] box-border"
        style={{ width: "calc(100% - 182px)" }}
      >
        <div className="text-[16px] text-[#CCCCCC]">자율 PJT 개발 회의</div>
        <div className="text-[30px]">개발환경 회의</div>
      </div>
    </div>
  );
};

export default TimelineMeeting;
