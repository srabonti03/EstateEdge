import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./singleApplicant.scss";

function SingleApplicant() {
  const { recruitmentId, userId } = useParams();
  const [applicant, setApplicant] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/recruitment/${recruitmentId}/applicant/${userId}`,
          { withCredentials: true }
        );
        setApplicant(res.data.application);
      } catch (err) {
        setError("Failed to load applicant details.");
      }
    };

    fetchApplicant();
  }, [recruitmentId, userId]);

  if (error) return <div className="single-applicant error">{error}</div>;
  if (!applicant) return <div className="single-applicant error">No applicant data found.</div>;

  const { user, recruitment } = applicant;

  const avatarSrc = user?.avatar || "/default-avatar.png";

  return (
    <div className="single-applicant">
      <h2 className="title">
        Applicant Details for <span>{recruitment?.title || "N/A"}</span>
      </h2>

      <div className="details-box">
        <div className="section user-info">
          <h3>User Account Info</h3>
          <img
            className="avatar"
            src={avatarSrc}
            alt={`${user?.username || "User"}'s avatar`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-avatar.png";
            }}
          />
          <div className="user-details">
            <p><strong>Username:</strong> {user?.username || "N/A"}</p>
            <p><strong>Email:</strong> {user?.email || "N/A"}</p>
            {/* Only show Phone if it exists and is not empty */}
            {user?.phone && user.phone.trim() !== "" && (
              <p><strong>Phone:</strong> {user.phone}</p>
            )}
            {/* Only show Location if it exists and is not empty */}
            {user?.location && user.location.trim() !== "" && (
              <p><strong>Location:</strong> {user.location}</p>
            )}
            <p><strong>Joined:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
            <p><strong>Role:</strong> {user?.role || "N/A"}</p>
            {user?.agentTitle && <p><strong>Agent Title:</strong> {user.agentTitle.replace(/_/g, " ")}</p>}
          </div>
        </div>

        <div className="section application-info">
          <h3>Application Details</h3>
          <p><strong>Full Name:</strong> {applicant.fullName || "N/A"}</p>
          <p><strong>Email (applied with):</strong> {applicant.email || "N/A"}</p>
          <p><strong>Phone:</strong> {applicant.phone || "N/A"}</p>
          <p>
            <strong>CV:</strong>{" "}
            {applicant.cvLink ? (
              <a href={applicant.cvLink} target="_blank" rel="noreferrer">View CV</a>
            ) : (
              "N/A"
            )}
          </p>
          {applicant.portfolioLink && (
            <p>
              <strong>Portfolio:</strong>{" "}
              <a href={applicant.portfolioLink} target="_blank" rel="noreferrer">View Portfolio</a>
            </p>
          )}
          <p><strong>Cover Letter:</strong> {applicant.coverLetter || "None"}</p>
          <p><strong>Status:</strong> {applicant.status || "N/A"}</p>
          <p><strong>Applied At:</strong> {applicant.appliedAt ? new Date(applicant.appliedAt).toLocaleString() : "N/A"}</p>
        </div>
      </div>
    </div>
  );
}

export default SingleApplicant;
