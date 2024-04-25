import { useRef, useEffect } from "react";
import { StreamManager } from "openvidu-browser";

interface Props {
  streamManager: StreamManager;
  // streamManager2: StreamManager;
}

function Video({ streamManager }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const autoplay = true;

  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  // useEffect(() => {
  //   if (streamManager2 && videoRef.current) {
  //     streamManager2.addVideoElement(videoRef.current);
  //   }
  // }, [streamManager2]);

  return (
    <video
      className=""
      autoPlay={autoplay}
      ref={videoRef}
      style={{ width: "100%" }}
    >
      <track kind="captions" />
    </video>
  );
}

export default Video;
