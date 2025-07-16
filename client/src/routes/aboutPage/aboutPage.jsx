import "./AboutPage.scss";
import { Link } from "react-router-dom";
import { FaSatelliteDish, FaUserTie, FaLeaf } from "react-icons/fa";
import { useState, useEffect } from "react";

const AboutPage = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setRole(user.role || null);
    }
  }, []);

  return (
    <div className="AboutPage">
      <section className="hero">
        <img
          src="banner.jpg"
          alt="EstateEdge"
          className="hero-image"
        />
      </section>
      <section className="about">
        <div className="about-content">
          <div className="about-visual">
            <div className="about-img-wrapper">
              <img
                src="property.png"
                alt="Property"
                className="about-img"
              />
              <span className="about-img-alt">Explore Luxury Living</span>
            </div>
            <div className="about-img-wrapper">
              <img
                src="interior.png"
                alt="Interior Shots of Home"
                className="about-img"
              />
              <span className="about-img-alt">Transform Your Space</span>
            </div>
            <div className="about-img-wrapper">
              <img
                src="team&client.jpg"
                alt="Team Portraits & Client Interaction"
                className="about-img"
              />
              <span className="about-img-alt">Find Your Dream Home</span>
            </div>
          </div>
          <div className="about-info">
            <h3 className="about-heading">Our Story</h3>
            <p className="about-desc">
              At EstateEdge, we believe in redefining the way you experience living spaces. Our approach fuses cutting-edge technology with visionary architecture to create environments that inspire. Whether it’s a smart home designed for the future or an eco-friendly space crafted with care, our commitment is to deliver more than just a property. It’s about creating a lifestyle—one that’s as forward-thinking as you are.
            </p>
            <p className="about-desc">
              We understand that a home is more than just walls and roofs; it's where memories are made and futures are built. With a focus on design that evolves with the times, we ensure that every corner of our properties reflects a perfect balance of functionality and elegance. Our mission is to provide not just a place to live, but a sanctuary that nurtures growth, creativity, and well-being, with every detail crafted to suit the needs of modern living.
            </p>

            <div className="about-values">
              <div className="value">
                <FaSatelliteDish className="value-icon" />
                <span>Tech-first</span>
              </div>
              <div className="value">
                <FaUserTie className="value-icon" />
                <span>Client-Driven</span>
              </div>
              <div className="value">
                <FaLeaf className="value-icon" />
                <span>Eco Smart</span>
              </div>
            </div>

            <div className="about-footer">
              <div className="about-location">
                <strong>📍 Noyashorok, Sylhet</strong>
              </div>

              <div className="about-buttons">
                <Link to="/list" className="btn primary">
                  Explore Listings
                </Link>
                {role === "user" && (
                  <Link to="/agent" className="btn secondary">
                    Meet Our Team
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
