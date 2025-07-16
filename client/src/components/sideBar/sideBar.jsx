import React, { useContext } from 'react';
import "./sidebar.scss";
import { FaSignOutAlt, FaTachometerAlt, FaBuilding, FaUsersCog, FaUserEdit, FaBriefcase } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function SideBar() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const defaultAvatar = "/default-avatar.png";
  const avatarSrc = currentUser?.avatar
    ? `http://localhost:3000${currentUser.avatar}`
    : defaultAvatar;

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

  return (
    <div className="sidebar-container">
      <div className="profile-section">
        <div className="avatar-container">
          <img
            src={avatarSrc}
            alt="admin avatar"
            className="avatar"
          />
        </div>
        <div className="admin-info">
          <p className="admin-name">{currentUser?.username || "Admin Name"}</p>
          <p className="admin-email">{currentUser?.email || "admin@gmail.com"}</p>
        </div>
      </div>
      <div className="divider"></div>
      <div className="admin-links">
        <NavLink
          to="/admindashboard"
          className={({ isActive }) =>
            isActive ? "admin-link active dashboard-link" : "admin-link dashboard-link"
          }
          end
        >
          <FaTachometerAlt className="icon" /> Dashboard
        </NavLink>

        <NavLink
          to="/admindashboard/manageproperties"
          className={({ isActive }) =>
            isActive ? "admin-link active manage-properties" : "admin-link manage-properties"
          }
        >
          <FaBuilding className="icon" /> Manage Properties
        </NavLink>

        <NavLink
          to="/admindashboard/manageagents"
          className={({ isActive }) =>
            isActive ? "admin-link active manage-agents" : "admin-link manage-agents"
          }
        >
          <FaUsersCog className="icon" /> Manage Agents
        </NavLink>

        <NavLink
          to="/admindashboard/managerecruitments"
          className={({ isActive }) =>
            isActive ? "admin-link active manage-recruitment" : "admin-link manage-recruitment"
          }
        >
          <FaBriefcase className="icon" /> Manage Recruitments
        </NavLink>

        <NavLink
          to="/admindashboard/settings"
          className={({ isActive }) =>
            isActive ? "admin-link active update-profile" : "admin-link update-profile"
          }
        >
          <FaUserEdit className="icon" /> Update Profile
        </NavLink>
      </div>
      <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" /> Logout
        </button>
      </div>
    </div>
  );
}

export default SideBar;
