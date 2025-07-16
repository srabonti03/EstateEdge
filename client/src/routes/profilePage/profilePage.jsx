import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import ChatSection from "../../components/chatSection/chatSection";
import List from "../../components/list/List";
import "./profilePage.scss";
import { FaFacebookMessenger } from "react-icons/fa";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";

function ProfilePage() {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const location = useLocation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const { agentId } = useParams();
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("chatId");

  const { currentUser } = useContext(AuthContext);

  const defaultAvatar = "default-avatar.png";

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      fetchSavedPosts(currentUser.id);
    }
  }, [currentUser]);

  const fetchSavedPosts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/post/savedposts", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch saved posts");
      }

      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Error fetching saved posts:", err.message);
    }
  };

  const handleChatClick = (e) => {
    if (!isLargeScreen) {
      e.preventDefault();
      navigate("/chatsection");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-details">
        <div className="profile-wrapper">
          <div className="profile-title">
            <div className="profile-info">
              <img
                src={
                  currentUser?.avatar
                    ? `http://localhost:3000${currentUser.avatar}`
                    : defaultAvatar
                }
                alt="User Avatar"
              />
              <div className="profile-text-info">
                <b>{currentUser?.username || "Unknown User"}</b>
                <span>{currentUser?.email || "No email provided"}</span>
              </div>
            </div>
            <div className="profile-actions">
              <Link to="/profile/update" className="profile-button">
                Update Profile
              </Link>
              <Link to="/chatsection" onClick={handleChatClick}>
                <FaFacebookMessenger className="chat-icon" />
              </Link>
            </div>
          </div>

          <div className="profile-title">
            <h1>My List</h1>
          </div>

          <List items={posts} />
        </div>
      </div>

      {chatId && <ChatSection chatId={chatId} />}

      {isLargeScreen && !chatId && <ChatSection chatId={null} />}
    </div>
  );
}

export default ProfilePage;
