const Folder = () => {
  return (
    <div
      className="w-full min-h-[160px] p-[40px] rounded-2xl bg-e-20 cursor-pointer"
      onClick={() => {}}
    >
      {/* FIXME 회의명 글자 넘치는 경우 ... */}
      <div className="text-[32px] font-extrabold">자율 PJT 개발 회의</div>
      {/* FIXME total time 안 쓰면 아래 줄 지우기 */}
      <div className="flex justify-between text-[#CCCCCC]">
        <div>24.04.23</div>
        {/* total time */}
        {/* <div>30분</div> */}
      </div>
    </div>
  );
};

export default Folder;
