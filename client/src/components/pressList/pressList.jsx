import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./pressList.scss";

const pressMentions = [
  {
    name: "Real Estate Today",
    logo: "press.png",
    quote:
      "EstateEdge is revolutionizing the property market with its innovative approach.",
    link: "https://realestatetoday.example.com/article/estateedge-innovation",
  },
  {
    name: "Real Estate Today",
    logo: "press.png",
    quote:
      "EstateEdge is revolutionizing the property market with its innovative approach.",
    link: "https://realestatetoday.example.com/article/estateedge-innovation",
  },
  {
    name: "Real Estate Today",
    logo: "press.png",
    quote:
      "EstateEdge is revolutionizing the property market with its innovative approach.",
    link: "https://realestatetoday.example.com/article/estateedge-innovation",
  },
  {
    name: "Real Estate Today",
    logo: "press.png",
    quote:
      "EstateEdge is revolutionizing the property market with its innovative approach.",
    link: "https://realestatetoday.example.com/article/estateedge-innovation",
  },
  {
    name: "Real Estate Today",
    logo: "press.png",
    quote:
      "EstateEdge is revolutionizing the property market with its innovative approach.",
    link: "https://realestatetoday.example.com/article/estateedge-innovation",
  },
  {
    name: "Luxury Living Mag",
    logo: "press.png",
    quote:
      "Setting new standards for eco-smart homes and smart technology integration.",
    link: "https://luxurylivingmag.example.com/features/estateedge",
  },
  {
    name: "The Property Insider",
    logo: "press.png",
    quote:
      "From Sylhet to the world — EstateEdge’s visionary architecture inspires future living.",
    link: "https://propertyinsider.example.com/estateedge-profile",
  },
  {
    name: "Global Architect",
    logo: "press.png",
    quote:
      "A fresh perspective on sustainable living spaces, EstateEdge leads the charge.",
    link: "https://globalarchitect.example.com/estateedge-sustainability",
  },
  {
    name: "Smart Homes Weekly",
    logo: "press.png",
    quote:
      "Smart home tech integration at its finest — EstateEdge raises the bar again.",
    link: "https://smarthomesweekly.example.com/estateedge-smart-tech",
  },
  {
    name: "EcoBuild Review",
    logo: "press.png",
    quote:
      "EstateEdge’s commitment to eco-conscious design is a game changer for urban development.",
    link: "https://ecobuildreview.example.com/estateedge-eco-design",
  },
  {
    name: "Sylhet Daily",
    logo: "press.png",
    quote:
      "Local roots, global ambitions — EstateEdge is putting Sylhet on the real estate map.",
    link: "https://sylhetdaily.example.com/estateedge-local-impact",
  },
];

function PressList() {
  const scrollRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (el) {
      setShowArrows(el.scrollWidth > el.clientWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => {
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300;
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="press-list-page">
      <section className="press-list">
        <h2 className="press-title">In The Press</h2>
        <p className="press-subtitle">
          Discover what top publications say about EstateEdge’s pioneering real
          estate vision.
        </p>

        <div className="press-container">
          {showArrows && (
            <button
              className="arrow-btn left"
              onClick={() => scroll("left")}
              aria-label="Scroll Left"
            >
              <FaChevronLeft size={24} />
            </button>
          )}

          <div className="press-cards" ref={scrollRef}>
            {pressMentions.map(({ name, logo, quote, link }, index) => (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
                className="press-card"
              >
                <img src={logo} alt={`${name} logo`} className="press-logo" />
                <div className="press-content">
                  <blockquote className="press-quote">"{quote}"</blockquote>
                  <span className="press-name">{name}</span>
                </div>
              </a>
            ))}
          </div>

          {showArrows && (
            <button
              className="arrow-btn right"
              onClick={() => scroll("right")}
              aria-label="Scroll Right"
            >
              <FaChevronRight size={24} />
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default PressList;
