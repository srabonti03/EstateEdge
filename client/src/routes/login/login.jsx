import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import 'react-toastify/dist/ReactToastify.css';
import {
  FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn, FaInstagram, FaTwitter,
} from "react-icons/fa";
import "./login.scss";

function Login() {
  const navigate = useNavigate();

  const { updateUser } = useContext(AuthContext);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [resetData, setResetData] = useState({
    username: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleForgotPassword = () => setIsForgotPassword(true);
  const handleBackToLogin = () => setIsForgotPassword(false);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleResetChange = (e) => {
    setResetData({ ...resetData, [e.target.name]: e.target.value });
  };

const handleLoginSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:3000/api/auth/login", loginData, {
      withCredentials: true,
    });

    if (response.status === 200) {
      const user = response.data.user;

      localStorage.setItem("user", JSON.stringify(user));
      updateUser(user);

      toast.success(response.data.message || "Login successful", {
        position: "top-center",
      });
      navigate("/");
    } else {
      toast.error(response.data.message || "Login failed", {
        position: "top-center",
      });
    }
  } catch (error) {
    const msg = error?.response?.data?.message || "Login failed";
    toast.error(msg, {
      position: "top-center",
    });
  }
};

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (!resetData.username || !resetData.newPassword || !resetData.confirmPassword) {
      toast.error("All fields are required.", { position: "top-center" });
      return;
    }
    if (resetData.newPassword !== resetData.confirmPassword) {
      toast.error("Passwords do not match.", { position: "top-center" });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/password-reset-request",
        {
          identifier: resetData.username,
          newPassword: resetData.newPassword,
          confirmPassword: resetData.confirmPassword,
        }
      );

      toast.success(response.data.message || "Verification link sent to your email.", {
        position: "top-center",
      });

      setIsForgotPassword(false);
      setResetData({ username: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      const msg = error?.response?.data?.message || "Password reset request failed.";
      toast.error(msg, {
        position: "top-center",
      });
    }
  };

  return (
    <div className="login-container">
    <ToastContainer/>
      <div className="login-form-container">
        <div className="login-welcome-message">
          <div className="login-welcome-container">
            <div className="login-logo-container">
              <img
                src="/form.png"
                alt="Welcome"
                className="login-welcome-logo"
              />
            </div>
            <div className="login-text-content">
              <h1>Don't Have an Account Yet?</h1>
              <p>
                Whether you’re new to EstateEdge or already part of the journey, we’re here to help you find your dream home. Log in to continue where you left off, or sign up to start your adventure today.
              </p>
              <Link to="/register">
                <button className="login-btn">Sign Up</button>
              </Link>
            </div>
          </div>
        </div>

        <div className="login-sign-up">
          {!isForgotPassword ? (
            <>
              <form autoComplete="off" onSubmit={handleLoginSubmit}>
                <input
                  type="text"
                  name="fakeusernameremembered"
                  style={{ display: "none" }}
                />
                <input
                  type="password"
                  name="fakepasswordremembered"
                  style={{ display: "none" }}
                />

                <h1>Welcome Back</h1>

                <div className="login-social-icons">
                  <a href="#" className="login-icon"><FaGoogle /></a>
                  <a href="#" className="login-icon"><FaFacebookF /></a>
                  <a href="#" className="login-icon"><FaGithub /></a>
                  <a href="#" className="login-icon"><FaLinkedinIn /></a>
                  <a href="#" className="login-icon"><FaInstagram /></a>
                  <a href="#" className="login-icon"><FaTwitter /></a>
                </div>

                <span>or use your account details</span>

                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  autoComplete="new-username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                />

                <p className="forgot-password-text">
                  <Link to="#" onClick={handleForgotPassword} className="forgot-password-link">
                    Forgot Password?
                  </Link>
                </p>

                <button type="submit">Login</button>

                <p className="login-redirect-text">
                  Don't have an account?{" "}
                  <Link to="/register" className="login-redirect-link">
                    Sign up here.
                  </Link>
                </p>
              </form>
            </>
          ) : (
            <>
              <form autoComplete="off" onSubmit={handleResetSubmit}>
                <h1>Reset Your Password</h1>

                <span>Enter your account details to reset password</span>

                <input
                  name="username"
                  type="text"
                  placeholder="Enter your username or email"
                  autoComplete="username"
                  value={resetData.username}
                  onChange={handleResetChange}
                />

                <input
                  name="newPassword"
                  type="password"
                  placeholder="New Password"
                  autoComplete="new-password"
                  value={resetData.newPassword}
                  onChange={handleResetChange}
                />

                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  value={resetData.confirmPassword}
                  onChange={handleResetChange}
                />

                <p className="back-to-login-text">
                  Remembered your password?{" "}
                  <Link to="#" onClick={handleBackToLogin} className="back-to-login-link">
                    Back to Login
                  </Link>
                </p>

                <button type="submit">Reset Password</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
