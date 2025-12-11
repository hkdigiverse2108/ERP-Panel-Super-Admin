import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../Constants";
import { useAppSelector } from "../Store/hooks";

export const PrivateRoutes = () => {
  const { isAuthenticated } = useAppSelector((store) => store.auth);
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.AUTH.SIGNIN} replace />;
};

export default PrivateRoutes;
