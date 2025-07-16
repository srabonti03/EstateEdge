import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaGoogle,
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./register.scss";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { username, email, password } = formData;

    if (!username || !email || !password) {
      toast.error("Please fill in all fields.", {
        position: "top-center",
      });
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed.", {
          position: "top-center",
        });
        setError(data.message || "Registration failed.");
      } else {
        toast.success(data.message, {
          position: "top-center",
        });
        setSuccess(data.message);
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.", {
        position: "bottom-center",
      });
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <ToastContainer />
      <div className="form-container">
        <div className="sign-up">
          <form autoComplete="off" onSubmit={handleSubmit}>
            <input type="text" name="fakeuser" style={{ display: "none" }} />
            <input type="password" name="fakepass" style={{ display: "none" }} />
            <h1>Create Account</h1>
            <div className="social-icons">
              <a href="#" className="icon"><FaGoogle /></a>
              <a href="#" className="icon"><FaFacebookF /></a>
              <a href="#" className="icon"><FaGithub /></a>
              <a href="#" className="icon"><FaLinkedinIn /></a>
              <a href="#" className="icon"><FaInstagram /></a>
              <a href="#" className="icon"><FaTwitter /></a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              name="username"
              autoComplete="new-name"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              autoComplete="new-email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
            />
            <button type="submit">Sign Up</button>

            <p className="register-redirect-text">
              Already have an account?{" "}
              <Link to="/login" className="register-redirect-link">
                Sign in here.
              </Link>
            </p>
          </form>
        </div>

        <div className="welcome-message">
          <div className="welcome-container">
            <div className="register-logo-container">
              <img src="/form.png" alt="Register Logo" className="register-welcome-logo" />
            </div>
            <div className="register-text-content">
              <h1>Welcome Back to EstateEdge</h1>
              <p>Your journey doesn’t start here — it continues. Log in to pick up where you left off and move one step closer to your dream lifestyle.</p>
              <Link to="/login">
                <button className="login-btn">Sign In</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
