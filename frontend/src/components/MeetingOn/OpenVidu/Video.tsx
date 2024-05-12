import { useRef, useEffect } from "react";
import { StreamManager } from "openvidu-browser";

interface Props {
  streamManager: StreamManager;
}

function Video({ streamManager }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const autoplay = true;

  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return (
    <video
      // className="w-80"
      autoPlay={autoplay}
      ref={videoRef}
      // width={360}
      // height={600}
      className="w-96 h-full object-contain" // 'object-cover' 대신 사용 가능
    >
      <track kind="captions" />
    </video>
  );
}

export default Video;
