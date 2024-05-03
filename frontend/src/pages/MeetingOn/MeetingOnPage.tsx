import { Navigate, useLocation } from "react-router-dom";

import MeetingTest from "../../components/MeetingOn/MeetingTest";
import MeetingOff from "../../components/MeetingOn/MeetingOff/Folders";
import ChatTest from "../../components/MeetingOn/ChatTest";

import { tokenStore } from "@/store/tokenStore";
import createRoomStore from "@/store/createRoom";
import { useEffect } from "react";
import { getRoomIdCode } from "@/services/createRoom";

const MeetingOn = () => {
  const { token } = tokenStore();
  const { setSessionId, sessionId, roomId, setRoomId } = createRoomStore();

  const location = useLocation();
  const segments = location.pathname.split("/");
  const code = segments.length > 3 ? segments[3] : null;

  useEffect(() => {
    if (code) {
      console.log(code, "code입ㄴ다");
      setSessionId(code);
    }
  }, [code]);
  console.log(roomId);
  useEffect(() => {
    if (roomId === null) {
      const { roomid } = getRoomIdCode(sessionId);
      setRoomId(roomid);
      console.log("roomid", roomid);
    }
  }, [roomId, code]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {/* <Meeting /> */}
      <MeetingTest />
      <MeetingOff />

      {roomId && <ChatTest />}
    </>
  );
};

export default MeetingOn;
