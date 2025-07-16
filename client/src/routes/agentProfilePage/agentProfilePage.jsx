import "./agentprofilePage.scss";
import { Link, useNavigate } from "react-router-dom";
import ChatSection from "../../components/chatSection/chatSection";
import List from "../../components/list/List";
import {
  FaFacebookMessenger,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";

function AgentProfilePage() {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const [showBio, setShowBio] = useState(false);
  const [posts, setPosts] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const isActive = Boolean(currentUser?.isActive);
  const navigate = useNavigate();

  const formatRole = (titleKey) => {
    if (!titleKey) return "Agent";
    return titleKey
      .replace(/_/g, " ")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      fetchApprovedPosts(currentUser.id);
    }
  }, [currentUser]);

  const fetchApprovedPosts = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/post/approved/${userId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch approved posts");
      }

      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Error fetching approved posts:", err.message);
    }
  };

  const handleChatClick = (e) => {
    if (!isLargeScreen) {
      e.preventDefault();
      navigate("/chatsection");
    }
  };

  const toggleBio = () => {
    setShowBio((prev) => !prev);
  };

  const defaultAvatar = "/default-avatar.png";

  const avatarSrc = currentUser?.avatar
    ? `http://localhost:3000${currentUser.avatar}`
    : defaultAvatar;

  const username = currentUser?.username?.trim() || "Invalid username";
  const email = currentUser?.email?.trim() || "Invalid email";
  const phone = currentUser?.phone?.trim() || "Invalid phone number";
  const location = currentUser?.location?.trim() || "Invalid location";
  const agentTitle = currentUser?.agentTitle || "";
  const role = formatRole(agentTitle);
  const bio = currentUser?.bio?.trim() || `No bio available.`;

  return (
    <div className="agentProfilePage">
      <div className="agentProfilePage-details">
        <div className="agentProfilePage-wrapper">
          <div className="agentProfilePage-title">
            <div className="agentProfilePage-info">
              <img
                src={avatarSrc}
                alt={`${username} Avatar`}
                className="agentProfilePage-avatar"
                onError={(e) => {
                  e.currentTarget.src = defaultAvatar;
                }}
              />
              <div className="agentProfilePage-textInfo">
                <b>{username}</b>
                <span>{role}</span>
                <p>{location}</p>
                <p>Phone: {phone}</p>
                <p>Email: {email}</p>

                <button
                  onClick={toggleBio}
                  className="agentProfilePage-bio-toggle"
                >
                  {showBio ? <FaChevronUp /> : <FaChevronDown />} Bio
                </button>

                <p className={`agentProfilePage-bio ${showBio ? "show" : ""}`}>
                  {bio}
                </p>
              </div>
            </div>

            <div className="agentProfilePage-profile-actions">
              <Link
                to="/agentprofile/update"
                className="agentProfilePage-button"
              >
                Update Profile
              </Link>
              <Link to="/chatsection" onClick={handleChatClick}>
                <FaFacebookMessenger className="agentProfilePage-chat-icon" />
              </Link>
            </div>
          </div>

          <div className="agentProfilePage-title">
            <h1>Property List</h1>
            {isActive && (
              <Link to="/add" className="agentProfilePage-button">
                Create New Listing
              </Link>
            )}
          </div>

          <List items={posts} />
        </div>
      </div>

      {isLargeScreen && <ChatSection />}
    </div>
  );
}

export default AgentProfilePage;
