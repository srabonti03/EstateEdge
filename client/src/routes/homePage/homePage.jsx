import React, { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">
            Find Your Dream Property with <span>EstateEdge</span>
          </h1>
          <p>
            EstateEdge is your trusted partner in discovering the perfect place to live, work, or invest. 
            With a wide range of verified properties, expert guidance, and personalized support, we make 
            real estate simple and seamless—just the way it should be.
          </p>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1>10+</h1>
              <h2>Years of Expertise</h2>
            </div>
            <div className="box">
              <h1>150+</h1>
              <h2>Trusted Partners</h2>
            </div>
            <div className="box">
              <h1>3000+</h1>
              <h2>Listings Available</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="bg" />
      </div>
    </div>
  );
}

export default HomePage;
