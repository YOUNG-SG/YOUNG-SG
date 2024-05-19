import Video from "./Video";
import { Subscriber, Publisher } from "openvidu-browser";

interface SessionProps {
  subscribers: Subscriber[];
  publisher: Publisher | undefined;
}
const calculateFlexClasses = (count: number) => {
  if (count <= 2) {
    return "flex flex-col justify-center items-center";
  } else if (count <= 4) {
    return "flex flex-wrap justify-center items-center";
  } else if (count <= 6) {
    return "flex flex-wrap justify-center items-center";
  } else {
    return "flex flex-wrap justify-center items-center";
  }
};

const calculateWidth = (count: number) => {
  if (count === 1) {
    return "w-full h-full";
  } else if (count === 2) {
    return "w-1/2 h-full";
  } else if (count <= 4) {
    return "w-1/2 h-1/2";
  } else if (count <= 6) {
    return "w-1/3 h-1/2";
  } else {
    return "w-1/3 h-1/3";
  }
};
function Session({ subscribers, publisher }: SessionProps) {
  const participantCount = subscribers.length + 1; // 퍼블리셔 + 구독자 수
  const flexClasses = calculateFlexClasses(participantCount);
  const widthClass = calculateWidth(participantCount);

  return (
    <div className={`flex flex-wrap ${flexClasses} w-full h-full`}>
      {publisher && (
        <div className={`flex items-center justify-center p-2 ${widthClass}`}>
          <Video streamManager={publisher} isPublisher={true} />
        </div>
      )}
      {subscribers.map((subscriber, index) => (
        <div key={index} className={`flex items-center justify-center p-2 ${widthClass}`}>
          <Video streamManager={subscriber} isPublisher={false} />
        </div>
      ))}
    </div>
  );
}
export default Session;
