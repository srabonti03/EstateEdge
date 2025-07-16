import React, { useState, useEffect } from "react";
import "./manageRecruitments.scss";
import { Link, useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiUsers,
  FiEye,
  FiToggleLeft,
  FiToggleRight,
  FiTrash,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ManageRecruitments() {
  const [jobs, setJobs] = useState([]);
  const [applicantCounts, setApplicantCounts] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/recruitment/", {
          credentials: "include",
        });
        const data = await response.json();

        if (Array.isArray(data.recruitments)) {
          setJobs(data.recruitments);
          fetchApplicantsCount(data.recruitments);
        } else {
          setJobs([]);
          console.warn("Unexpected data format, recruitments not found.");
        }
      } catch (error) {
        setError("Failed to fetch recruitments.");
        setJobs([]);
      }
    };

    const fetchApplicantsCount = async (recruitments) => {
      try {
        const counts = {};
        await Promise.all(
          recruitments.map(async (job) => {
            const res = await fetch(
              `http://localhost:3000/api/recruitment/${job.id}/applicants`,
              {
                credentials: "include",
              }
            );
            const data = await res.json();
            counts[job.id] = data.totalApplicants || 0;
          })
        );
        setApplicantCounts(counts);
      } catch (error) {
        console.error("Error fetching applicant counts:", error);
      }
    };

    fetchJobs();
  }, []);

  const formatAgentTitle = (title) => {
    if (!title) return "Admin doesn’t require a title";
    return title
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleEdit = (id) => {
    navigate(`/admindashboard/managerecruitments/update/${id}`);
  };

  const handleViewApplicants = (id) => {
    navigate(`${id}/applicants`);
  };

  const handleCreateRecruitment = () => {
    navigate("/admindashboard/managerecruitments/new");
  };

  const toggleRecruitmentStatus = (id, isDisabled) => {
    toast(
      <div style={{ fontSize: "1rem", color: "#333" }}>
        <p>
          Are you sure you want to{" "}
          <strong>{isDisabled ? "enable" : "disable"}</strong> this recruitment
          post?
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "10px",
          }}
        >
          <button
            onClick={() => {
              toggleConfirmed(id, isDisabled);
              toast.dismiss();
            }}
            style={{
              padding: "6px 14px",
              fontSize: "0.9rem",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              backgroundColor: "#4caf50",
              color: "#fff",
            }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={{
              padding: "6px 14px",
              fontSize: "0.9rem",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              backgroundColor: "#f44336",
              color: "#fff",
            }}
          >
            No
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
      }
    );
  };

  const toggleConfirmed = async (id, isDisabled) => {
    const url = `http://localhost:3000/api/recruitment/${id}/${
      isDisabled ? "enable" : "disable"
    }`;
    try {
      const res = await fetch(url, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");
      setJobs((prev) =>
        prev.map((job) =>
          job.id === id ? { ...job, isDisabled: !isDisabled } : job
        )
      );

      toast.success(
        isDisabled
          ? "Recruitment post is now visible to users."
          : "Recruitment post has been hidden from users."
      );
    } catch (err) {
      toast.error(`Something went wrong. Please try again.`);
    }
  };

  const handleDelete = (id) => {
    toast(
      <div style={{ fontSize: "1rem", color: "#333" }}>
        <p>
          Are you sure you want to <strong>delete</strong> this recruitment?
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "10px",
          }}
        >
          <button
            onClick={() => {
              handleDeleteConfirmed(id);
              toast.dismiss();
            }}
            style={{
              padding: "6px 14px",
              fontSize: "0.9rem",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              backgroundColor: "#f44336",
              color: "#fff",
            }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={{
              padding: "6px 14px",
              fontSize: "0.9rem",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              backgroundColor: "#4caf50",
              color: "#fff",
            }}
          >
            No
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
      }
    );
  };

  const handleDeleteConfirmed = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/recruitment/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete");
      }
      setJobs((prev) => prev.filter((job) => job.id !== id));
      toast.success("Recruitment deleted successfully");
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  return (
    <div className="manage-recruitments">
      <h1 className="heading">
        Manage <span className="highlight">Recruitments</span>
      </h1>

      <div className="buttons-container">
        <button
          className="create-recruitment-btn"
          onClick={handleCreateRecruitment}
        >
          Create Recruitment
        </button>
      </div>

      <div className="table-wrapper">
        <table className="recruitments-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Role</th>
              <th>Title</th>
              <th>Location</th>
              <th>Deadline</th>
              <th>Positions</th>
              <th>Applicants</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                  No recruitments available.
                </td>
              </tr>
            ) : (
              jobs.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Link
                      to={`/admindashboard/managerecruitments/${item.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {item.title}
                    </Link>
                  </td>
                  <td className="description">{item.description}</td>
                  <td>{item.role}</td>
                  <td>{formatAgentTitle(item.agentTitle)}</td>
                  <td>{item.location}</td>
                  <td>{new Date(item.deadline).toLocaleDateString()}</td>
                  <td>{item.positionsAvailable ?? "undefined"}</td>
                  <td>{applicantCounts[item.id] ?? 0}</td>
                  <td className="action-btns">
                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate(`/admindashboard/managerecruitments/${item.id}`)
                      }
                      title="View"
                    >
                      <FiEye />
                    </button>
                    {applicantCounts[item.id] > 0 && (
                      <button
                        className="applicants-btn"
                        onClick={() => handleViewApplicants(item.id)}
                        title="Applicants"
                      >
                        <FiUsers />
                      </button>
                    )}
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(item.id)}
                      title="Edit"
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.id)}
                      title="Delete"
                    >
                      <FiTrash />
                    </button>
                    <button
                      className={item.isDisabled ? "enable-btn" : "disable-btn"}
                      onClick={() =>
                        toggleRecruitmentStatus(item.id, item.isDisabled)
                      }
                      title={
                        item.isDisabled
                          ? "Enable Recruitment"
                          : "Disable Recruitment"
                      }
                    >
                      {item.isDisabled ? <FiToggleLeft /> : <FiToggleRight />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}

export default ManageRecruitments;
