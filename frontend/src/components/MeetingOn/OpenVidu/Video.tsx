import { useRef, useEffect } from "react";
import { StreamManager } from "openvidu-browser";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as handpose from "@tensorflow-models/handpose";
import { drawHand } from "@/utils/handlePose";
import * as fp from "fingerpose";
// import victory from "../../../assets/chattingIcons/victory.png";
// import thumbs_up from "../../../assets/chattingIcons/thumbs_up.png";
// import hands_up from "../../../assets/chattingIcons/hello.png";
// import thumbs_dowm from "../../../assets/chattingIcons/thumbs-down.png";
import { handsUpGesture } from "@/utils/handsUp";
import { thumbsDownGesture } from "@/utils/thumbsDown";
import userStore from "@/store/userStore";

interface Props {
  streamManager: StreamManager;
  videoSizeClass: string;
  isPublisher: boolean;
}

function Video({ streamManager, videoSizeClass, isPublisher }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const autoplay = true;
  const { emotion, setEmotion } = userStore();

  const updateCanvasSize = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.style.width = `${video.clientWidth}px`;
      canvas.style.height = `${video.clientHeight}px`;
    }
  };

  const runHandpose = async () => {
    await tf.setBackend("webgl");
    await tf.ready();
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    // Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 500);
  };

  const detect = async (net: any) => {
    if (videoRef.current && videoRef.current.readyState === 4 && canvasRef.current) {
      const video = videoRef.current;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      video.width = videoWidth;
      video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const hand = await net.estimateHands(video, true);

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture,
          handsUpGesture,
          thumbsDownGesture,
        ]);
        const gesture = GE.estimate(hand[0].landmarks, 4);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          const score = gesture.gestures.map((prediction: any) => prediction.score);
          const maxConfidence = score.indexOf(Math.max.apply(null, score));
          const threshold = 0.8;

          if (gesture.gestures[maxConfidence].score >= threshold) {
            const gestureName = gesture.gestures[maxConfidence].name;
            console.log(gestureName, "이모셔");
            if (gestureName === "thumbs_up") {
              setEmotion(1);
            } else if (gestureName === "thumbs_dowm") {
              setEmotion(2);
            } else if (gestureName === "hands_up") {
              setEmotion(3);
            } else {
              setEmotion(0);
            }
          } else {
            setEmotion(0);
          }
        } else {
          setEmotion(0);
        }
      } else {
        setEmotion(0);
      }

      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        drawHand(hand, ctx);
      }
    }
  };

  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  useEffect(() => {
    if (isPublisher) {
      runHandpose();
    }
  }, []);

  useEffect(() => {
    console.log(emotion, "이모셔");
  }, [emotion]);

  return (
    <>
      <div className={` ${videoSizeClass} flex items-center justify-center relative`}>
        <video
          autoPlay={autoplay}
          ref={videoRef}
          className="aspect-video max-w-full max-h-full h-full w-full"
          onLoadedMetadata={updateCanvasSize}
          onPlay={updateCanvasSize}
        >
          <track kind="captions" />
        </video>
        <canvas
          ref={canvasRef}
          className="absolute aspect-video top-0 z-10 left-0 w-full h-full max-w-full max-h-full"
        ></canvas>
      </div>
    </>
  );
}
export default Video;
