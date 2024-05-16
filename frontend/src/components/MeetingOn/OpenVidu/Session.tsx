// import { useEffect, useState } from "react";
import Video from "./Video";
import { Publisher, Subscriber } from "openvidu-browser";

interface SessionProps {
  subscribers: Subscriber[];
  publisher: Publisher;
}

function Session({ subscribers, publisher }: SessionProps) {
  // const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  // 참가자 수에 따라 그리드 레이아웃을 계산
  const calculateGridClasses = (count: number) => {
    switch (count) {
      case 1:
        return "grid grid-cols-1 grid-rows-1 place-items-center w-full h-full";
      case 2:
        return "grid grid-cols-2 grid-rows-1 place-items-center w-full h-full";
      case 3:
        return "grid grid-cols-2 grid-rows-2 place-items-center w-full h-full";
      case 4:
        return "grid grid-cols-2 grid-rows-2 place-items-center w-full h-full";
      case 5:
        return "grid grid-cols-3 grid-rows-[1fr_1fr] place-items-center w-full h-full";
      case 6:
        return "grid grid-cols-3 grid-rows-[1fr_1fr] place-items-center w-full h-full";
      default:
        return "grid grid-cols-3 grid-rows-[1fr_1fr] place-items-center w-full h-full";
    }
  };

  const participantCount = subscribers.length + 1; // 퍼블리셔 + 구독자 수
  const gridClasses = calculateGridClasses(participantCount);

  return (
    <div className={gridClasses}>
      <Video
        streamManager={publisher}
        videoSizeClass={
          participantCount === 1 ? "max-w-screen max-h-screen p-2" : "p-2 w-full h-full"
        }
        isPublisher={true} // 퍼블리셔임을 표시
      />
      {subscribers.map((subscriber, index) => (
        <Video
          key={index}
          streamManager={subscriber}
          videoSizeClass="w-full h-full p-2"
          isPublisher={false} // 구독자임을 표시
        />
      ))}
    </div>
  );
}

export default Session;
