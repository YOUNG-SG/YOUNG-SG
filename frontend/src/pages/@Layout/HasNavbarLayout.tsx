import Navbar from "@/components/@common/Navbar";
import { Navigate, Outlet } from "react-router";
import { tokenStore } from "@/store/tokenStore";

const HasNavbarLayout = () => {
  const { token } = tokenStore();

  if (token) {
    return (
      <div className="w-full h-full flex justify-between">
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
