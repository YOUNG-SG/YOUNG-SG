import { useCallback, useEffect, useState } from "react";
import { OpenVidu, Session as OVSession, Publisher, Subscriber } from "openvidu-browser";
import axios, { AxiosError } from "axios";
import Session from "./OpenVidu/Session";
import Form from "./OpenVidu/Form";
import Dictaphone from "./OpenVidu/Dictaphone";

function Meeting() {
  const [session, setSession] = useState<OVSession | "">("");
  const [sessionId, setSessionId] = useState<string>("");
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [publisher, setPublisher] = useState<Publisher | null>(null);

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [OV, setOV] = useState<OpenVidu | null>(null);

  const OPENVIDU_SERVER_URL = "https://youngseogi.duckdns.org";
  const OPENVIDU_SERVER_SECRET = "MYSECRET";

  const leaveSession = useCallback(() => {
    if (session) session.disconnect();

    setOV(null);
    setSession("");
    setSessionId("");
    setSubscriber(null);
    setPublisher(null);
    setIsAudioEnabled(true); // 세션 종료 시 오디오 상태 초기화
    setIsVideoEnabled(true);
  }, [session]);

  const joinSession = () => {
    const OVs = new OpenVidu();
    setOV(OVs);
    setSession(OVs.initSession());
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

  useEffect(() => {
    if (session === "") return;

    session.on("streamDestroyed", (event) => {
      if (subscriber && event.stream.streamId === subscriber.stream.streamId) {
        setSubscriber(null);
      }
    });
  }, [subscriber, session]);

  useEffect(() => {
    if (session === "") return;

    session.on("streamCreated", (event) => {
      const subscribers = session.subscribe(event.stream, "");
      setSubscriber(subscribers);
    });

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

    getToken()
      .then((token) => {
        session
          .connect(token)
          .then(() => {
            if (OV) {
              const publishers = OV.initPublisher(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                mirror: true,
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

  // 오디오 토글 기능 추가
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

  return (
    <div>
      <h1>진행화면</h1>
      <>
        {!session && (
          <Form
            joinSession={joinSession}
            sessionId={sessionId}
            sessionIdChangeHandler={sessionIdChangeHandler}
          />
        )}
        {session && (
          <Session publisher={publisher as Publisher} subscriber={subscriber as Subscriber} />
        )}
        {publisher && (
          <button onClick={toggleAudio}>{isAudioEnabled ? "음소거" : "소리모드"}</button>
        )}
        {publisher && (
          <button onClick={toggleVideo}>{isVideoEnabled ? "화면 off" : "화면 on"}</button>
        )}
      </>
      <div>
        <Dictaphone />
      </div>
    </div>
  );
}

export default Meeting;
