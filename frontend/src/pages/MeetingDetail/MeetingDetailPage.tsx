import Expansion from "@/assets/MeetingDetail/ArrowsOutSimple.svg?react";
import Download from "@/assets/MeetingDetail/DownloadSimple.svg?react";
import UserInfo from "@/components/MeetingDetail/UserInfo";
import Comments from "@/components/MeetingDetail/Comments";
import DetailBox from "@/components/MeetingDetail/DetailBox";
import SummaryModal from "@/components/MeetingDetail/SummaryModal";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMeetingDetail } from "@/services/MeetingDetail";

const MeetingDetailPage = () => {
  const [showModal, setShowModal] = useState(false);
  const { id: meetingDetailId } = useParams<string>();

  const { data: meetingDetail, isLoading } = useQuery({
    queryKey: ["meetingDetail", meetingDetailId],
    queryFn: () => fetchMeetingDetail(meetingDetailId),
  });

  console.log(meetingDetail);

  if (isLoading) {
    return <div>로딩 중</div>;
  }

  return (
    <div className="w-full h-full p-[50px]">
      {showModal && (
        <SummaryModal handleModal={() => setShowModal(false)} summary={meetingDetail.summary} />
      )}
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
                {meetingDetail.summary}
              </div>
            </DetailBox>
          </div>

          <div className="w-full" style={{ height: "calc((100% - 30px) * 0.22)" }}>
            <DetailBox
              title="파일"
              icon={<Download className="cursor-pointer" onClick={() => {}} />}
            >
              {/* FIXME 파일명, 파일 URL ?? */}
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
                <div className="text-[20px] font-l">{meetingDetail.nextMeeting}</div>
              </DetailBox>
            </div>
            <div className="h-full" style={{ width: "calc((100% - 30px) * 7 / 12)" }}>
              <DetailBox title="참여자">
                <div
                  className="grid grid-cols-2 content-start gap-[10px] overflow-scroll"
                  style={{ height: "calc(100% - 60px)" }}
                >
                  {meetingDetail.participantInfoDtoList.map(
                    (p: { profile: string; nickName: string }) => (
                      <UserInfo img={p.profile} nickname={p.nickName} />
                    ),
                  )}
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
