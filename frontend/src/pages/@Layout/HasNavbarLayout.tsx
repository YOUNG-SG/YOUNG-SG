import Navbar from "@/components/@common/Navbar";
import { Navigate, Outlet } from "react-router";

const HasNavbarLayout = () => {
  // FIXME token 생성 후 수정
  const token = "token";

  if (token) {
    return (
      <div className="flex w-full h-full">
        <div style={{ width: "calc(100% - 80px)" }}>
          <Outlet />
        </div>
        <Navbar />
      </div>
    );
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default HasNavbarLayout;
