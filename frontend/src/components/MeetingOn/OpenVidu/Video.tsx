import { useState, useRef, useEffect } from "react";
import { StreamManager } from "openvidu-browser";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as handpose from "@tensorflow-models/handpose";
import { drawHand } from "@/utils/handlePose";
import * as fp from "fingerpose";
import victory from "../../../assets/chattingIcons/victory.png";
import thumbs_up from "../../../assets/chattingIcons/thumbs_up.png";
import hands_up from "../../../assets/chattingIcons/hello.png";
import { handsUpGesture } from "@/utils/handsUp";

interface Props {
  streamManager: StreamManager;
  videoSizeClass: string;
  isPublisher: boolean;
}

function Video({ streamManager, videoSizeClass, isPublisher }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const autoplay = true;
  const [emoji, setEmoji] = useState<keyof typeof images | null>(null);
  const [gestureStartTime, setGestureStartTime] = useState<number | null>(null);
  const [isGestureDetected, setIsGestureDetected] = useState(false);

  const images = { thumbs_up: thumbs_up, victory: victory, hands_up: hands_up };

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
    }, 10);
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
        ]);
        const gesture = GE.estimate(hand[0].landmarks, 4);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          const score = gesture.gestures.map((prediction: any) => prediction.score);
          const maxConfidence = score.indexOf(Math.max.apply(null, score));

          const threshold = 0.95;

          if (gesture.gestures[maxConfidence].score >= threshold) {
            const gestureName = gesture.gestures[maxConfidence].name as keyof typeof images;

            if (gestureStartTime === null) {
              setGestureStartTime(Date.now());
            } else {
              const elapsedTime = Date.now() - gestureStartTime;
              if (elapsedTime >= 3000) {
                setIsGestureDetected(true);
                setEmoji(gestureName);
              }
            }
          } else {
            setGestureStartTime(null);
            setIsGestureDetected(false);
            setEmoji(null); // 제스처 인식 못하면 이모지 설정하지 않음
          }
        } else {
          setGestureStartTime(null);
          setIsGestureDetected(false);
          setEmoji(null); // 신뢰도가 임계값보다 낮으면 이모지 설정하지 않음
        }
      } else {
        setGestureStartTime(null);
        setIsGestureDetected(false);
        setEmoji(null); // 손이 감지되지 않으면 이모지 설정하지 않음
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
        {emoji !== null && (
          <img
            src={images[emoji]}
            alt="gesture emoji"
            className="absolute bottom-4 right-4 h-24 "
          />
        )}
      </div>
    </>
  );
}
export default Video;
