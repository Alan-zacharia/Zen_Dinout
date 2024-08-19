import { FC } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import {RootState} from "../redux/store";

const PublicRoute: FC = () => {
  const { isAuthenticated, role } = useSelector((state : RootState) => state.user);
  if (role === "user") {
    return isAuthenticated ? <Navigate to={"/"} replace /> : <Outlet />;
  } else if (role === "seller") {
    return isAuthenticated ? (
      <Navigate to={"/restaurant/"} replace />
    ) : (
      <Outlet />
    );
  } else if (role === "admin") {
    return isAuthenticated ? (
      <Navigate to={"/admin/"} replace />
    ) : (
      <Outlet />
    );
  }
  return <Outlet />; 
};

export default PublicRoute;
