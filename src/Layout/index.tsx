import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../Store/hooks";
import { setIsMobile, setSidebarOpen } from "../Store/Slices/LayoutSlice";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { CommonUpload } from "../Components/Common";
import { Queries } from "../Api";
import { setUser } from "../Store/Slices/AuthSlice";
import { setCompany } from "../Store/Slices/CompanySlice";
import CommonVideoModal from "../Components/Common/Modal/CommonVideoModal";

const Layout = () => {
  const { isExpanded, isMobileOpen, isApplicationMenuOpen } = useAppSelector((state) => state.layout);
  const dispatch = useDispatch();
  const location = useLocation();

  const { user } = useAppSelector((state) => state.auth);
  const { data: userData, isLoading: userLoading } = Queries.useGetUserdata(user?._id);

  const { data: companyData, isLoading: companyLoading } = Queries.useGetSingleCompany(user?.companyId?._id);

  useEffect(() => {
    if (location.pathname.startsWith("/pos")) dispatch(setSidebarOpen(false));
    else dispatch(setSidebarOpen(true));
  }, [dispatch, location.pathname]);

  useEffect(() => {
    if (userData) {
      dispatch(setUser(userData?.data));
    }
  }, [userData, userLoading]);

  useEffect(() => {
    if (companyData) {
      dispatch(setCompany(companyData?.data));
    }
  }, [companyData, companyLoading]);

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
        <div className={`flex-1 transition-all duration-300 ease-linear ${isApplicationMenuOpen ? "pt-30 xsm:pt-35" : "pt-16"} lg:pt-[78px] ${isExpanded ? "lg:ml-[290px]" : "lg:ml-[90px]"} ${isMobileOpen ? "ml-0" : ""}`}>
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
