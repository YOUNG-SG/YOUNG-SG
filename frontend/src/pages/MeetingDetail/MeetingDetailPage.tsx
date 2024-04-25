import testProfile from "@/assets/@test/profile.jpg";
import Expansion from "@/assets/MeetingDetail/ArrowsOutSimple.svg?react";
import Download from "@/assets/MeetingDetail/DownloadSimple.svg?react";
import UserInfo from "@/components/MeetingDetail/UserInfo";
import Comments from "@/components/MeetingDetail/Comments";
import DetailBox from "@/components/MeetingDetail/DetailBox";
import SummaryModal from "@/components/MeetingDetail/SummaryModal";
import { useState } from "react";

const MeetingDetailPage = () => {
  const summary = "회의 요약입니다 ".repeat(500);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full h-full p-[50px]">
      {showModal && <SummaryModal handleModal={() => setShowModal(false)} summary={summary} />}
      <div className="w-full h-full flex gap-[30px]">
        <div className="w-2/5 h-full flex flex-col gap-[30px]">
          <div className="w-full" style={{ height: "calc((100% - 30px) * 0.78)" }}>
            <DetailBox
              title="요약"
              icon={
                <Expansion
                  className="cursor-pointer"
                  onClick={() => {
                    setShowModal(true);
                  }}
                />
              }
            >
              <div
                className="text-[20px] font-l overflow-scroll"
                style={{ height: "calc(100% - 60px)" }}
              >
                {summary}
              </div>
            </DetailBox>
          </div>

          <div className="w-full" style={{ height: "calc((100% - 30px) * 0.22)" }}>
            <DetailBox
              title="파일"
              icon={<Download className="cursor-pointer" onClick={() => {}} />}
            >
              <div className="text-[20px] font-l">회의제목_240412_1.docx</div>
            </DetailBox>
          </div>
        </div>
        <div className="w-3/5 h-full flex flex-col gap-[30px]">
          <div
            className="w-full flex gap-[30px]"
            style={{ height: "calc((100% - 30px) * 5 / 13)" }}
          >
            <div className="h-full" style={{ width: "calc((100% - 30px) * 5 / 12)" }}>
              <DetailBox title="다음 회의">
                <div className="text-[20px] font-l">다음 회의가 없습니다</div>
              </DetailBox>
            </div>
            <div className="h-full" style={{ width: "calc((100% - 30px) * 7 / 12)" }}>
              <DetailBox title="참여자">
                <div
                  className="grid grid-cols-2 content-start gap-[10px] overflow-scroll"
                  style={{ height: "calc(100% - 60px)" }}
                >
                  <>
                    <UserInfo img={testProfile} nickname="유미의세포1" />
                    <UserInfo img={testProfile} nickname="유미의세포2" />
                    <UserInfo img={testProfile} nickname="유미의세포3" />
                    <UserInfo img={testProfile} nickname="유미의세포4" />
                    <UserInfo img={testProfile} nickname="유미의세포5" />
                    <UserInfo img={testProfile} nickname="유미의세포6" />
                    <UserInfo img={testProfile} nickname="유미의세포7" />
                    <UserInfo img={testProfile} nickname="유미의세포8" />
                    <UserInfo img={testProfile} nickname="유미의세포9" />
                  </>
                </div>
              </DetailBox>
            </div>
          </div>
          <div className="w-full" style={{ height: "calc((100% - 30px) * 8 / 13)" }}>
            <DetailBox title="댓글">
              <Comments />
            </DetailBox>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailPage;
