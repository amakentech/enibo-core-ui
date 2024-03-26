import { useAppState } from "@/store/state";
import { FC } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {}

const ProtectedRoute: FC<ProtectedRouteProps> = () => {
  const location = useLocation();
  const { appState } = useAppState();
  if (appState.user.username === "") {
    //redirect to login
    return (
      <Navigate to="/" state={{ from: location.pathname }} replace={true} />
    );
  }
  return <Outlet />;
};

export default ProtectedRoute;
