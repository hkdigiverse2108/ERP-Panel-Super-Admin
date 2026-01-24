import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../Store/hooks";
import { setIsMobile, setPermission, setSidebarOpen } from "../Store/Slices/LayoutSlice";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { CommonUpload } from "../Components/Common";
import { Queries } from "../Api";
import { setUser } from "../Store/Slices/AuthSlice";
import CommonVideoModal from "../Components/Common/Modal/CommonVideoModal";

const Layout = () => {
  const { isExpanded, isMobileOpen, isApplicationMenuOpen } = useAppSelector((state) => state.layout);
  const dispatch = useDispatch();
  const location = useLocation();

  const { user } = useAppSelector((state) => state.auth);
  const { data: userData, isLoading: userLoading } = Queries.useGetUserdata(user?._id);
  const { data: permissionData, isLoading: permissionLoading } = Queries.useGetPermissionChildDetails({ userId: user?._id }, Boolean(user?._id));

  useEffect(() => {
    if (location.pathname.startsWith("/pos")) dispatch(setSidebarOpen(false));
    else dispatch(setSidebarOpen(true));
  }, [dispatch, location.pathname]);

  useEffect(() => {
    if (userData) {
      dispatch(setUser(userData?.data));
    }
  }, [dispatch, userData, userLoading]);

  useEffect(() => {
    if (permissionData) {
      dispatch(setPermission(permissionData?.data));
    }
  }, [dispatch, permissionData, permissionLoading]);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      dispatch(setIsMobile(isMobile));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  return (
    <>
      <div className="min-h-screen xl:flex overflow-hidden">
        <div>
          <Sidebar />
        </div>
        <div className={`flex-1 transition-all duration-300 ease-linear ${isApplicationMenuOpen ? "pt-30 xsm:pt-35" : "pt-16"} lg:pt-19.5 ${isExpanded ? "lg:ml-72.5" : "lg:ml-22.5"} ${isMobileOpen ? "ml-0" : ""}`}>
          <Header />
          <div className="mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
      <CommonUpload />
      <CommonVideoModal />
    </>
  );
};

export default Layout;
