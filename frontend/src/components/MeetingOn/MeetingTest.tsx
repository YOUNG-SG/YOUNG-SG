import React, { useEffect, useCallback, useState } from "react";
import useMeetingStore from "../../store/meetingStore";
import Form from "./OpenVidu/Form";
import Session from "./OpenVidu/Session";
import Dictaphone from "./OpenVidu/Dictaphone";
import Chatting from "./OpenViduTest/Chatting";

import mute from "../../assets/chattingIcons/mute.png";
import mic from "../../assets/chattingIcons/mic.png";
import monitorOff from "../../assets/chattingIcons/turn-off.png";
import monitorOn from "../../assets/chattingIcons/screen-options.png";
import invite from "../../assets/chattingIcons/add-user.png";
import disconnect from "../../assets/chattingIcons/disconnected.png";
import screen from "../../assets/chattingIcons/screen.png";
import bg from "../../assets/chattingIcons/bgImage.jpg";
import { OpenVidu, Publisher, Subscriber } from "openvidu-browser";
import axios, { AxiosError } from "axios";
import createRoomStore from "@/store/createRoom";

const MeetingTest = () => {
  const { sessionId, setSessionId } = createRoomStore();
  const {
    session,
    setSession,
    screenSession,
    setScreenSession,
    // sessionId,
    // setSessionId,
    subscriber,
    setSubscriber,
    // screenSubscriber,
    setScreenSubscriber,
    publisher,
    setPublisher,
    // screenPublisher,
    setScreenPublisher,
    isAudioEnabled,
    setIsAudioEnabled,
    isVideoEnabled,
    setIsVideoEnabled,
    OV,
    setOV,
    screenOV,
    setScreenOV,
  } = useMeetingStore();

  const OPENVIDU_SERVER_URL = "https://youngseogi.duckdns.org";
  const OPENVIDU_SERVER_SECRET = "MYSECRET";
  const [isClickInvite, setIsClickInvite] = useState(false);

  const leaveSession = useCallback(() => {
    if (session) session.disconnect();

    setOV(null);
    setSession(null);
    setSessionId("");
    setSubscriber(null);
    setPublisher(null);
    setIsAudioEnabled(true); // 세션 종료 시 오디오 상태 초기화
    setIsVideoEnabled(true);

    if (screenSession) screenSession.disconnect();

    setScreenOV(null);
    setScreenSession(null);
    setScreenPublisher(null);
    setScreenSubscriber(null);
  }, [session]);

  const joinSession = () => {
    const OVs = new OpenVidu();
    setOV(OVs);
    setSession(OVs.initSession());
  };

  const joinScreenSession = () => {
    const screenOVs = new OpenVidu();
    setScreenOV(screenOVs);
    setScreenSession(screenOVs.initSession());
  };

  useEffect(() => {
    window.addEventListener("beforeunload", leaveSession);

    return () => {
      window.removeEventListener("beforeunload", leaveSession);
    };
  }, [leaveSession]);

  const sessionIdChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSessionId(event.target.value);
  };

  // 세션 생성, 토큰 생성, 토큰 가져오기 함수
  const createSession = async (sessionIds: string): Promise<string> => {
    try {
      const data = JSON.stringify({ customSessionId: sessionIds });
      const response = await axios.post(`${OPENVIDU_SERVER_URL}/openvidu/api/sessions`, data, {
        headers: {
          Authorization: `Basic ${btoa(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`,
          "Content-Type": "application/json",
        },
      });
      return (response.data as { id: string }).id;
    } catch (error) {
      const errorResponse = (error as AxiosError)?.response;

      if (errorResponse?.status === 409) {
        return sessionIds;
      }
      return "";
    }
  };

  const createToken = (sessionIds: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const data = {};
      axios
        .post(`${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${sessionIds}/connection`, data, {
          headers: {
            Authorization: `Basic ${btoa(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`,

            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          resolve((response.data as { token: string }).token);
        })
        .catch((error) => reject(error));
    });
  };

  const getToken = async (): Promise<string> => {
    try {
      const sessionIds = await createSession(sessionId);
      const token = await createToken(sessionIds);
      return token;
    } catch (error) {
      throw new Error("Failed to get token.");
    }
  };

  useEffect(() => {
    if (session === null) return;

    session.on("streamDestroyed", (event) => {
      if (subscriber && event.stream.streamId === subscriber.stream.streamId) {
        setSubscriber(null);
      }
    });
  }, [subscriber, session]);

  useEffect(() => {
    if (screenSession === null) return;

    screenSession.on("streamDestroyed", (event) => {
      if (subscriber && event.stream.streamId === subscriber.stream.streamId) {
        setSubscriber(null);
      }
    });
  }, [subscriber, screenSession]);

  // 유저 화면 세션
  useEffect(() => {
    if (session === null) return;

    session.on("streamCreated", (event) => {
      const subscribers = session.subscribe(event.stream, "");
      setSubscriber(subscribers);
    });

    getToken()
      .then((token) => {
        session
          .connect(token)
          .then(() => {
            if (OV) {
              const publishers = OV.initPublisher(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: false,
                publishVideo: false,
                mirror: false,
              });

              setPublisher(publishers);
              session
                .publish(publishers)
                .then(() => {})
                .catch(() => {});
            }
          })
          .catch(() => {});
      })
      .catch(() => {});
  }, [session, OV, sessionId, OPENVIDU_SERVER_URL]);

  // 화면 공유 세션
  useEffect(() => {
    if (screenSession === null) return;

    screenSession.on("streamCreated", (event) => {
      const screenSubscribers = screenSession.subscribe(event.stream, "");
      setScreenSubscriber(screenSubscribers);
    });

    getToken()
      .then((token) => {
        screenSession
          .connect(token)
          .then(() => {
            if (screenOV) {
              const screenPublishers = screenOV.initPublisher(undefined, {
                videoSource: "screen",
              });
              screenPublishers.once("accessAllowed", () => {
                screenPublishers.stream
                  .getMediaStream()
                  .getVideoTracks()[0]
                  .addEventListener("ended", () => {
                    console.log("stop sharing button");
                    screenSession.unpublish(screenPublishers);
                  });
              });

              setScreenPublisher(screenPublishers);
              screenSession
                .publish(screenPublishers)
                .then(() => {})
                .catch(() => {});
            }
          })
          .catch(() => {});
      })
      .catch(() => {});
  }, [screenSession, screenOV, sessionId, OPENVIDU_SERVER_URL]);

  const toggleAudio = () => {
    if (publisher) {
      const newAudioState = !isAudioEnabled;
      publisher.publishAudio(newAudioState);
      setIsAudioEnabled(newAudioState); // 오디오 상태 업데이트
    }
  };

  const toggleVideo = () => {
    if (publisher) {
      const newVideoState = !isVideoEnabled;
      publisher.publishVideo(newVideoState);
      setIsVideoEnabled(newVideoState);
    }
  };

  const toggleInvite = () => {
    setIsClickInvite(!isClickInvite);
  };

  return (
    <>
      <div>
        {/* <h1>진행화면</h1> */}
        <>
          {!session && (
            <Form
              joinSession={joinSession}
              sessionId={sessionId}
              sessionIdChangeHandler={sessionIdChangeHandler}
            />
          )}
          <div
            className="h-screen grid grid-cols-12 pr-2"
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* 세션 연결 후 화면 */}
            <div className="col-span-9 grid grid-rows-12">
              <div className="row-span-10 items-center justify-center">
                {session && (
                  <Session
                    publisher={publisher as Publisher}
                    subscriber={subscriber as Subscriber}
                  />
                )}
              </div>

              {/* 버튼들 */}
              <div className="row-span-2 flex items-center justify-center w-full">
                <div className="justify-items-start pr-5">
                  <button
                    onClick={toggleInvite}
                    className="h-10 w-10 rounded-full bg-gray-500 hover:bg-gray-400 flex justify-center items-center"
                  >
                    <img className="h-7 w-7" src={invite} alt="" />
                  </button>
                </div>
                {publisher && (
                  <>
                    <div className="flex gap-5 justify-items-center self-center">
                      <button
                        className={`h-10 w-10 rounded-full flex justify-center items-center ${isAudioEnabled ? "bg-red-500 hover:bg-red-400" : "bg-sky-500 hover:bg-sky-400"}`}
                        onClick={toggleAudio}
                      >
                        {isAudioEnabled ? (
                          <img className="h-7 w-7" src={mute} alt="" />
                        ) : (
                          <img className="h-7 w-7" src={mic} alt="" />
                        )}
                      </button>
                      <button
                        className={`h-10 w-10 rounded-full flex justify-center items-center ${isVideoEnabled ? "bg-red-500 hover:bg-red-400" : "bg-sky-500 hover:bg-sky-400"}`}
                        onClick={toggleVideo}
                      >
                        {isVideoEnabled ? (
                          <img className="h-7 w-7" src={monitorOff} alt="" />
                        ) : (
                          <img className="h-7 w-7" src={monitorOn} alt="" />
                        )}
                      </button>
                      <button
                        className={`h-10 w-10 rounded-full bg-sky-500 hover:bg-sky-400 flex justify-center items-center`}
                        onClick={joinScreenSession}
                      >
                        <img className="h-7 w-7" src={screen} alt="" />
                      </button>
                      <button className="h-10 w-10 rounded-full bg-red-500 hover:bg-red-400 flex justify-center items-center">
                        <img className="h-7 w-7" src={disconnect} alt="" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="col-span-3">
              <Chatting />
            </div>
          </div>
        </>
        <div>
          <Dictaphone />
        </div>
      </div>
    </>
  );
};

export default MeetingTest;
