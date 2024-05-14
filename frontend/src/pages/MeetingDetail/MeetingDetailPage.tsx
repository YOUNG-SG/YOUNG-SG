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
import { MeetingDetailData, Participant } from "@/types/MeetingDetail";
import MeetingNavigationBox from "@/components/MeetingDetail/MeetingNavigationBox";
import SpinnerLoader from "@/components/@common/SpinnerLoader";
import ErrorMessage from "@/components/@common/ErrorMessage";

const MeetingDetailPage = () => {
  const [showModal, setShowModal] = useState(false);
  const { id: meetingDetailId } = useParams<string>();

  const {
    isLoading,
    isError,
    data: meetingDetail,
  } = useQuery<MeetingDetailData>({
    queryKey: ["meetingDetail", meetingDetailId],
    queryFn: () => fetchMeetingDetail(meetingDetailId!),
  });

  if (isLoading) {
    return <SpinnerLoader />;
  }

  if (isError) {
    return <ErrorMessage>회의를 불러올 수 없습니다</ErrorMessage>;
  }

  return (
    <div className="w-full h-full p-[50px]">
      {showModal && (
        <SummaryModal handleModal={() => setShowModal(false)} summary={meetingDetail!.summary} />
      )}
      <div className="w-full h-full flex gap-[30px]">
        <div className="w-2/5 h-full flex flex-col gap-[30px]">
          <div className="w-full" style={{ height: "calc((100% - 30px) * 0.74)" }}>
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
                {meetingDetail!.summary}
              </div>
            </DetailBox>
          </div>

          <div className="w-full" style={{ height: "calc((100% - 30px) * 0.26)" }}>
            <DetailBox
              title="파일"
              icon={
                <Download
                  className="cursor-pointer"
                  onClick={() => {
                    window.location.href = meetingDetail!.fileUrl;
                  }}
                />
              }
            >
              <div className="text-[20px] font-l">{meetingDetail!.name}</div>
            </DetailBox>
          </div>
        </div>
        <div className="w-3/5 h-full flex flex-col gap-[30px]">
          <div
            className="w-full flex gap-[30px]"
            style={{ height: "calc((100% - 30px) * 5 / 13)" }}
          >
            <div className="h-full" style={{ width: "calc((100% - 30px) * 5 / 12)" }}>
              {meetingDetailId && (
                <MeetingNavigationBox
                  prev={meetingDetail!.preMeetingId}
                  cur={meetingDetailId}
                  next={meetingDetail!.nextMeetingId}
                  date={meetingDetail!.date}
                  title={meetingDetail!.title}
                />
              )}
            </div>
            <div className="h-full" style={{ width: "calc((100% - 30px) * 7 / 12)" }}>
              <DetailBox title="참여자">
                <div
                  className="grid grid-cols-2 content-start gap-[10px] overflow-scroll"
                  style={{ height: "calc(100% - 60px)" }}
                >
                  {meetingDetail!.participantInfoDtoList.map((participant: Participant) => (
                    <UserInfo
                      key={participant.profile}
                      nickName={participant.nickName}
                      profileImg={participant.profile}
                    />
                  ))}
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
