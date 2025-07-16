import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./applyPage.scss";

function ApplyPage() {
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();

  const [recruitmentPost, setRecruitmentPost] = useState(null);
  const [errorPost, setErrorPost] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cvLink, setCvLink] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    const fetchRecruitmentPost = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/recruitment/${id}`, {
          withCredentials: true,
        });
        setRecruitmentPost(res.data.recruitment);
      } catch {
        setErrorPost("Failed to load recruitment details.");
        toast.error("Failed to load recruitment details.");
      }
    };

    fetchRecruitmentPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !cvLink) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:3000/api/recruitment/${id}/apply`,
        {
          fullName,
          email,
          phone,
          cvLink,
          portfolioLink,
          coverLetter,
        },
        {
          withCredentials: true,
        }
      );
      toast.success(res.data.message || "Application submitted successfully.");
      setFullName("");
      setEmail("");
      setPhone("");
      setCvLink("");
      setPortfolioLink("");
      setCoverLetter("");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Failed to submit application.");
      } else {
        toast.error("Failed to submit application.");
      }
    }
  };

  if (errorPost) return <div className="apply-error-msg">{errorPost}</div>;
  if (!recruitmentPost) return <div className="apply-error-msg">No recruitment data found.</div>;

  if (!currentUser || (currentUser.role !== "user" && currentUser.role !== "agent"))
    return (
      <div className="apply-error-msg">
        You must be logged in as a user or agent to apply.{" "}
        <Link to="/login">Login here</Link>
      </div>
    );

  return (
    <div className="apply-page">
      <div className="apply-wrapper">
        <h2 className="apply-title">
          Apply for{" "}
          <Link to={`/admindashboard/managerecruitments/${recruitmentPost.id}`}>
            <span>{recruitmentPost.title || "N/A"}</span>
          </Link>
        </h2>

        <form className="apply-form" onSubmit={handleSubmit}>
          <label>
            Full Name*:
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>

          <div className="row-two">
            <label>
              Email*:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              Phone*:
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="row-two">
            <label>
              CV Link*:
              <input
                type="url"
                value={cvLink}
                onChange={(e) => setCvLink(e.target.value)}
                placeholder="Link to your CV"
                required
              />
            </label>

            <label>
              Portfolio Link:
              <input
                type="url"
                value={portfolioLink}
                onChange={(e) => setPortfolioLink(e.target.value)}
                placeholder="Optional portfolio link"
              />
            </label>
          </div>

          <label>
            Cover Letter:
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write your cover letter here..."
            />
          </label>

          <button type="submit" className="btn apply-submit-btn">
            Submit Application
          </button>
        </form>
      </div>
      <div className="apply-image">
        <img src="/career.png" alt="Career" />
      </div>
      <ToastContainer position="top-center" autoClose={4000} hideProgressBar newestOnTop closeOnClick pauseOnHover />
    </div>
  );
}

export default ApplyPage;
