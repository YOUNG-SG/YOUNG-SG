import { Navigate, useLocation } from "react-router-dom";

import MeetingTest from "../../components/MeetingOn/MeetingTest";
import MeetingOff from "../../components/MeetingOn/MeetingOff/Folders";
import { tokenStore } from "@/store/tokenStore";
import createRoomStore from "@/store/createRoom";
import { useEffect } from "react";

const MeetingOn = () => {
  const { token } = tokenStore();
  const { setSessionId } = createRoomStore();

  const location = useLocation();
  const segments = location.pathname.split("/");
  const code = segments.length > 3 ? segments[3] : null;

  useEffect(() => {
    if (code) {
      setSessionId(code);
    }
  }, [code]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {/* <Meeting /> */}
      <MeetingTest />
      <MeetingOff />
    </>
  );
};

export default MeetingOn;
