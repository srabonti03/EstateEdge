import { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaRegSave,
  FaComment,
  FaEdit,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaCheckCircle,
  FaHeartBroken,
} from "react-icons/fa";
import { FiArchive, FiInbox } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./card.scss";
import { AuthContext } from "../../context/AuthContext";

function Card({ item, onDelete }) {
  const [saved, setSaved] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const role = currentUser?.role;

  useEffect(() => {
    if (currentUser?.role === "user") {
      fetch("http://localhost:3000/api/post/savedposts", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          const isSaved = data.some((savedPost) => savedPost.postId === item.id);
          setSaved(isSaved);
        })
        .catch((err) => {
          console.error("Failed to fetch saved posts:", err);
        });
    }
  }, [item.id, currentUser]);

  const handleSave = () => {
    fetch(`http://localhost:3000/api/post/savedposts/${item.id}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message || "Failed to save post");
          });
        }
        setSaved(true);
        toast.success("Saved to your favorites.", { position: "top-center" });
      })
      .catch((err) => {
        toast.error(`${err.message}`, { position: "top-center" });
      });
  };

  const handleRemoveSave = () => {
    fetch(`http://localhost:3000/api/post/savedposts/${item.id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message || "Failed to remove post");
          });
        }
        setSaved(false);
        toast.info("Removed from your favorites.", { position: "top-center" });
      })
      .catch((err) => {
        toast.error(`Error: ${err.message}`, { position: "top-center" });
      });
  };

  const handleSendMessage = async () => {
    const receiverId = item?.user?.id || item?.userId;
    if (!receiverId) {
      toast.error("User not found for messaging.", { position: "top-center" });
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/chat`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiverId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error initiating chat", { position: "top-center" });
        return;
      }

      const chatId = data.chat.id || data.chat._id;
      if (chatId) {
        navigate(`/profile/${receiverId}?chatId=${chatId}`);
      }
    } catch (err) {
      console.error("Failed to create or fetch chat:", err);
      toast.error("Failed to send message. Try again later.", { position: "top-center" });
    }
  };

  const handleEdit = () => {
    navigate(`/update/${item.id}`);
  };

  const handleMarkAsSold = () => {
    fetch(`http://localhost:3000/api/post/${item.id}/sold`, {
      method: "PUT",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to mark as sold");
        }
        toast.success("Marked as sold.", { position: "top-center" });

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((err) => {
        console.error("Mark as sold failed:", err);
        toast.error(`Error: ${err.message}`, { position: "top-center" });
      });
  };

  const handleArchiveToggle = () => {
    const endpoint = item.isArchived ? "unarchive" : "archive";
    fetch(`http://localhost:3000/api/post/${endpoint}/${item.id}`, {
      method: "PUT",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || `Failed to ${endpoint} post`);
        }
        toast.success(
          `Post ${item.isArchived ? "unarchived" : "archived"} successfully.`,
          { position: "top-center" }
        );
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        toast.error(`Error: ${err.message}`, { position: "top-center" });
      });
  };

  const isProfilePage = location.pathname === "/profile";

  const imageSrc = item.images?.[0]
    ? item.images[0].startsWith("http")
      ? item.images[0]
      : `http://localhost:3000${item.images[0]}`
    : "/fallback-property.png";

  return (
    <>
      <div className="cardcontainer">
        <div className="card">
          <Link to={`/${item.id}`} className="imageContainer">
            <img src={imageSrc} alt={item.title || "Property"} />
          </Link>
          <div className="textContainer">
            <h2 className="title">
              <Link to={`/${item.id}`}>{item.title}</Link>
            </h2>
            <p className="address">
              <FaMapMarkerAlt size={16} style={{ color: "red" }} />
              <span>{item.address}</span>
            </p>
            <p className="price" style={{ color: "yellow" }}>
              TK {item.price}
            </p>
            <div className="bottom">
              <div className="features">
                <div className="feature">
                  <FaBed size={16} style={{ color: "#d5d19f" }} />
                  <span>{item.bedroom} bedroom</span>
                </div>
                <div className="feature">
                  <FaBath size={16} style={{ color: "#d5d19f" }} />
                  <span>{item.bathroom} bathroom</span>
                </div>
              </div>
              <div className="icons">
                {role === "user" ? (
                  <>
                    {isProfilePage || saved ? (
                      <div
                        className="icon"
                        onClick={handleRemoveSave}
                        style={{ cursor: "pointer" }}
                        title="Remove from saved"
                      >
                        <FaHeartBroken size={16} style={{ color: "crimson" }} />
                      </div>
                    ) : (
                      <div
                        className="icon"
                        onClick={handleSave}
                        style={{ cursor: "pointer" }}
                        title="Save to favorites"
                      >
                        <FaRegSave size={16} style={{ color: "#4caf50" }} />
                      </div>
                    )}
                    <div
                      className="icon"
                      onClick={handleSendMessage}
                      style={{ cursor: "pointer" }}
                      title="Message"
                    >
                      <FaComment size={16} style={{ color: "#2196f3" }} />
                    </div>
                  </>
                ) : role === "admin" || (role === "agent" && currentUser?.id === item?.userId) ? (
                  <>
                    <div
                      className="icon"
                      onClick={handleEdit}
                      style={{ cursor: "pointer" }}
                      title="Edit"
                    >
                      <FaEdit size={16} style={{ color: "orange" }} />
                    </div>
                    <div
                      className="icon"
                      onClick={handleArchiveToggle}
                      style={{ cursor: "pointer" }}
                      title={item.isArchived ? "Unarchive" : "Archive"}
                    >
                      {item.isArchived ? (
                        <FiInbox size={16} style={{ color: "#8e24aa" }} />
                      ) : (
                        <FiArchive size={16} style={{ color: "#9c3c2fff" }} />
                      )}
                    </div>
                    <div
                      className="icon"
                      onClick={handleMarkAsSold}
                      style={{ cursor: "pointer" }}
                      title="Mark as Sold"
                    >
                      <FaCheckCircle size={16} style={{ color: "#00c853" }} />
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" style={{ position: "absolute" }} />
    </>
  );
}

export default Card;
