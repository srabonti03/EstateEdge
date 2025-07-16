import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Map from "../../components/map/Map";
import "./locationsList.scss";

function LocationsList() {
  const [locations, setLocations] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/post/locations/", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch locations");
        }
        return res.json();
      })
      .then((data) => {

        setPosts(data.posts || []);

        const uniqueCities = [
          ...new Set(data.posts.map((post) => post.city)),
        ];
        setLocations(uniqueCities);

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleCheck = (city) => {
    const params = new URLSearchParams({ city }).toString();
    navigate(`/list?${params}`);
  };

  if (loading)
    return <div className="locations-list">Loading locations...</div>;
  if (error) return <div className="locations-list error">Error: {error}</div>;

  return (
    <div className="locationsList">
      <div className="locations">
        <h2>Available Cities</h2>
        <div className="cards-container">
          {locations.length > 0 ? (
            locations.map((city) => (
              <div key={city} className="location-card">
                <span className="city-name">{city}</span>
                <button className="check-btn" onClick={() => handleCheck(city)}>
                  Check
                </button>
              </div>
            ))
          ) : (
            <p className="no-locations">No locations found.</p>
          )}
        </div>
      </div>
      <div className="map-container">
        <Map items={posts} />
      </div>
    </div>
  );
}

export default LocationsList;
