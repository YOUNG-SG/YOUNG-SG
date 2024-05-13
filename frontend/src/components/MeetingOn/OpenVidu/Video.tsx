import { useRef, useEffect } from "react";
import { StreamManager } from "openvidu-browser";
import * as posenet from "@tensorflow-models/posenet";
import * as tf from "@tensorflow/tfjs";

interface Props {
  streamManager: StreamManager;
}

function Video({ streamManager }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const autoplay = true;

  const loadAndPredict = async () => {
    if (!videoRef.current) return;
    await tf.setBackend("webgl");

    // PoseNet 모델 로드
    const net = await posenet.load({
      architecture: "MobileNetV1",
      outputStride: 16,
      inputResolution: { width: 640, height: 480 },
      multiplier: 0.75,
    });

    const video = videoRef.current;

    video.addEventListener("loadeddata", async () => {
      // 실시간으로 포즈 감지
      const pose = await net.estimateSinglePose(video, {
        flipHorizontal: false,
      });
      console.log(pose); // 콘솔에 포즈 정보 출력
    });
  };

  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
      loadAndPredict();
    }
  }, [streamManager]);

  return (
    <>
      <video
        autoPlay={autoplay}
        ref={videoRef}
        className="absolute ml-auto mr-auto left-0 right-0 z-0 w-[640px] h-[480px] object-contain" // 'object-cover' 대신 사용 가능
      >
        <track kind="captions" />
      </video>
      <canvas
        ref={canvasRef}
        className="absolute ml-auto mr-auto left-0 right-0 z-0 w-[640px] h-[480px] object-contain"
      ></canvas>
    </>
  );
}

export default Video;
