import { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HamburgerMenu from "react-hamburger-menu";
import { FiLogOut } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import "./navbar.scss";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser, updateUser } = useContext(AuthContext);

  const user = currentUser?.role === "user";
  const agent = currentUser?.role === "agent";
  const admin = currentUser?.role === "admin";

  const avatarUrl = currentUser?.avatar
    ? currentUser.avatar
    : "/default-avatar.png";

  useEffect(() => {
    if (open) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [open]);

  useEffect(() => {
    if (!currentUser?.id) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/chat/unread/count", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch unread count");
        const data = await res.json();
        setUnreadCount(data.unreadCount || 0);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();

    // Optional: refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [currentUser?.id]);

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        updateUser(null);
        navigate("/");
      } else {
        const err = await response.json();
        console.error("Logout failed:", err?.message || response.statusText);
      }
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleAvatarClick = () => {
    if (admin) {
      navigate("/admindashboard");
    } else if (agent) {
      navigate("/agentprofile");
    } else if (user) {
      navigate("/profile");
    }
    setOpen(false);
  };

  return (
    <nav>
      <div className="left">
        <Link to="/" className="logo" onClick={handleLinkClick}>
          <img src="/logo.png" alt="EstateEdge Logo" />
          <span>EstateEdge</span>
        </Link>
        <div className="navlinks">
          <Link
            to="/"
            onClick={handleLinkClick}
            className={isActive("/") ? "active" : ""}
          >
            Home
          </Link>
          {(user || agent || admin || (!user && !agent && !admin)) && (
            <Link
              to="/list"
              onClick={handleLinkClick}
              className={isActive("/list") ? "active" : ""}
            >
              Properties
            </Link>
          )}
          {admin && (
            <Link
              to="/agent"
              onClick={handleLinkClick}
              className={isActive("/agents") ? "active" : ""}
            >
              agents
            </Link>
          )}
          {user && (
            <>
              <Link
                to="/agent"
                onClick={handleLinkClick}
                className={isActive("/agent") ? "active" : ""}
              >
                Agents
              </Link>
              <Link
                to="/about"
                onClick={handleLinkClick}
                className={isActive("/about") ? "active" : ""}
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={handleLinkClick}
                className={isActive("/contact") ? "active" : ""}
              >
                Contact
              </Link>
            </>
          )}
          {agent && (
            <Link
              to="/contact"
              onClick={handleLinkClick}
              className={isActive("/contact") ? "active" : ""}
            >
              Contact
            </Link>
          )}
          {!user && !agent && !admin && (
            <Link
              to="/about"
              onClick={handleLinkClick}
              className={isActive("/about") ? "active" : ""}
            >
              About
            </Link>
          )}
        </div>
      </div>

      <div className="right">
        {user || agent || admin ? (
          <div className="user">
            <img
              src={
                currentUser?.avatar
                  ? `http://localhost:3000${currentUser.avatar}`
                  : "/default-avatar.png"
              }
              alt="User Profile"
              onClick={handleAvatarClick}
              style={{ cursor: "pointer" }}
              tabIndex={0}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && handleAvatarClick()
              }
            />
            <span
              onClick={handleAvatarClick}
              style={{ cursor: "pointer" }}
              tabIndex={0}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && handleAvatarClick()
              }
              className="username"
            >
              {currentUser?.username}
            </span>

            <Link
              to={
                admin ? "/admindashboard" : agent ? "/agentprofile" : "/profile"
              }
              className={`profile ${
                isActive(
                  admin
                    ? "/admindashboard"
                    : agent
                    ? "/agentprofile"
                    : "/profile"
                )
                  ? "active"
                  : ""
              }`}
              onClick={handleLinkClick}
            >
              {(user || agent) && unreadCount > 0 && (
                <div className="notification">{unreadCount}</div>
              )}
              <span>{admin ? "Dashboard" : "Profile"}</span>
            </Link>

            {!admin && (
              <div
                className="logout-icon"
                onClick={handleLogout}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleLogout()}
                style={{ cursor: "pointer" }}
                title="Logout"
              >
                <FiLogOut size={24} color="#fff67b" />
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              onClick={handleLinkClick}
              className={isActive("/login") ? "active" : ""}
            >
              Sign in
            </Link>
            <Link
              to="/register"
              onClick={handleLinkClick}
              className={`register ${isActive("/register") ? "active" : ""}`}
            >
              Sign up
            </Link>
          </>
        )}

        <div className="menuIcon">
          <HamburgerMenu
            isOpen={open}
            menuClicked={() => setOpen((prev) => !prev)}
            width={25}
            height={15}
            strokeWidth={2}
            color="#fff67b"
            animationDuration={0.3}
          />
        </div>

        <div className={open ? "menu active" : "menu"}>
          <Link
            to="/"
            onClick={handleLinkClick}
            className={isActive("/") ? "active" : ""}
          >
            Home
          </Link>
          {(user || agent || admin || (!user && !agent && !admin)) && (
            <Link
              to="/list"
              onClick={handleLinkClick}
              className={isActive("/list") ? "active" : ""}
            >
              Properties
            </Link>
          )}
          {admin && (
            <>
              <Link
                to="/agent"
                onClick={handleLinkClick}
                className={isActive("/agent") ? "active" : ""}
              >
                Agents
              </Link>
              <Link
                to="/admindashboard"
                onClick={handleLinkClick}
                className={isActive("/admindashboard") ? "active" : ""}
              >
                Dashboard
              </Link>
            </>
          )}
          {agent && (
            <>
              <Link
                to="/agentprofile"
                onClick={handleLinkClick}
                className={isActive("/agentprofile") ? "active" : ""}
              >
                Profile
              </Link>
              <Link
                to="/contact"
                onClick={handleLinkClick}
                className={isActive("/contact") ? "active" : ""}
              >
                Contact
              </Link>
            </>
          )}
          {user && (
            <>
              <Link
                to="/agent"
                onClick={handleLinkClick}
                className={isActive("/agent") ? "active" : ""}
              >
                Agents
              </Link>
              <Link
                to="/about"
                onClick={handleLinkClick}
                className={isActive("/about") ? "active" : ""}
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={handleLinkClick}
                className={isActive("/contact") ? "active" : ""}
              >
                Contact
              </Link>

              <div
                className="logout"
                onClick={handleLogout}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleLogout()}
                style={{ cursor: "pointer" }}
              >
                <span>Logout</span>
              </div>
            </>
          )}
          {!user && !agent && !admin && (
            <>
              <Link
                to="/about"
                onClick={handleLinkClick}
                className={isActive("/about") ? "active" : ""}
              >
                About
              </Link>
              <Link
                to="/login"
                onClick={handleLinkClick}
                className={isActive("/login") ? "active" : ""}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={handleLinkClick}
                className={`register ${isActive("/register") ? "active" : ""}`}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
