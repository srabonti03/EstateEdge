import React, { useState, useEffect } from "react";
import "./manageProperties.scss";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit, FiArchive, FiCheckCircle, FiInbox } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ManageProperties() {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/post/all", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("API did not return an array");
        }
        const sorted = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .sort((a, b) => a.isApproved - b.isApproved);
        const mapped = sorted.map((post) => ({
          ...post,
          postedBy: post.user?.username || "Unknown",
        }));
        setProperties(mapped);
      })
      .catch((err) => {
        console.error("Failed to fetch posts", err);
        setError(err.message);
      });
  }, []);

  const buttonStyle = {
    padding: "6px 14px",
    fontSize: "0.9rem",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  };

  const yesButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#f44336",
    color: "#fff",
  };

  const noButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#4caf50",
    color: "#fff",
  };

  const showConfirmToast = (type, id) => {
    const actionName =
      type === "delete"
        ? "Archive"
        : type === "unarchive"
        ? "Unarchive"
        : "Approve";

    toast(
      <div style={{ fontSize: "1rem", color: "#333" }}>
        <p>
          Are you sure you want to <strong>{actionName.toLowerCase()}</strong>{" "}
          this property?
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
              if (type === "delete") handleArchiveConfirmed(id);
              if (type === "unarchive") handleUnarchiveConfirmed(id);
              if (type === "approve") handleApproveConfirmed(id);
              toast.dismiss();
              setConfirmAction(null);
            }}
            style={yesButtonStyle}
          >
            Yes
          </button>
          <button
            onClick={() => {
              toast.dismiss();
              setConfirmAction(null);
            }}
            style={noButtonStyle}
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

  const handleArchive = (id) => {
    setConfirmAction({ type: "delete", id });
    showConfirmToast("delete", id);
  };

  const handleUnarchive = (id) => {
    setConfirmAction({ type: "unarchive", id });
    showConfirmToast("unarchive", id);
  };

  const handleSoldProperties = () => {
    navigate("/admindashboard/manageproperties/sold");
  };

  const handleArchiveConfirmed = (id) => {
    fetch(`http://localhost:3000/api/post/archive/${id}`, {
      method: "PUT",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message || "Failed to archive");
          });
        }
        setProperties((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isArchived: true } : item
          )
        );
        toast.success("Property archived successfully");
      })
      .catch((err) => {
        console.error("Archive failed:", err);
        toast.error(`Error: ${err.message}`);
      });
  };

  const handleUnarchiveConfirmed = (id) => {
    fetch(`http://localhost:3000/api/post/unarchive/${id}`, {
      method: "PUT",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message || "Failed to unarchive");
          });
        }
        setProperties((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isArchived: false } : item
          )
        );
        toast.success("Property unarchived successfully");
      })
      .catch((err) => {
        console.error("Unarchive failed:", err);
        toast.error(`Error: ${err.message}`);
      });
  };

  const handleEdit = (id) => {
    navigate(`/update/${id}`);
  };

  const handleApprove = (id) => {
    setConfirmAction({ type: "approve", id });
    showConfirmToast("approve", id);
  };

  const handleApproveConfirmed = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/post/approve/${id}`, {
        method: "PUT",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to approve post");
      }
      const data = await res.json();

      setProperties((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, isApproved: true, approvedAt: data.post.approvedAt }
            : item
        )
      );

      toast.success("Post approved successfully");
    } catch (err) {
      console.error("Approve failed:", err);
      toast.error(`Error: ${err.message}`);
    }
  };

  if (error) {
    return (
      <div className="manage-property">
        <div className="heading-row">
          <h1 className="heading">
            Manage <span className="highlight">Properties</span>
          </h1>
          <div className="sold-btn-container">
            <button
              className="sold-properties-btn"
              onClick={handleSoldProperties}
            >
              Sold Properties
            </button>
          </div>
        </div>
        <p style={{ color: "red" }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="manage-property">
      <div className="heading-row">
        <h1 className="heading">
          Manage <span className="highlight">Properties</span>
        </h1>
        <div className="sold-btn-container">
          <button
            className="sold-properties-btn"
            onClick={handleSoldProperties}
          >
            Sold Properties
          </button>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="property-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Address</th>
              <th>Bedrooms</th>
              <th>Bathrooms</th>
              <th>Price (৳)</th>
              <th>Agent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No posts available.
                </td>
              </tr>
            ) : (
              properties.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Link
                      to={`/${item.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {item.title}
                    </Link>
                  </td>
                  <td>{item.address}</td>
                  <td>{item.bedroom}</td>
                  <td>{item.bathroom}</td>
                  <td>{item.price}</td>
                  <td>{item.postedBy}</td>
                  <td className="action-btns">
                    {item.isApproved ? (
                      <FiCheckCircle
                        title="Approved"
                        style={{ color: "green", fontSize: "1.4em" }}
                      />
                    ) : !item.isArchived && (
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(item.id)}
                        title="Approve"
                      >
                        <FiCheckCircle />
                      </button>
                    )}

                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(item.id)}
                      title="Edit"
                    >
                      <FiEdit />
                    </button>

                    {item.isArchived ? (
                      <button
                        className="unarchive-btn"
                        onClick={() => handleUnarchive(item.id)}
                        title="Unarchive"
                      >
                        <FiInbox />
                      </button>
                    ) : (
                      <button
                        className="archive-btn"
                        onClick={() => handleArchive(item.id)}
                        title="Archive"
                      >
                        <FiArchive />
                      </button>
                    )}
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

export default ManageProperties;
