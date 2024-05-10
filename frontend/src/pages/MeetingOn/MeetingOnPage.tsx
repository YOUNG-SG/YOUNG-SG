import { Navigate, useLocation } from "react-router-dom";

import MeetingTest from "../../components/MeetingOn/MeetingTest";
// import SelectFolder from "../../components/MeetingOn/MeetingOff/SelectFolders";

import { tokenStore } from "@/store/tokenStore";
import createRoomStore from "@/store/createRoomStore";
import { useEffect } from "react";
import { getRoomId } from "@/services/Room";

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

  useEffect(() => {
    const fetchRoomId = async () => {
      if (roomId == null) {
        try {
          const { roomid } = await getRoomId(sessionId);
          setRoomId(roomid);
          console.log("roomid", roomid);
        } catch (err) {
          console.log("roomId 에러", err);
        }
      }
    };
    fetchRoomId();
  }, [roomId, sessionId, setRoomId]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {/* <Meeting /> */}
      {roomId && <MeetingTest roomId={roomId} />}
      {/* <SelectFolder /> */}
    </>
  );
};

export default MeetingOn;
