import testProfile from "@/assets/@test/profile.jpg";
import Expansion from "@/assets/MeetingDetail/ArrowsOutSimple.svg?react";
import Download from "@/assets/MeetingDetail/DownloadSimple.svg?react";
import UserInfo from "@/components/MeetingDetail/UserInfo";

const MeetingDetailPage = () => {
  const Box: React.FC<{
    children?: React.ReactNode;
    title: string;
    icon?: React.SVGProps<SVGSVGElement>;
  }> = (props) => {
    return (
      <div className="w-full h-full bg-e-20 rounded-2xl flex justify-center items-center">
        <div style={{ width: "calc(100% - 60px)", height: "calc(100% - 60px)" }}>
          <div className="flex justify-between">
            <div className="text-[28px] font-extrabold mb-[15px]">{props.title}</div>
            <>{props.icon}</>
          </div>
          {props.children}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full p-[50px]">
      <div className="w-full h-full flex gap-[30px]">
        <div className="w-full h-full flex-[1] flex flex-col gap-[30px]">
          <div className="w-full flex-[4]">
            <Box title="요약" icon={<Expansion className="cursor-pointer" onClick={() => {}} />}>
              <div>회의 요약입니다</div>
            </Box>
          </div>
          <div className="w-full flex-[1]">
            <Box title="파일" icon={<Download className="cursor-pointer" onClick={() => {}} />}>
              <div>회의제목_240412_1.docx</div>
            </Box>
          </div>
        </div>
        <div className="w-full h-full flex-[1.5] flex flex-col gap-[30px]">
          <div className="w-full flex-[1] flex gap-[30px]">
            <div className="flex-[1] h-full">
              <Box title="다음 회의">
                <div>다음 회의가 없습니다</div>
              </Box>
            </div>
            <div className="flex-[1.4] h-full">
              <Box title="참여자">
                <div
                  className="flex flex-wrap content-start gap-[10px] overflow-scroll"
                  style={{ height: "calc(100% - 60px)" }}
                >
                  <UserInfo img={testProfile} nickname="유미의세포1" />
                  <UserInfo img={testProfile} nickname="유미의세포2" />
                  <UserInfo img={testProfile} nickname="유미의세포3" />
                  <UserInfo img={testProfile} nickname="유미의세포4" />
                  <UserInfo img={testProfile} nickname="유미의세포5" />
                </div>
              </Box>
            </div>
          </div>
          <div className="w-full flex-[1.6]">
            <Box title="댓글">
              <></>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailPage;
