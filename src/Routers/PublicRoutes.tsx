import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../Store/hooks";
import { ROUTES } from "../Constants";

export const PublicRoutes = () => {
  const { isAuthenticated } = useAppSelector((store) => store.auth);
  return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Outlet />;
};

export default PublicRoutes;
