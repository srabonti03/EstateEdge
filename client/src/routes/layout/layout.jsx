import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Layout() {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  const publicPaths = ["/", "/list", "/about", "/login", "/register"];

  const protectedPaths = [
    "/add",
    "/update",
    "/profile",
    "/profile/update",
    "/agentprofile",
    "/agentprofile/update",
    "/agent",
    "/agent/",
    "/admindashboard",
    "/chatsection",
    "/contact",
    "/career",
    "/managerecruitments/:id/applicants",
    "managerecruitments/:recruitmentId/applicant/:userId",
  ];

  const pathname = location.pathname;

  const isSingleSegment = pathname !== "/" && pathname.split("/").filter(Boolean).length === 1;

  if (publicPaths.includes(pathname) || isSingleSegment) {
    return (
      <div className="layout">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="content">
          <Outlet />
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    );
  }

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
