import React, { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./careerList.scss";

const CareerList = () => {
  const { currentUser } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/recruitment/", {
          credentials: "include",
        });
        const data = await response.json();

        if (Array.isArray(data.recruitments)) {
          setJobs(data.recruitments);
        } else {
          setJobs([]);
          console.warn("Unexpected data format, recruitments not found.");
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      }
    };

    fetchJobs();
  }, []);

  const updateArrowsVisibility = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
  };

  useEffect(() => {
    updateArrowsVisibility();
    window.addEventListener("resize", updateArrowsVisibility);
    return () => {
      window.removeEventListener("resize", updateArrowsVisibility);
    };
  }, [jobs]);

  const onScroll = () => {
    updateArrowsVisibility();
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    const scrollAmount = 280;

    if (direction === "left") {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const canApply =
    currentUser && (currentUser.role === "user" || currentUser.role === "agent");

  const formatAgentTitle = (title) => {
    return title
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDeadline = (dateStr) => {
    if (!dateStr) return "No deadline";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid date";

    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const timeUntilDeadline = (dateStr) => {
    if (!dateStr) return "";
    const deadline = new Date(dateStr);
    const now = new Date();
    const diff = deadline - now;

    if (diff <= 0) return "Deadline passed";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} day${days !== 1 ? "s" : ""}`;
  };

  const handleCardClick = (jobId) => {
    navigate(`/recruitment/${jobId}`);
  };

  // Updated handleApply to accept id and event and stop propagation
  const handleApply = (id, event) => {
    event.stopPropagation(); // Prevent card click
    navigate(`/recruitment/${id}/apply`);
  };

  return (
    <div className="CareerList">
      <section className="career-hero">
        <img
          src="career.png"
          alt="Join EstateEdge Team"
          className="career-hero-image"
        />
        <div className="career-hero-text">
          <h2>Shape the Future of Real Estate</h2>
          <p>
            At EstateEdge, we’re not just building homes — we’re building legacies.
          </p>
        </div>
      </section>

      <section className="career-section">
        <h3 className="career-heading">Current Openings</h3>
        <div className="career-scroll-wrapper">
          {showLeftArrow && (
            <button className="scroll-btn left" onClick={() => scroll("left")}>
              &#8592;
            </button>
          )}

          <div className="career-cards" ref={scrollRef} onScroll={onScroll}>
            {Array.isArray(jobs) && jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  className="career-card"
                  key={job.id}
                  onClick={() => handleCardClick(job.id)}
                  style={{ cursor: "pointer" }}
                >
                  <h4 className="job-title">{job.title}</h4>
                  <p className="job-description">{job.description}</p>
                  <p>
                    <strong>Role:</strong>{" "}
                    <span className="muted">{job.role}</span>
                  </p>
                  {job.agentTitle && (
                    <p>
                      <strong>Agent Title:</strong>{" "}
                      <span className="muted">{formatAgentTitle(job.agentTitle)}</span>
                    </p>
                  )}
                  <p>
                    <strong>Location:</strong>{" "}
                    <span className="muted">{job.location || "Not specified"}</span>
                  </p>
                  <p>
                    <strong>Deadline:</strong>{" "}
                    <span className="muted">
                      {formatDeadline(job.deadline)}{" "}
                      {job.deadline && `(${timeUntilDeadline(job.deadline)})`}
                    </span>
                  </p>
                  <p>
                    <strong>Positions Available:</strong>{" "}
                    <span className="muted">
                      {job.positionsAvailable !== null &&
                      job.positionsAvailable !== undefined &&
                      job.positionsAvailable !== ""
                        ? job.positionsAvailable
                        : "Not specified"}
                    </span>
                  </p>
                  {canApply && (
                    <button
                      className="btn apply-btn"
                      onClick={(e) => handleApply(job.id, e)}
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No job openings available right now.</p>
            )}
          </div>

          {showRightArrow && (
            <button className="scroll-btn right" onClick={() => scroll("right")}>
              &#8594;
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default CareerList;
