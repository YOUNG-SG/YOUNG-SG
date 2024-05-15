import { useRef, useEffect, useState } from "react";
import { StreamManager } from "openvidu-browser";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // 추가된 부분
import * as handpose from "@tensorflow-models/handpose";
import { drawHand } from "@/utils/handlePose";
import * as fp from "fingerpose";
import victory from "../../../assets/chattingIcons/victory.png";
import thumbs_up from "../../../assets/chattingIcons/thumbs_up.png";
import hands_up from "../../../assets/chattingIcons/hands_up.png";
import { handsUpGesture } from "@/utils/handsUp";

interface Props {
  streamManager: StreamManager;
}

const images: {
  thumbs_up: string;
  victory: string;
  hands_up: string;
} = {
  thumbs_up: thumbs_up,
  victory: victory,
  hands_up: hands_up,
};

function Video({ streamManager }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const autoplay = true;
  const [emoji, setEmoji] = useState<keyof typeof images | null>(null);
  // const [emoji, setEmoji] = useState(null);

  const images = { thumbs_up: thumbs_up, victory: victory, hands_up: hands_up };

  const updateCanvasSize = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
  };
  const runHandpose = async () => {
    await tf.setBackend("webgl"); // 추가된 부분
    await tf.ready(); // 추가된 부분
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
      console.log(hand);

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture,
          handsUpGesture,
        ]);
        const gesture = GE.estimate(hand[0].landmarks, 4);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          // console.log(gesture.gestures);

          const score = gesture.gestures.map((prediction: any) => prediction.score);
          const maxConfidence = score.indexOf(Math.max.apply(null, score));
          // console.log("maxConfidence: ", maxConfidence, "confidencd: ", confidence);
          // console.log(gesture.gestures[maxConfidence].name);

          if (gesture.gestures[maxConfidence]) {
            // console.log(emoji);
            setEmoji(gesture.gestures[maxConfidence].name);
          }
        }
      }

      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        // console.log("그리기 성공!");
        // console.log(canvasRef.current.getContext("2d"));
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
    runHandpose();
  }, []);

  return (
    <>
      <div className="relative w-full h-full">
        <video
          autoPlay={autoplay}
          ref={videoRef}
          className="object-contain w-full h-full z-10"
          onLoadedMetadata={updateCanvasSize}
          onPlay={updateCanvasSize}
        >
          <track kind="captions" />
        </video>
        <canvas
          ref={canvasRef}
          className="absolute top-0 z-10 left-0 w-full h-full"
          // style={{ zIndex: 50 }}
        ></canvas>
        {emoji !== null && (
          <img
            src={images[emoji]}
            alt="gesture emoji"
            className="absolute left-1/2 transform -translate-x-1/2 bottom-12 h-24 z-30"
          />
        )}
      </div>
    </>
  );
}
export default Video;
