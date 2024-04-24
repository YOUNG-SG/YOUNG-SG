import React, { useCallback, useEffect } from "react";
import { OpenVidu } from "openvidu-browser";
import axios, { AxiosError } from "axios";
import Session from "./OpenVidu/Session";
import Form from "./OpenVidu/Form";
import Dictaphone from "./OpenVidu/Dictaphone";
import useMeetingStore from "../../store/sessionStore2";

function Meeting2() {
  const {
    session,
    setSession,
    sessionId,
    setSessionId,
    subscriber,
    setSubscriber,
    publisher,
    setPublisher,
    isAudioEnabled,
    setIsAudioEnabled,
    isVideoEnabled,
    setIsVideoEnabled,
  } = useMeetingStore();

  const OPENVIDU_SERVER_URL = "https://youngseogi.duckdns.org";
  const OPENVIDU_SERVER_SECRET = "MYSECRET";

  const leaveSession = useCallback(() => {
    if (session) session.disconnect();
    setSession(null);
    setSessionId("");
    setSubscriber(null);
    setPublisher(null);
    setIsAudioEnabled(true);
    setIsVideoEnabled(true);
  }, [session]);

  const joinSession = useCallback(() => {
    const OV = new OpenVidu();
    setOV(OV);
    setSession(OV.initSession());
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", leaveSession);
    return () => window.removeEventListener("beforeunload", leaveSession);
  }, [leaveSession]);

  useEffect(() => {
    if (session === null) return;

    session.on("streamCreated", (event) => {
      const subscribers = session.subscribe(event.stream, "");
      setSubscriber(subscribers);
    });

    const createSession = async (sessionIds: string): Promise<string> => {
      try {
        const data = JSON.stringify({ customSessionId: sessionIds });
        const response = await axios.post(
          `${OPENVIDU_SERVER_URL}/openvidu/api/sessions`,
          data,
          {
            headers: {
              Authorization: `Basic ${btoa(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`,
              "Content-Type": "application/json",
            },
          },
        );

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
          .post(
            `${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${sessionIds}/connection`,
            data,
            {
              headers: {
                Authorization: `Basic ${btoa(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`,

                "Content-Type": "application/json",
              },
            },
          )
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

  const toggleAudio = useCallback(() => {
    if (publisher) {
      publisher.publishAudio(!isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
    }
  }, [publisher, isAudioEnabled]);

  const toggleVideo = useCallback(() => {
    if (publisher) {
      publisher.publishVideo(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  }, [publisher, isVideoEnabled]);

  return (
    <div>
      <h1>진행화면</h1>
      <>
        {!session && (
          <Form
            joinSession={joinSession}
            sessionId={sessionId}
            sessionIdChangeHandler={(event) => setSessionId(event.target.value)}
          />
        )}
        {session && <Session publisher={publisher} subscriber={subscriber} />}
        {publisher && (
          <>
            <button onClick={toggleAudio}>
              {isAudioEnabled ? "음소거" : "소리모드"}
            </button>
            <button onClick={toggleVideo}>
              {isVideoEnabled ? "화면 off" : "화면 on"}
            </button>
          </>
        )}
      </>
      <Dictaphone />
    </div>
  );
}

export default Meeting2;
