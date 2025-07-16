import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import "./filter.scss";

function Filter({ onFilterChange }) {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    type: "",
    property: "",
    minPrice: "",
    maxPrice: "",
    bedroom: "",
  });

  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    if (name === "city" && value.trim() === "") {
      onFilterChange({});
    }
  };

  const handleSearch = () => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "")
    );
    onFilterChange(cleanedFilters);
  };

  return (
    <div className="filter">
      <h1>
        📍Search results for <b>{filters.city || "any location"}</b>
      </h1>
      <div className="top">
        <div className="searchRow">
          <div className="item">
            <label htmlFor="city">Location</label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="City Location"
              value={filters.city}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className={`bottom ${isFilterVisible ? "visible" : "hidden"}`}>
        <div className="item-container">
          <div className="item">
            <label htmlFor="type">Type</label>
            <select
              name="type"
              id="type"
              value={filters.type}
              onChange={handleChange}
            >
              <option value="">All</option>
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </select>
          </div>
          <div className="item">
            <label htmlFor="property">Property</label>
            <select
              name="property"
              id="property"
              value={filters.property}
              onChange={handleChange}
            >
              <option value="">All</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="land">Land</option>
            </select>
          </div>
          <div className="item">
            <label htmlFor="minPrice">Min Price</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              placeholder="any"
              value={filters.minPrice}
              onChange={handleChange}
            />
          </div>
          <div className="item">
            <label htmlFor="maxPrice">Max Price</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              placeholder="any"
              value={filters.maxPrice}
              onChange={handleChange}
            />
          </div>
          <div className="item">
            <label htmlFor="bedroom">Bedroom</label>
            <input
              type="text"
              id="bedroom"
              name="bedroom"
              placeholder="any"
              value={filters.bedroom}
              onChange={handleChange}
            />
          </div>
          <button
            type="button"
            className="searchBtndesktop"
            onClick={handleSearch}
          >
            <BiSearch size={24} />
          </button>
        </div>
      </div>

      <div className="buttons">
        <button className="toggleBtn" onClick={toggleFilter}>
          {isFilterVisible ? "Hide Filters" : "Show Filters"}
        </button>
        <button className="searchBtn" onClick={handleSearch}>
          <BiSearch size={24} />
        </button>
      </div>
    </div>
  );
}

export default Filter;
