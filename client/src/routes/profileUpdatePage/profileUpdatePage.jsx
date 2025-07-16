import { useState, useContext, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState(currentUser?.username || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);

  const fileInputRef = useRef(null);

  const defaultAvatar = "/default-avatar.png";
  const avatarSrc = image ? image : (currentUser?.avatar ? `http://localhost:3000${currentUser.avatar}` : defaultAvatar);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      toast.error("Passwords do not match!", { position: "top-center" });
      return;
    } else {

      setError("");

      const formData = new FormData();
      formData.append("new_username", username);
      formData.append("new_email", email);
      formData.append("new_password", password);
      formData.append("confirm_password", confirmPassword);
      if (image && fileInputRef.current?.files[0]) {
        formData.append("avatar", fileInputRef.current.files[0]);
      }

      try {
        const response = await fetch("http://localhost:3000/api/user/updateuserprofile", {
          method: "PUT",
          body: formData,
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || "Failed to update profile");
          toast.error(errorData.message || "Failed to update profile", {
            position: "top-center",
          });
        } else {
          const data = await response.json();
          const updatedUser = {
            ...currentUser,
            ...data.user,
          };
          updateUser(updatedUser);
          toast.success("Profile updated successfully!", {
            position: "top-center",
          });
          setTimeout(() => {
            navigate("/profile");
          }, 2000);
        }
      } catch (err) {
        setError("An error occurred. Try again.");
        toast.error("An error occurred. Try again.", { position: "top-center" });
      }
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
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
          <img src={avatarSrc} alt="Avatar" className="user-avatar" />
          <div className="editIcon">
            <FaPlus size={20} />
          </div>
        </div>
        <div className="info">
          <h2>{currentUser?.username || "Unknown User"}</h2>
          <p>{currentUser?.email || "No email provided"}</p>
        </div>
      </div>

      <div className="formContainer">
        <form onSubmit={handleSubmit} autoComplete="off">
          <h1>Update Details</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="new_username"
              type="text"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="new_email"
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="rowItem">
            <div className="item halfItem">
              <label htmlFor="password">Old Password</label>
              <input
                id="password"
                name="new_password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="item halfItem">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirm_password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>
          <div className="item profileImageItem">
            <label htmlFor="avatar">Profile Image</label>
            <input
              id="avatar"
              name="avatar"
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

export default ProfileUpdatePage;