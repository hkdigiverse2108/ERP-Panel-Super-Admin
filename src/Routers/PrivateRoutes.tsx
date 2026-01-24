import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../Store/hooks";
import { PageRoutes } from "./PageRoutes";
import { ROUTES } from "../Constants";

const isAddEditRoute = (path: string) => path.includes("add") || path.includes("edit") || path.includes("add-edit");

const normalizeTabName = (name: string) => name.toLowerCase().replace(/\s+/g, "");
const PrivateRoutes = () => {
  const location = useLocation();
  const { permission } = useAppSelector((state) => state.layout);

  // current route config
  const currentRoute = PageRoutes.find((r) => r.path === location.pathname);

  // route ma name nathi → allow
  if (!currentRoute?.name) {
    return <Outlet />;
  }

  const routeTab = normalizeTabName(currentRoute.name);
  const isAddEdit = isAddEditRoute(location.pathname);

  // 🔥 Permission check with parent support
  const hasPermission = permission.some((parent) => {
    const parentTab = normalizeTabName(parent?.tabName || "");

    // 🔹 Parent level route
    if (parentTab === routeTab) {
      return isAddEdit ? parent.add || parent.edit : parent.view;
    }

    // 🔹 Child level route (ONLY if parent hasView)
    if (parent.view && parent.children?.length) {
      return parent.children.some((child) => {
        const childTab = normalizeTabName(child?.tabName || "");

        if (childTab !== routeTab) return false;

        return isAddEdit ? child.add || child.edit : child.view;
      });
    }

    return false;
  });

  if (!hasPermission) {
    return <Navigate to={ROUTES.NOT_FOUND} replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
