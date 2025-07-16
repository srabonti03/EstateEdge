import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Filter from "../../components/filter/Filter";
import List from "../../components/list/List";
import Map from "../../components/map/Map";
import "./listPage.scss";

function ListPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState(() =>
    Object.fromEntries(new URLSearchParams(location.search))
  );
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlFilters = Object.fromEntries(new URLSearchParams(location.search));
    if (JSON.stringify(urlFilters) !== JSON.stringify(filters)) {
      setFilters(urlFilters);
    }
  }, [location.search]);

  const updateFilters = (newFilters) => {
    setFilters(newFilters);

    const cleanedFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v !== "" && v !== 0)
    );

    const queryString = new URLSearchParams(cleanedFilters).toString();
    navigate(`/list?${queryString}`, { replace: true });
  };

  useEffect(() => {
    async function fetchPosts() {
      try {
        setError(null);
        const queryParams = new URLSearchParams(filters).toString();

        if (filters.city) {
          const res = await axios.get(
            `http://localhost:3000/api/post/filter?${queryParams}`
          );
          setPosts(res.data);
        } else {
          const res = await axios.get(
            "http://localhost:3000/api/post/approved",
            { withCredentials: true }
          );
          setPosts(res.data);
        }
      } catch {
        setError("Failed to fetch posts");
        setPosts([]);
      }
    }

    fetchPosts();
  }, [filters]);

  return (
    <div className="listPage">
      <div className="bg">
        <img src="list.png" alt="bg" />
      </div>

      <div className="listContainer">
        <div className="wrapper">
          <Filter onFilterChange={updateFilters} initialFilters={filters} />
          {error ? <div>{error}</div> : <List items={posts} />}
        </div>
      </div>

      <div className="mapContainer">
        <Map items={posts} />
      </div>
    </div>
  );
}

export default ListPage;
