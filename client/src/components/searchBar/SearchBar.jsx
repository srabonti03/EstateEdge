import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./searchBar.scss";
import { FaSearch } from "react-icons/fa";

const types = ["buy", "rent"];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "buy",
    city: "",
    minPrice: "",
    maxPrice: "",
  });

  const navigate = useNavigate();

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "minPrice" || name === "maxPrice") && value !== "") {
      if (!/^\d*$/.test(value)) return;
    }
    setQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const city = query.city.trim();

    const minPrice = query.minPrice.trim() === "" ? null : Number(query.minPrice);
    const maxPrice = query.maxPrice.trim() === "" ? null : Number(query.maxPrice);

    if (
      (minPrice !== null && (isNaN(minPrice) || minPrice < 0)) ||
      (maxPrice !== null && (isNaN(maxPrice) || maxPrice < 0))
    ) {
      alert("Prices must be positive numbers or empty.");
      return;
    }

    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      alert("Min price cannot be greater than max price.");
      return;
    }

    const filters = {
      city: city || undefined,
      type: query.type,
      minPrice: minPrice !== null ? minPrice : undefined,
      maxPrice: maxPrice !== null ? maxPrice : undefined,
    };

    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== "")
    );

    const params = new URLSearchParams(cleanedFilters).toString();

    navigate(`/list?${params}`);
  };

  return (
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={query.type === type ? "active" : ""}
            type="button"
          >
            {type}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="city"
          placeholder="City Location"
          value={query.city}
          onChange={handleChange}
          autoComplete="off"
        />
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={query.minPrice}
          onChange={handleChange}
          min="0"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={query.maxPrice}
          onChange={handleChange}
          min="0"
        />
        <button type="submit" className="searchBtn">
          <FaSearch size={20} />
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
