import { Navigate, useLocation } from "react-router-dom";
import { tokenStore } from "@/store/tokenStore";
import createRoomStore from "@/store/createRoomStore";
import { useEffect } from "react";
import { getRoomId } from "@/services/Room";
import MeetingTest2 from "@/components/MeetingOn/MeetingTest2";
import { fetchMyProfile } from "@/services/MyPage";
import useMeetingStore from "@/store/meetingStore";

const MeetingOn = () => {
  const { token } = tokenStore();
  const { setSessionId, sessionId, roomId, setRoomId } = createRoomStore();
  const { username, setUsername } = useMeetingStore();
  const location = useLocation();
  const segments = location.pathname.split("/");
  const code = segments.length > 3 ? segments[3] : null;

  useEffect(() => {
    if (code) {
      setSessionId(code);
    }
  }, [code]);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const { email, nickName, profileImg } = await fetchMyProfile();
        setUsername(nickName);
        console.log(email, profileImg);
        console.log(nickName, "유저 네임");
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsername();
  }, []);

  useEffect(() => {
    const fetchRoomId = async () => {
      if (roomId == null) {
        try {
          const { roomid } = await getRoomId(sessionId);
          setRoomId(roomid);
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
      {roomId && username && (
        <MeetingTest2 roomId={roomId} sessionId={sessionId} username={username} />
      )}
    </>
  );
};

export default MeetingOn;
