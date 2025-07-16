import "./newPostPage.scss";
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function NewPostPage() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [bedroom, setBedroom] = useState("");
  const [bathroom, setBathroom] = useState("");
  const [type, setType] = useState("rent");
  const [property, setProperty] = useState("apartment");
  const [utilities, setUtilities] = useState("owner");
  const [pet, setPet] = useState("allowed");
  const [income, setIncome] = useState("");
  const [size, setSize] = useState("");
  const [school, setSchool] = useState("");
  const [bus, setBus] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setSelectedImages(files);
  };

  const generateLatLong = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
        },
        () => {
          toast.error("Unable to retrieve your location.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    generateLatLong();
  }, []);

  const fetchLatLongFromAddress = async (addr) => {
    if (!addr) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setLatitude(data[0].lat);
        setLongitude(data[0].lon);
      } else {
        setLatitude("");
        setLongitude("");
      }
    } catch (error) {
      toast.error("Failed to fetch coordinates.");
    }
  };

  const fetchLatLongFromCity = async (cty) => {
    if (!cty) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cty)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setLatitude(data[0].lat);
        setLongitude(data[0].lon);
      } else {
        setLatitude("");
        setLongitude("");
      }
    } catch (error) {
      toast.error("Failed to fetch coordinates.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    selectedImages.forEach((image) => {
      formData.append("images", image);
    });

    formData.append("title", title);
    formData.append("price", price.toString());
    formData.append("address", address);
    formData.append("city", city);
    formData.append("bedroom", bedroom.toString());
    formData.append("bathroom", bathroom.toString());
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("type", type);
    formData.append("property", property);
    formData.append("desc", description);
    formData.append("utilities", utilities);
    formData.append("pet", pet);
    formData.append("income", income.toString());
    formData.append("size", size.toString());
    formData.append("school", school.toString());
    formData.append("bus", bus.toString());
    formData.append("restaurant", restaurant.toString());

    try {
      const response = await fetch("http://localhost:3000/api/post/addpost", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.status === 401 || response.status === 403) {
        toast.error("You are not authenticated. Please login.");
        return;
      }

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      toast.success("Post added successfully! Your property listing is pending admin approval before it goes live.");
          setSelectedImages([]);
          setDescription("");
          setTitle("");
          setPrice("");
          setAddress("");
          setCity("");
          setBedroom("");
          setBathroom("");
          setType("rent");
          setProperty("apartment");
          setUtilities("owner");
          setPet("allowed");
          setIncome("");
          setSize("");
          setSchool("");
          setBus("");
          setRestaurant("");
          setLatitude("");
          setLongitude("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="newPostPage">
      <div className="background"></div>
      <ToastContainer position="top-center" />
      <div className="form-container">
        <div className="heading-with-upload">
          <h1 className="page-heading">Add New Posts</h1>
          <button
            className="plusUploadButton"
            onClick={() => document.getElementById("imageUpload").click()}
            aria-label="Select Images"
            type="button"
          >
            +
          </button>
        </div>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="row three-items">
              <div className="item">
                <label htmlFor="price">Price</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="item">
                <label htmlFor="address">Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    fetchLatLongFromAddress(e.target.value);
                  }}
                />
              </div>
              <div className="item">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    fetchLatLongFromCity(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="item">
              <label htmlFor="desc">Description</label>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                id="desc"
                placeholder="Enter a detailed description"
              />
            </div>
            <div className="row two-items">
              <div className="item">
                <label htmlFor="latitude">Latitude</label>
                <input
                  id="latitude"
                  name="latitude"
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                />
              </div>
              <div className="item">
                <label htmlFor="longitude">Longitude</label>
                <input
                  id="longitude"
                  name="longitude"
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                />
              </div>
            </div>
            <div className="row two-items">
              <div className="item">
                <label htmlFor="bedroom">Bedroom</label>
                <input
                  min={0}
                  id="bedroom"
                  name="bedroom"
                  type="number"
                  value={bedroom}
                  onChange={(e) => setBedroom(e.target.value)}
                />
              </div>
              <div className="item">
                <label htmlFor="bathroom">Bathroom</label>
                <input
                  min={0}
                  id="bathroom"
                  name="bathroom"
                  type="number"
                  value={bathroom}
                  onChange={(e) => setBathroom(e.target.value)}
                />
              </div>
            </div>
            <div className="row four-items">
              <div className="item">
                <label htmlFor="type">Type</label>
                <select
                  name="type"
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="rent">Rent</option>
                  <option value="buy">Buy</option>
                </select>
              </div>
              <div className="item">
                <label htmlFor="property">Property</label>
                <select
                  name="property"
                  id="property"
                  value={property}
                  onChange={(e) => setProperty(e.target.value)}
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="land">Land</option>
                </select>
              </div>
              <div className="item">
                <label htmlFor="utilities">Utilities Policy</label>
                <select
                  name="utilities"
                  id="utilities"
                  value={utilities}
                  onChange={(e) => setUtilities(e.target.value)}
                >
                  <option value="owner">Owner is responsible</option>
                  <option value="tenant">Tenant is responsible</option>
                  <option value="shared">Shared</option>
                </select>
              </div>
              <div className="item">
                <label htmlFor="pet">Pet Policy</label>
                <select
                  name="pet"
                  id="pet"
                  value={pet}
                  onChange={(e) => setPet(e.target.value)}
                >
                  <option value="allowed">Allowed</option>
                  <option value="not-allowed">Not Allowed</option>
                </select>
              </div>
            </div>

            <div className="row two-items">
              <div className="item">
                <label htmlFor="income">Income Policy</label>
                <input
                  id="income"
                  name="income"
                  type="text"
                  placeholder="Income Policy"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                />
              </div>
              <div className="item">
                <label htmlFor="size">Total Size (sqft)</label>
                <input
                  min={0}
                  id="size"
                  name="size"
                  type="number"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                />
              </div>
            </div>

            <div className="row four-items">
              <div className="item">
                <label htmlFor="school">School</label>
                <input
                  min={0}
                  id="school"
                  name="school"
                  type="number"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                />
              </div>
              <div className="item">
                <label htmlFor="bus">Bus</label>
                <input
                  min={0}
                  id="bus"
                  name="bus"
                  type="number"
                  value={bus}
                  onChange={(e) => setBus(e.target.value)}
                />
              </div>
              <div className="item">
                <label htmlFor="restaurant">Restaurant</label>
                <input
                  min={0}
                  id="restaurant"
                  name="restaurant"
                  type="number"
                  value={restaurant}
                  onChange={(e) => setRestaurant(e.target.value)}
                />
              </div>
              <div className="item">
                <button className="sendButton" type="submit">
                  Add
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="image-container">
        <div className="image-upload">
          <input
            type="file"
            name="images"
            id="imageUpload"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          {selectedImages.length > 0 && (
            <div className="preview-container">
              {selectedImages.map((image, index) => (
                <div key={index} className="preview-image-wrapper">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Selected ${index + 1}`}
                    className="preview-image"
                  />
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => document.getElementById("imageUpload").click()}
            className="uploadButton"
            type="button"
          >
            upload
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewPostPage;
