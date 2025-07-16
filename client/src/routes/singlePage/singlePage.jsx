import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRegSave,
  FaComment,
  FaGraduationCap,
  FaBus,
  FaUtensils,
  FaDog,
  FaMoneyBill,
} from "react-icons/fa";
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function SinglePage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/post/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };

    fetchPost();
  }, [id]);

  const processedImages = post?.images?.length
    ? post.images.slice(0, 4).map((img) =>
        img.startsWith("http") ? img : `http://localhost:3000${img}`
      )
    : Array(4).fill("/fallback-property.png");

  const handleSendMessage = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/chat`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiverId: post?.user?.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message || "Error initiating chat");
        return;
      }

      const chatId = data.chat.id || data.chat._id;
      if (chatId) {
        navigate(`/profile/${post?.user?.id}?chatId=${chatId}`);
      }
    } catch (err) {
      console.error("Failed to create or fetch chat:", err);
    }
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={processedImages} />

          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post?.title}</h1>
                <div className="address">
                  <FaMapMarkerAlt size={16} color="#ff6347" />
                  <span>{post?.address}</span>
                </div>
                <div className="price">
                  <span style={{ color: "gold" }}>TK {post?.price}</span>
                </div>
              </div>
              {currentUser && (
                <Link to={`/agent/${post?.user?.id}`} className="user">
                  <img
                    src={
                      post?.user?.avatar
                        ? `http://localhost:3000${post.user.avatar}`
                        : "/default-avatar.png"
                    }
                    alt=""
                  />
                  <span>{post?.user?.username}</span>
                </Link>
              )}
            </div>

            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: post?.postDetail?.desc || "<p>No description</p>",
              }}
            />
          </div>
        </div>
      </div>

      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <FaUtensils size={16} color="#00bfff" />
              <div className="featureText">
                <span>Utilities</span>
                <p>{post?.postDetail?.utilities}</p>
              </div>
            </div>
            <div className="feature">
              <FaDog size={16} color="#32cd32" />
              <div className="featureText">
                <span>Pet Policy</span>
                <p>{post?.postDetail?.pet}</p>
              </div>
            </div>
            <div className="feature">
              <FaMoneyBill size={16} color="#a64dff" />
              <div className="featureText">
                <span>Property Fees</span>
                <p>{post?.postDetail?.income}</p>
              </div>
            </div>
          </div>

          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <FaMapMarkerAlt size={16} color="#ff6347" />
              <span>{post?.postDetail?.size} sqft</span>
            </div>
            <div className="size">
              <FaBed size={16} color="#f4a460" />
              <span>{post?.bedroom} beds</span>
            </div>
            <div className="size">
              <FaBath size={16} color="#00bfff" />
              <span>{post?.bathroom} bathrooms</span>
            </div>
          </div>

          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <FaGraduationCap size={16} color="#ffff00" />
              <div className="featureText">
                <span>School</span>
                <p>{post?.postDetail?.school}m away</p>
              </div>
            </div>
            <div className="feature">
              <FaBus size={16} color="#9b59b6" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{post?.postDetail?.bus}m away</p>
              </div>
            </div>
            <div className="feature">
              <FaUtensils size={16} color="#ff7f00" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{post?.postDetail?.restaurant}m away</p>
              </div>
            </div>
          </div>

          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={post ? [post] : []} />
          </div>

          {currentUser?.role === "user" && !post?.isSold && (
            <div className="buttons">
              <button onClick={handleSendMessage}>
                <FaComment size={16} color="#20b2aa" />
                Send a Message
              </button>
              <button>
                <FaRegSave size={16} color="#3cb371" />
                Save the Place
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
