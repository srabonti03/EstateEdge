import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "./singleRecruitment.scss";

function SingleRecruitment() {
  const { id } = useParams();
  const [recruitment, setRecruitment] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecruitment = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/recruitment/${id}`,
          {
            withCredentials: true,
          }
        );
        setRecruitment(res.data.recruitment);
      } catch (err) {
        setError("Failed to load recruitment details.");
      }
    };

    fetchRecruitment();
  }, [id]);

  if (error) return <div className="single-recruitment error">{error}</div>;
  if (!recruitment)
    return (
      <div className="single-recruitment error">No recruitment data found.</div>
    );

  return (
    <div className="single-recruitment">
      <h2 className="title">
        Applicant Details for{" "}
        <Link to={`/admindashboard/managerecruitments/${recruitment.id}`}>
          <span>{recruitment?.title || "N/A"}</span>
        </Link>
      </h2>
      <div className="details-box">
        <div className="section recruitment-info">
          <h3>Post Information</h3>
          <p>
            <strong>Title:</strong> {recruitment.title || "N/A"}
          </p>
          <p>
            <strong>Description:</strong> {recruitment.description || "N/A"}
          </p>
          <p>
            <strong>Role:</strong> {recruitment.role || "N/A"}
          </p>
          {recruitment.agentTitle && (
            <p>
              <strong>Agent Title:</strong>{" "}
              {recruitment.agentTitle.replace(/_/g, " ")}
            </p>
          )}
          {recruitment.location && (
            <p>
              <strong>Location:</strong> {recruitment.location}
            </p>
          )}
          {recruitment.positionsAvailable !== undefined && (
            <p>
              <strong>Positions Available:</strong>{" "}
              {recruitment.positionsAvailable}
            </p>
          )}
          <p>
            <strong>Posted On:</strong>{" "}
            {new Date(recruitment.postedDay).toLocaleDateString()}
          </p>
          {recruitment.deadline && (
            <p>
              <strong>Deadline:</strong>{" "}
              {new Date(recruitment.deadline).toLocaleDateString()}
            </p>
          )}
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(recruitment.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SingleRecruitment;
