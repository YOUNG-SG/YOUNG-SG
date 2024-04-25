const Folder = () => {
  return (
    <div className="w-full min-h-[160px] p-[40px] rounded-2xl bg-e-20" onClick={() => {}}>
      {/* FIXME 회의명 글자 넘치는 경우 ... */}
      <div className="text-[32px] font-extrabold">자율 PJT 개발 회의</div>
      <div className="flex justify-between text-[#CCCCCC]">
        <div>24.04.23</div>
        <div>30분</div>
      </div>
    </div>
  );
};

export default Folder;
