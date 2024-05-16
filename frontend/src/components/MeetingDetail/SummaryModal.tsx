import CloseButton from "@/assets/MeetingDetail/X.svg?react";
import { SummaryModalProps } from "@/types/MeetingDetail";

const SummaryModal: React.FC<SummaryModalProps> = ({ handleModal, summary }) => {
  return (
    // 배경이미지 / 블랙+블러 / 흰 박스 / 내용
    <div className="fixed inset-0 bg-[url('@/assets/@common/bgImage.jpg')] bg-cover bg-bottom">
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-20 backdrop-blur-sm">
        <div
          className="fixed bg-e-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl p-[50px] z-10 cursor-default"
          style={{ width: "calc(100% - 380px)", height: "calc(100% - 200px)" }}
        >
          <div className="flex justify-between items-center mb-[15px]">
            <div className="text-[28px] font-extrabold">요약</div>
            <CloseButton className="cursor-pointer" onClick={handleModal} />
          </div>
          <div
            className="w-full overflow-scroll text-[18px]"
            style={{ height: "calc(100% - 60px)" }}
          >
            {summary}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SummaryModal;
