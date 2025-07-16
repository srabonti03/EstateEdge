import React, { useState, useContext, useRef, useEffect } from "react";
import "./profileSettings.scss";
import { FaPlus } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function ProfileSettings() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [previewImage, setPreviewImage] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || "");
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  const defaultAvatar = "/default-avatar.png";
  const avatarSrc = previewImage
    ? previewImage
    : currentUser?.avatar
    ? `http://localhost:3000${currentUser.avatar}`
    : defaultAvatar;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ((password || confirmPassword) && password !== confirmPassword) {
      setError("Passwords do not match!");
      toast.error("Passwords do not match!", { position: "top-center" });
      return;
    }

    setError("");
    const formData = new FormData();

    if (username.trim() && username !== currentUser.username)
      formData.append("username", username);
    if (email.trim() && email !== currentUser.email)
      formData.append("email", email);
    if (password.trim()) formData.append("password", password);
    if (confirmPassword.trim()) formData.append("confirmPassword", confirmPassword);
    if (fileInputRef.current?.files[0]) {
      formData.append("avatar", fileInputRef.current.files[0]);
    }

    try {
      const response = await fetch("http://localhost:3000/api/admin/updateadminprofile", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to update profile");
        toast.error(result.message || "Failed to update profile", {
          position: "top-center",
        });
      } else {
        const updatedUser = {
          ...currentUser,
          ...result.admin,
        };
        updateUser(updatedUser);
        toast.success("Profile updated successfully!", {
          position: "top-center",
        });
        setTimeout(() => {
          navigate("/admindashboard");
        }, 2000);
      }
    } catch (err) {
      setError("An error occurred. Try again.");
      toast.error("An error occurred. Try again.", { position: "top-center" });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handlePlusClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="settings-wrapper">
      <ToastContainer />
      <div className="user-preview">
        <div className="user-details">
          <div className="image-box" onClick={handlePlusClick} style={{ cursor: "pointer" }}>
            <img src={avatarSrc} alt="admin avatar" className="user-avatar" />
            <label htmlFor="file-input" className="plus-icon">
              <FaPlus />
            </label>
            <input
              type="file"
              id="file-input"
              style={{ display: "none" }}
              onChange={handleImageChange}
              accept="image/*"
              ref={fileInputRef}
            />
          </div>
          <div className="info-box">
            <p className="user-name">{currentUser?.username || "Admin Name"}</p>
            <p className="user-email">{currentUser?.email || "admin@gmail.com"}</p>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-container">
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group avatar-input">
              <label htmlFor="avatar">Change Avatar</label>
              <input
                type="file"
                id="avatar"
                onChange={handleImageChange}
                accept="image/*"
                ref={fileInputRef}
              />
            </div>

            <button type="submit" className="submit-btn">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;
