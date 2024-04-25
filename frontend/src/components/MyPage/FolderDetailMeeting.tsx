import { useNavigate } from "react-router-dom";

const FolderDetailMeeting = () => {
  const navigate = useNavigate();

  const GradationLine = () => {
    return <div className="h-[0.8px] w-[98px] bg-gradient-to-r from-transparent to-white" />;
  };

  return (
    <div
      className="w-full h-[100px] px-[25px] py-[20px] bg-e-20 rounded-lg cursor-pointer"
      onClick={() => {
        navigate(`/meeting/${1}`);
      }}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="text-[14px] font-l text-[#CCCCCC]">24.04.08</div>
          <div className="text-[24px] font-bold">프로젝트 주제 회의</div>
        </div>
        <div className="flex flex-col items-end text-[14px]">
          <div>1시간 50분</div>
          <GradationLine />
          <div>8명</div>
          <GradationLine />
          <div>댓글 1개</div>
        </div>
      </div>
    </div>
  );
};

export default FolderDetailMeeting;
