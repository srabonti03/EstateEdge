import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./singleRecruitmentPage.scss";

function SingleRecruitmentPage() {
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [recruitmentPost, setRecruitmentPost] = useState(null);
  const [errorPost, setErrorPost] = useState("");

  useEffect(() => {
    const fetchRecruitmentPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/recruitment/${id}`,
          {
            withCredentials: true,
          }
        );
        setRecruitmentPost(res.data.recruitment);
      } catch (err) {
        setErrorPost("Failed to load recruitment details.");
      }
    };

    fetchRecruitmentPost();
  }, [id]);

  if (errorPost)
    return (
      <div className="single-recruitment-post error-post">{errorPost}</div>
    );
  if (!recruitmentPost)
    return (
      <div className="single-recruitment-post error-post">
        No recruitment data found.
      </div>
    );

  const handleApply = () => {
    navigate(`/recruitment/${id}/apply`);
  };

  return (
    <div className="single-recruitment-page">
      <div className="recruitment-wraper">
        <h2 className="title-post">
          Applicant Details for{" "}
          <Link to={`/admindashboard/managerecruitments/${recruitmentPost.id}`}>
            <span>{recruitmentPost?.title || "N/A"}</span>
          </Link>
        </h2>
        <div className="details-box-post">
          <div className="section-post recruitment-info-post">
            <h3>Post Information</h3>
            <p>
              <strong>Title:</strong> {recruitmentPost.title || "N/A"}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {recruitmentPost.description || "N/A"}
            </p>
            <p>
              <strong>Role:</strong> {recruitmentPost.role || "N/A"}
            </p>
            {recruitmentPost.agentTitle && (
              <p>
                <strong>Agent Title:</strong>{" "}
                {recruitmentPost.agentTitle.replace(/_/g, " ")}
              </p>
            )}
            {recruitmentPost.location && (
              <p>
                <strong>Location:</strong> {recruitmentPost.location}
              </p>
            )}
            {recruitmentPost.positionsAvailable !== undefined && (
              <p>
                <strong>Positions Available:</strong>{" "}
                {recruitmentPost.positionsAvailable}
              </p>
            )}
            <p>
              <strong>Posted On:</strong>{" "}
              {new Date(recruitmentPost.postedDay).toLocaleDateString()}
            </p>
            {recruitmentPost.deadline && (
              <p>
                <strong>Deadline:</strong>{" "}
                {new Date(recruitmentPost.deadline).toLocaleDateString()}
              </p>
            )}
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(recruitmentPost.createdAt).toLocaleString()}
            </p>
            {currentUser &&
              (currentUser.role === "user" || currentUser.role === "agent") && (
                <button className="btn apply-btn-post" onClick={handleApply}>
                  Apply Now
                </button>
              )}
          </div>
        </div>
      </div>
      <div className="image">
        <img src="/career.png" alt="" />
      </div>
    </div>
  );
}

export default SingleRecruitmentPage;
