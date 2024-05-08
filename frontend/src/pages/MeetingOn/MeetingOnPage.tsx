import { Navigate, useLocation } from "react-router-dom";

import MeetingTest from "../../components/MeetingOn/MeetingTest";
import MeetingOff from "../../components/MeetingOn/MeetingOff/Folders";

const MeetingOn = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  console.log(token);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
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
