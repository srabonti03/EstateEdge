import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./agentPage.scss";

const AgentPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/agent/all", {
          credentials: "include",
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setAgents(data);
        } else {
          setAgents([]);
          console.error("Expected an array but got:", data);
        }
      } catch (err) {
        console.error("Failed to fetch agents:", err);
        setAgents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const locations = [...new Set(agents.map((agent) => agent.location).filter(Boolean))];

  const filteredAgents = agents
    .filter((agent) => {
      const username = agent.username?.toLowerCase() || "";
      const title = agent.agentTitle?.toLowerCase() || "";
      return (
        username.includes(searchQuery.toLowerCase()) ||
        title.includes(searchQuery.toLowerCase())
      );
    })
    .filter((agent) =>
      selectedLocation ? agent.location === selectedLocation : true
    );

  const formatRole = (role) => {
    if (!role) return "Agent";
    return role
      .replace(/_/g, " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="agent-page">
      <div className="content-wrapper">
        <h1 className="title">Our Expert Agents</h1>

        <div className="search-filter-wrapper">
          <div className="search">
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or role"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className="location-filter">
            <select
              className="location-select"
              value={selectedLocation}
              onChange={handleLocationChange}
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="agents-list">
          {loading ? (
            <p className="loading">Loading agents...</p>
          ) : filteredAgents && filteredAgents.length > 0 ? (
            filteredAgents.map((agent) => (
              <Link to={`/agent/${agent.id}`} className="agent" key={agent.id}>
                <img
                  className="agent-image"
                  src={`http://localhost:3000${agent.avatar}` || "/default-avatar.png"}
                  alt={agent.username || "Agent"}
                />
                <div className="agent-info">
                  <h3 className="agent-name">{agent.username || "N/A"}</h3>
                  <p className="agent-role">{formatRole(agent.agentTitle)}</p>
                  <p className="agent-location">Location: {agent.location || "Unknown"}</p>
                  <p className="agent-phone">Phone: {agent.phone || "Not available"}</p>
                  <p className="agent-email">Email: {agent.email || "Not available"}</p>
                  <p className="agent-listings">Listings: {agent.listingCount ?? 0}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="no-agents">No agents available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentPage;
