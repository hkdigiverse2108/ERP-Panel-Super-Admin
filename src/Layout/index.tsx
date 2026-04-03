import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet,     } from "react-router-dom";
import { useAppSelector } from "../Store/hooks";
import { setIsMobile, setPermission,   } from "../Store/Slices/LayoutSlice";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { ProductRenameModal, CommonTermsAndConditionFormModal, CommonTermsAndConditionSelectModal, CommonUpload } from "../Components/Common";


import { Queries } from "../Api";
import CommonVideoModal from "../Components/Common/Modal/CommonVideoModal";
import { setUser } from "../Store/Slices/AuthSlice";
import Loader from "./Loader";

const Layout = () => {
  const { isExpanded, isMobileOpen, isApplicationMenuOpen } = useAppSelector((state) => state.layout);
  const dispatch = useDispatch();
  // const location = useLocation();

  const { user } = useAppSelector((state) => state.auth);
  const { data: userData, isLoading: userLoading } = Queries.useGetSingleUser(user?._id);
  const { data: permissionData, isLoading: permissionLoading } = Queries.useGetPermissionChildDetails({ userId: user?._id }, Boolean(user?._id));
  const isAppLoading = userLoading || permissionLoading;

  // useEffect(() => {
  //   if (location.pathname.startsWith("/pos")) dispatch(setSidebarOpen(false));
  //   // else dispatch(setSidebarOpen(true));
  // }, [dispatch, location.pathname]);

  useEffect(() => {
    if (userData?.data) {
      const fetchedData = userData.data as any;
      const userProfile = Array.isArray(fetchedData) ? fetchedData[0] : fetchedData;
      if (userProfile) {
        dispatch(setUser(userProfile));
      }
    }
  }, [dispatch, userData]);

  useEffect(() => {
    if (permissionData) {
      dispatch(setPermission(permissionData?.data));
    }
  }, [dispatch, permissionData]);

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
      <Loader loading={isAppLoading} />
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
      <CommonTermsAndConditionFormModal />
      <CommonTermsAndConditionSelectModal />
      <ProductRenameModal />
    </>


  );
};

export default Layout;
