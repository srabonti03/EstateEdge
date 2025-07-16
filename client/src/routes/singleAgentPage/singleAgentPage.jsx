import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import "./singleAgentPage.scss";

function SingleAgentPage() {
  const { agentid } = useParams();
  const [role, setRole] = useState(null);
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatRole = (role) => {
    if (!role) return "Agent";
    return role
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setRole(user.role || null);
    }
  }, []);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/api/agent/${agentid}`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Agent not found");
        }
        const data = await res.json();
        setAgent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAgent();
  }, [agentid]);

  const handleSendMessage = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/chat`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiverId: agentid }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message || "Error initiating chat");
        return;
      }

      const chatId = data.chat.id || data.chat._id;
      if (chatId) {
        navigate(`/profile/${agentid}?chatId=${chatId}`);
      }
    } catch (err) {
      console.error("Failed to create or fetch chat:", err);
    }
  };

  if (loading) {
    return <div className="single-agent-page">Loading agent details...</div>;
  }

  if (error) {
    return <div className="single-agent-page">{error}</div>;
  }

  if (!agent) {
    return <div className="single-agent-page">Agent not found.</div>;
  }

  return (
    <div className="single-agent-page">
      <div className="agent-container">
        <img
          src={
            agent?.avatar
              ? `http://localhost:3000${agent.avatar}`
              : "/default-avatar.png"
          }
          alt={agent.username}
          className="agent-image"
        />
        <div className="agent-details">
          <h1 className="agent-name">{agent.username}</h1>
          <p className="agent-role">{formatRole(agent.agentTitle)}</p>
          <p className="agent-location">
            <strong>Location:</strong> {agent.location || "Unknown"}
          </p>
          <p className="agent-phone">
            <strong>Phone:</strong> {agent.phone || "Not available"}
          </p>
          <p className="agent-email">
            <strong>Email:</strong> {agent.email || "Not available"}
          </p>
          <p className="agent-listings">
            <strong>Listings:</strong> {agent.listingCount ?? 0}
          </p>
          <p className="agent-description">
            {agent.bio || "No description provided."}
          </p>
          {role === "user" && (
            <button className="send-message-btn" onClick={handleSendMessage}>
              <FaPaperPlane className="send-message-icon" />
              Send Message
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SingleAgentPage;
