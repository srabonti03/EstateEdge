import { useState, useContext, useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./agentProfileUpdatePage.scss";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

function AgentProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || "");
      setLocation(currentUser.location || "");
      setPhone(currentUser.phone || "");
      setEmail(currentUser.email || "");
      setBio(currentUser.bio || "");
      setImagePreview(
        currentUser.avatar
          ? `http://localhost:3000${currentUser.avatar}`
          : null
      );
    }
  }, [currentUser]);

  const avatarSrc = imagePreview || "/default-avatar.png";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      setError("Passwords do not match!");
      toast.error("Passwords do not match!", { position: "top-center" });
      return;
    }

    setError("");

    const formData = new FormData();
    formData.append("username", username);
    formData.append("location", location);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("bio", bio);
    if (password) {
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
    }
    if (imageFile) {
      formData.append("avatar", imageFile);
    }

    try {
      const response = await fetch("http://localhost:3000/api/agent/updateagentprofile", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update agent profile");
        toast.error(errorData.message || "Failed to update agent profile", {
          position: "top-center",
        });
      } else {
        const data = await response.json();
        const updatedUser = {
          ...currentUser,
          ...data.user,
        };
        updateUser(updatedUser);
        toast.success("Agent profile updated successfully!", {
          position: "top-center",
        });
        setTimeout(() => {
          navigate("/agentprofile");
        }, 2000);
      }
    } catch (err) {
      setError("An error occurred. Try again.");
      toast.error("An error occurred. Try again.", { position: "top-center" });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handlePlusClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="profileUpdatePage">
      <ToastContainer />
      <div className="profileInfo">
        <div
          className="avatarContainer"
          onClick={handlePlusClick}
          style={{ cursor: "pointer" }}
        >
          <img src={avatarSrc} alt="Avatar" className="avatar" />
          <div className="editIcon">
            <FaPlus size={20} />
          </div>
        </div>
        <div className="info">
          <h2>{currentUser?.username?.trim() || "Username not available"}</h2>
          <span>
            {currentUser?.agentTitle
              ? currentUser.agentTitle.trim().replace(/_/g, " ")
              : "Agent"}
          </span>
          <p>{currentUser?.location?.trim() || "Location not available"}</p>
          <p>{currentUser?.phone?.trim() || "Phone number not available"}</p>
          <p>{currentUser?.email?.trim() || "Email not available"}</p>
          <p>{currentUser?.bio?.trim() || "No bio available."}</p>
        </div>
      </div>

      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Details</h1>

          <div className="rowItem">
            <div className="item halfItem">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="item halfItem">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="rowItem">
            <div className="item halfItem">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                value={location}
                autoComplete="off"
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="item halfItem">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="text"
                value={phone}
                autoComplete="off"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="item">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="4"
              placeholder="Write a brief bio about yourself"
            />
          </div>

          <div className="rowItem">
            <div className="item halfItem">
              <label htmlFor="password">New Password</label>
              <input
                id="password"
                type="password"
                value={password}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="item halfItem">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                autoComplete="new-password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="item profileImageItem">
            <label htmlFor="profileImage">Profile Image</label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
          </div>

          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
}

export default AgentProfileUpdatePage;
