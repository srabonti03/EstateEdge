import React, { useState, useEffect } from "react";
import "./manageAgents.scss";
import { Link } from "react-router-dom";
import {
  MdPowerSettingsNew,
  MdSync,
  MdVisibility,
  MdRefresh,
} from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ManageAgents() {
  const [agents, setAgents] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeAgentId, setActiveAgentId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const possibleRoles = [
    { key: "real_estate_agent", label: "Real Estate Agent" },
    { key: "senior_property_consultant", label: "Senior Property Consultant" },
    {
      key: "residential_property_expert",
      label: "Residential Property Expert",
    },
    {
      key: "luxury_apartment_specialist",
      label: "Luxury Apartment Specialist",
    },
    { key: "commercial_space_advisor", label: "Commercial Space Advisor" },
    { key: "senior_leasing_agent", label: "Senior Leasing Agent" },
    { key: "urban_property_strategist", label: "Urban Property Strategist" },
    { key: "modern_housing_consultant", label: "Modern Housing Consultant" },
    { key: "plot_land_advisor", label: "Plot & Land Advisor" },
    {
      key: "real_estate_investment_consultant",
      label: "Real Estate Investment Consultant",
    },
    { key: "luxury_villa_specialist", label: "Luxury Villa Specialist" },
    { key: "real_estate_legal_advisor", label: "Real Estate Legal Advisor" },
    {
      key: "land_farm_property_specialist",
      label: "Land & Farm Property Specialist",
    },
    {
      key: "commercial_real_estate_agent",
      label: "Commercial Real Estate Agent",
    },
    { key: "luxury_property_specialist", label: "Luxury Property Specialist" },
    {
      key: "plot_development_consultant",
      label: "Plot Development Consultant",
    },
    {
      key: "residential_property_broker",
      label: "Residential Property Broker",
    },
    {
      key: "senior_real_estate_consultant",
      label: "Senior Real Estate Consultant",
    },
    {
      key: "investment_properties_consultant",
      label: "Investment Properties Consultant",
    },
  ];

  const formatRole = (role) => {
    if (!role) return "Agent";
    return role
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/agent/all", {
          credentials: "include",
        });
        if (!res.ok)
          throw new Error(`Server responded with status ${res.status}`);
        const data = await res.json();
        setAgents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch agents:", err);
        setAgents([]);
      }
    };

    fetchAgents();
  }, []);

  const showConfirmToast = (id) => {
    toast(
      <div style={{ fontSize: "1rem", color: "#333" }}>
        <p>
          Are you sure you want to <strong>deactivate</strong> this consultant?
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
              handleDeactivateConfirmed(id);
              toast.dismiss();
              setConfirmAction(null);
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
              transition: "background-color 0.3s ease",
            }}
          >
            Yes
          </button>
          <button
            onClick={() => {
              toast.dismiss();
              setConfirmAction(null);
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
              transition: "background-color 0.3s ease",
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

  const handleDeactivateConfirmed = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/agent/deactivate/${id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(`Deactivate failed: ${errorData.message}`);
        return;
      }

      setAgents((prev) =>
        prev.map((agent) =>
          agent.id === id ? { ...agent, isActive: false } : agent
        )
      );
      toast.info("Consultant deactivated successfully.");
    } catch (err) {
      console.error("Deactivate request error:", err);
      toast.error("Failed to deactivate consultant.");
    }
  };

  const handleDeactivate = (id) => {
    setConfirmAction({ type: "deactivate", id });
    showConfirmToast(id);
  };

  const handleReactivate = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/agent/reactivate/${id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(`Reactivate failed: ${errorData.message}`);
        return;
      }

      setAgents((prev) =>
        prev.map((agent) =>
          agent.id === id ? { ...agent, isActive: true } : agent
        )
      );
      toast.success("Consultant reactivated successfully.");
    } catch (err) {
      console.error("Reactivate request error:", err);
      toast.error("Failed to reactivate consultant.");
    }
  };

  const handleStatusChange = (id, currentRole) => {
    if (dropdownVisible && activeAgentId === id) {
      setDropdownVisible(false);
      setActiveAgentId(null);
      setSelectedRole(null);
    } else {
      setDropdownVisible(true);
      setSelectedRole(currentRole);
      setActiveAgentId(id);
    }
  };

  const handleRoleSelect = async (roleKey, id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/agent/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ agentTitle: roleKey }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(`Update failed: ${errorData.message}`);
        return;
      }

      const updatedAgent = await res.json();

      setAgents((prevAgents) =>
        prevAgents.map((agent) => (agent.id === id ? updatedAgent : agent))
      );

      toast.success("Role updated successfully.");
    } catch (error) {
      console.error("Update request error:", error);
      toast.error("Failed to update role.");
    }

    setDropdownVisible(false);
    setSelectedRole(null);
    setActiveAgentId(null);
  };

  const handleView = (id) => {
    console.log(`Viewing consultant with ID: ${id}`);
    toast.info(`Viewing consultant ID: ${id}`);
  };

  return (
    <div className="manage-agent">
      <h1 className="heading">
        Consultant <span className="highlight">Profiles</span>
      </h1>

      <div className="table-wrapper">
        <table className="consultant-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th className="col-phone">Phone</th>
              <th className="col-email">Email</th>
              <th className="col-location">Location</th>
              <th className="col-listings">Total Listings</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {agents.length > 0 ? (
              agents.map((consultant) => (
                <tr key={consultant.id}>
                  <td>
                    <Link to={`/agent/${consultant.id}`}>
                      {consultant.username || "N/A"}
                    </Link>
                  </td>
                  <td>
                    <div className="role-sync-wrapper">
                      <div className="role-container">
                        {formatRole(consultant.agentTitle)}
                      </div>
                      <div className="sync-btn">
                        <button
                          className="status-btn"
                          onClick={() =>
                            handleStatusChange(
                              consultant.id,
                              consultant.agentTitle
                            )
                          }
                        >
                          <MdSync size={20} />
                        </button>
                      </div>
                    </div>

                    {dropdownVisible && activeAgentId === consultant.id && (
                      <div className="role-dropdown">
                        {possibleRoles.map(({ key, label }) => (
                          <button
                            key={key}
                            className="role-option"
                            onClick={() => handleRoleSelect(key, consultant.id)}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="col-phone">{consultant.phone || "N/A"}</td>
                  <td className="col-email">{consultant.email || "N/A"}</td>
                  <td className="col-location">
                    {consultant.location || "N/A"}
                  </td>
                  <td className="col-listings">
                    {consultant.listingCount ?? 0}
                  </td>
                  <td>
                    <div className="action-btns">
                      <Link to={`/agent/${consultant.id}`}>
                        <button className="view-btn">
                          <MdVisibility size={24} />
                        </button>
                      </Link>
                      {consultant?.isActive === false ? (
                        <button
                          className="reactivate-btn"
                          onClick={() => handleReactivate(consultant.id)}
                          title="Reactivate"
                        >
                          <MdRefresh size={24} />
                        </button>
                      ) : (
                        <button
                          className="deactivate-btn"
                          onClick={() => handleDeactivate(consultant.id)}
                          title="Deactivate"
                        >
                          <MdPowerSettingsNew size={24} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No consultants available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-center" />
    </div>
  );
}

export default ManageAgents;
