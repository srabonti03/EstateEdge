import React, { useState, useEffect } from "react";
import "./manageSoldProperties.scss";
import { Link } from "react-router-dom";

function ManageSoldProperties() {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/post/sold", {
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
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const mapped = sorted.map((post) => ({
          ...post,
          postedBy: post.user?.username || "Unknown",
        }));
        setProperties(mapped);
      })
      .catch((err) => {
        console.error("Failed to fetch sold posts", err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return (
      <div className="sold-property">
        <div className="heading-row">
          <h1 className="heading">
            Sold <span className="highlight">Properties</span>
          </h1>
        </div>
        <p style={{ color: "red" }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="sold-property">
      <div className="heading-row">
        <h1 className="heading">
          Sold <span className="highlight">Properties</span>
        </h1>
      </div>
      <div className="table-wrapper">
        <table className="sold-property-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Address</th>
              <th>Bedrooms</th>
              <th>Bathrooms</th>
              <th>Price (৳)</th>
              <th>Agent</th>
            </tr>
          </thead>
          <tbody>
            {properties.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No sold properties found.
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageSoldProperties;
