import { useRef, useEffect, useState } from "react";
import { StreamManager } from "openvidu-browser";
import { useUserListStore } from "@/store/userStore";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as handpose from "@tensorflow-models/handpose";
// import { drawHand } from "@/utils/handlePose";
import * as fp from "fingerpose";
import thumbs_up from "../../../assets/chattingIcons/thumbs_up.png";
import hands_up from "../../../assets/chattingIcons/hello.png";
import thumbs_dowm from "../../../assets/chattingIcons/thumbs-down.png";
import { handsUpGesture, thumbsDownGesture, thumbsUpGesture } from "@/utils/handsUp";
import { userStore } from "@/store/userStore";

interface Props {
  streamManager: StreamManager;
  isPublisher: boolean;
}

function Video({ streamManager, isPublisher }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const autoplay = true;
  const { setEmotion } = userStore();
  const { users } = useUserListStore();

  const [user, setUser] = useState<any>(null); // State to store user information

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
    }, 100);
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
        const GE = new fp.GestureEstimator([thumbsUpGesture, handsUpGesture, thumbsDownGesture]);
        const gesture = GE.estimate(hand[0].landmarks, 4);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          const score = gesture.gestures.map((prediction: any) => prediction.score);
          const maxConfidence = score.indexOf(Math.max.apply(null, score));
          const threshold = 0.7;

          if (gesture.gestures[maxConfidence].score >= threshold) {
            const gestureName = gesture.gestures[maxConfidence].name;

            if (gestureName === "thumbs_up") {
              setEmotion(1);
            } else if (gestureName === "thumbs_down") {
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

      // const ctx = canvasRef.current.getContext("2d");
      // if (ctx) {
      // drawHand(hand, ctx);
      // }
    }
  };

  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);

      const metadata = streamManager.stream.connection.data;
      const userMetadata = JSON.parse(metadata);
      const userName = userMetadata.clientData;
      const foundUser = users.find((user) => user.nickname === userName);
      setUser(foundUser);
    }
  }, [streamManager, users]);

  useEffect(() => {
    if (isPublisher) {
      runHandpose();
    }
  }, []);

  return (
    <>
      <div className="relative flex items-center justify-center w-full h-full">
        <video
          autoPlay={autoplay}
          ref={videoRef}
          className="aspect-video h-[90%] w-[90%] object-contain"
          onLoadedMetadata={updateCanvasSize}
          onPlay={updateCanvasSize}
        >
          <track kind="captions" />
        </video>
        <canvas
          ref={canvasRef}
          className="absolute aspect-video top-0 z-10 left-0 h-[90%] w-[90%]"
        ></canvas>

        {user && user.emotion !== 0 && (
          <img
            src={user.emotion === 1 ? thumbs_up : user.emotion === 2 ? thumbs_dowm : hands_up}
            alt="emotion"
            className="absolute bottom-4 right-4 w-8 h-8 z-20"
          />
        )}
      </div>
    </>
  );
}
export default Video;
