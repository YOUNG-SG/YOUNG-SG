import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { TimelineMeetingProps } from "@/types/MyPage";
import { deleteMeeting } from "@/services/MyPage";

const TimelineMeeting: React.FC<TimelineMeetingProps> = ({ month, day }) => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { isError, mutate: delMeeting } = useMutation({
    mutationFn: deleteMeeting,
    onSuccess: () => {
      // FIXME meeting detail 캐시 무효화 ?
      // FIXME folderList or folderDetails 무효화 .. ?
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
    },
  });

  if (isError) {
    alert("회의 삭제에 실패했습니다");
  }

  return (
    <div className="w-full h-[110px] flex gap-[20px] ml-[62px]">
      <div className="w-[100px] h-full flex flex-col justify-center items-center">
        <div className="text-[14px]">{month}월</div>
        <div className="text-[26px] font-bold">{day.createdDay}일</div>
      </div>
      <div
        className="h-full bg-[#CCCCCC] bg-opacity-20 rounded-lg px-[36px] py-[20px] box-border"
        style={{ width: "calc(100% - 182px)" }}
      >
        <div className="flex justify-between text-[#CCCCCC]">
          <div className="text-[16px]">{day.folderTitle}</div>
          <div
            className="text-[12px] cursor-pointer transition-all duration-100 ease-in-out hover:scale-[1.1] hover:text-red-500 hover:font-bold"
            onClick={() => {
              if (confirm("회의를 삭제하시겠어요?")) {
                delMeeting(day.meetingId);
              }
            }}
          >
            삭제
          </div>
        </div>
        <div>
          <span
            className="text-[30px] cursor-pointer transition-all duration-100 ease-in-out hover:text-[31px] hover:font-extrabold"
            onClick={() => {
              // meetingId: roomId
              navigate(`/meeting/${day.meetingId}`);
            }}
          >
            {day.roomTitle}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimelineMeeting;
