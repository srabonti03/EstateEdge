import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./footer.scss";

function Footer() {
  const [activeSection, setActiveSection] = useState(null);
  const { currentUser } = useContext(AuthContext);

  const toggleSection = (sectionName) => {
    setActiveSection((prev) => (prev === sectionName ? null : sectionName));
  };

  const loadCrispChat = () => {
    if (!currentUser || currentUser.role !== "user") {
      if (window.$crisp) {
        window.$crisp.push(["do", "chat:hide"]);
      }
      return;
    }

    if (!window.$crisp) {
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = "5b7034fe-6dbd-4cdf-9ad4-d1545cd0137e";

      const script = document.createElement("script");
      script.src = "https://client.crisp.chat/l.js";
      script.async = true;
      script.onload = () => {
        window.$crisp.push(["do", "chat:show"]);
        window.$crisp.push(["set", "user:email", [currentUser.email]]);
        window.$crisp.push(["set", "user:nickname", [currentUser.username]]);
        if (currentUser.phone) {
          window.$crisp.push(["set", "user:phone", [currentUser.phone]]);
        }
        if (currentUser.avatar) {
          window.$crisp.push(["set", "user:avatar", [currentUser.avatar]]);
        }
        window.$crisp.push(["do", "chat:open"]);
      };
      document.head.appendChild(script);
    } else {
      window.$crisp.push(["set", "user:email", [currentUser.email]]);
      window.$crisp.push(["set", "user:nickname", [currentUser.username]]);
      if (currentUser.phone) {
        window.$crisp.push(["set", "user:phone", [currentUser.phone]]);
      }
      if (currentUser.avatar) {
        window.$crisp.push(["set", "user:avatar", [currentUser.avatar]]);
      }
      window.$crisp.push(["do", "chat:show"]);
      window.$crisp.push(["do", "chat:open"]);
    }
  };

  const footerSections = [
    {
      title: "Buy & Rent",
      name: "buyrent",
      links: [
        { text: "Properties", to: "/list" },
        ...(currentUser ? [{ text: "Locations", to: "/locations" }] : []),
        ...(currentUser ? [{ text: "Agents", to: "/agent" }] : []),
      ],
    },
    {
      title: "Company",
      name: "company",
      links: [
        { text: "About Us", to: "/about" },
        ...(currentUser &&
        (currentUser.role === "user" || currentUser.role === "agent")
          ? [{ text: "Careers", to: "/careers" }]
          : []),
        { text: "Press", to: "/press" },
        { text: "Blog", to: "/blog" },
      ],
    },
    {
      title: "Support",
      name: "support",
      links: [
        { text: "FAQs", to: "/faq" },
        { text: "Terms & Conditions", to: "/terms" },
        { text: "Privacy Policy", to: "/privacy" },
        ...(currentUser ? [{ text: "Contact Us", to: "/contact" }] : []),
        ...(currentUser && currentUser.role === "user"
          ? [{ text: "Live Chat", onClick: loadCrispChat }]
          : []),
      ],
    },
  ];

  return (
    <footer className="footer-container">
      <div className="footer-top">
        <div className="footer-branding">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="EstateEdge Logo" />
            <span>EstateEdge</span>
          </Link>
          <p>Luxury Living. Smart Investments.</p>
          <div className="footerimg">
            <img src="footer.png" alt="footerimg" />
          </div>
        </div>

        <div className="footer-links">
          {footerSections.map((section) => (
            <div className="footer-section" key={section.name}>
              <h4
                className={activeSection === section.name ? "active" : ""}
                onClick={() => toggleSection(section.name)}
              >
                {section.title}
              </h4>
              <ul className={activeSection === section.name ? "active" : ""}>
                {section.links.map((link, index) => (
                  <li key={index}>
                    {link.onClick ? (
                      <span style={{ cursor: "pointer" }} onClick={link.onClick}>
                        {link.text}
                      </span>
                    ) : (
                      <Link to={link.to}>{link.text}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-newsletter">
          <h4>Stay Updated</h4>
          <p>
            Subscribe to our newsletter for market trends & exclusive listings.
          </p>
          <form>
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
          <div className="footer-socials">
            <a href="#">
              <FaFacebookF />
            </a>
            <a href="#">
              <FaTwitter />
            </a>
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} EstateEdge. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
