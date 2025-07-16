import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./updateRecruitmentPost.scss";

const allowedAgentTitles = [
  "real_estate_agent",
  "senior_property_consultant",
  "residential_property_expert",
  "luxury_apartment_specialist",
  "commercial_space_advisor",
  "senior_leasing_agent",
  "urban_property_strategist",
  "modern_housing_consultant",
  "plot_land_advisor",
  "real_estate_investment_consultant",
  "luxury_villa_specialist",
  "real_estate_legal_advisor",
  "land_farm_property_specialist",
  "commercial_real_estate_agent",
  "luxury_property_specialist",
  "plot_development_consultant",
  "residential_property_broker",
  "senior_real_estate_consultant",
  "investment_properties_consultant",
];

const formatDateForInput = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (!isNaN(date)) {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }
  return "";
};

function UpdateRecruitmentPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    role: "agent",
    agentTitle: "",
    location: "",
    deadline: "",
    positionsAvailable: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/recruitment/${id}`, {
          withCredentials: true,
        });
        const data = res.data.recruitment || res.data;

        setFormData({
          title: data.title || "",
          description: data.description || "",
          role: data.role || "agent",
          agentTitle: data.agentTitle || "",
          location: data.location || "",
          deadline: formatDateForInput(data.deadline),
          positionsAvailable:
            data.positionsAvailable !== undefined && data.positionsAvailable !== null
              ? data.positionsAvailable.toString()
              : "",
        });
      } catch {
        toast.error("Failed to fetch recruitment post.");
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "positionsAvailable") {
      if (value === "" || /^\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title.trim()) {
      toast.error("Title is required.");
      setLoading(false);
      return;
    }
    if (!formData.deadline.trim()) {
      toast.error("Deadline is required.");
      setLoading(false);
      return;
    }
    if (!/^\d{2}-\d{2}-\d{4}$/.test(formData.deadline)) {
      toast.error("Invalid deadline date format. Use dd-mm-yyyy.");
      setLoading(false);
      return;
    }
    if (!["agent", "admin"].includes(formData.role)) {
      toast.error("Role must be 'agent' or 'admin'.");
      setLoading(false);
      return;
    }
    if (formData.role === "agent" && !allowedAgentTitles.includes(formData.agentTitle)) {
      toast.error("Please select a valid agent title.");
      setLoading(false);
      return;
    }
    if (!formData.location.trim()) {
      toast.error("Location is required.");
      setLoading(false);
      return;
    }
    if (
      formData.positionsAvailable !== "" &&
      (isNaN(Number(formData.positionsAvailable)) || Number(formData.positionsAvailable) < 0)
    ) {
      toast.error("Positions available must be a non-negative number.");
      setLoading(false);
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/api/recruitment/${id}`,
        {
          ...formData,
          deadline: formData.deadline,
          positionsAvailable:
            formData.positionsAvailable !== "" ? Number(formData.positionsAvailable) : undefined,
        },
        { withCredentials: true }
      );
      toast.success("Recruitment post updated successfully.");
      setLoading(false);
      setTimeout(() => navigate("/admindashboard/managerecruitments"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update recruitment post.");
      setLoading(false);
    }
  };

  return (
    <div className="update-recruitment-post">
      <h2>Update Recruitment Post</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </label>
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </label>
        <div className="row">
          <label>
            Role:
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          {formData.role === "agent" && (
            <label>
              Agent Title:
              <select
                name="agentTitle"
                value={formData.agentTitle || ""}
                onChange={handleChange}
                required
              >
                <option value="">Select agent title</option>
                {allowedAgentTitles.map((title) => (
                  <option key={title} value={title}>
                    {title.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <div className="row">
          <label>
            Location:
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </label>
          <label>
            Deadline (dd-mm-yyyy):
            <input
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              placeholder="dd-mm-yyyy"
              required
              autoComplete="off"
            />
          </label>
          <label>
            Positions Available:
            <input
              name="positionsAvailable"
              value={formData.positionsAvailable}
              onChange={handleChange}
              type="number"
              min="0"
              placeholder="Optional"
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Recruitment"}
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default UpdateRecruitmentPost;
