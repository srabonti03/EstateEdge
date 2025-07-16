import React, { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./blogList.scss";

const initialBlogs = [
  {
    title: "Top 5 Real Estate Trends in 2025",
    author: "Ayesha Rahman",
    date: "May 15, 2025",
    excerpt:
      "Explore the latest trends shaping the future of real estate — from AI-driven listings to sustainable architecture.",
    thumbnail: "blog.png",
    link: "https://realestateblog.example.com/trends-2025",
  },
  {
    title: "Why Smart Homes Are the Future",
    author: "Daniel Chowdhury",
    date: "April 30, 2025",
    excerpt:
      "Understand the impact of smart tech on property value and daily living, and why it's now a must-have.",
    thumbnail: "blog.png",
    link: "https://realestateblog.example.com/smart-homes-future",
  },
  {
    title: "EstateEdge’s Impact in Sylhet",
    author: "Nadia Islam",
    date: "March 28, 2025",
    excerpt:
      "A look into how EstateEdge is transforming local communities with smart development initiatives.",
    thumbnail: "blog.png",
    link: "https://realestateblog.example.com/sylhet-impact",
  },
  {
    title: "Luxury Living: Inside Dhaka’s Most Exclusive Properties",
    author: "Rana Biswas",
    date: "May 10, 2025",
    excerpt:
      "Step inside the luxury properties redefining elegance and comfort in Dhaka.",
    thumbnail: "blog.png",
    link: "https://realestateblog.example.com/luxury-dhaka",
  },
  {
    title: "How to Spot a Great Investment Property",
    author: "Maya Ahmed",
    date: "April 22, 2025",
    excerpt:
      "Key factors to evaluate before buying property that will appreciate in value.",
    thumbnail: "blog.png",
    link: "https://realestateblog.example.com/investment-tips",
  },
  {
    title: "Sustainable Building Materials Gaining Ground",
    author: "Kamran Hussain",
    date: "March 12, 2025",
    excerpt:
      "Discover eco-friendly materials changing the face of construction in Bangladesh.",
    thumbnail: "blog.png",
    link: "https://realestateblog.example.com/sustainable-materials",
  },
  {
    title: "Navigating Property Laws: What Buyers Need to Know",
    author: "Shazia Khatun",
    date: "May 18, 2025",
    excerpt:
      "A simple guide to understanding property ownership laws and avoiding legal pitfalls.",
    thumbnail: "blog.png",
    link: "https://realestateblog.example.com/property-laws",
  },
  {
    title: "Cozy Apartments for First-Time Buyers",
    author: "Faisal Rahman",
    date: "April 5, 2025",
    excerpt:
      "Affordable yet stylish apartments perfect for your first home purchase.",
    thumbnail: "blog.png",
    link: "https://realestateblog.example.com/cozy-apartments",
  },
  {
    title: "The Rise of Mixed-Use Developments in Bangladesh",
    author: "Nilufa Islam",
    date: "March 30, 2025",
    excerpt:
      "How mixed-use projects combine lifestyle and workspaces to boost urban living.",
    thumbnail: "blog.png",
    link: "https://realestateblog.example.com/mixed-use-developments",
  },
  {
    title: "EstateEdge’s Vision for Smart City Planning",
    author: "Arif Chowdhury",
    date: "May 2, 2025",
    excerpt:
      "Innovations in urban planning that make communities more livable and tech-forward.",
    thumbnail: "blog.png",
    link: "https://realestateblog.example.com/smart-city-planning",
  },
];

function BlogList() {
  const scrollRef = useRef(null);
  const [blogs, setBlogs] = useState(initialBlogs);
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
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="blog-list-page">
      <section className="blog-list">
        <div className="blog-header">
          <h2 className="blog-title">Latest Blog Posts</h2>
        </div>

        <div className="blog-container">
          {showArrows && (
            <button
              className="arrow-btn left"
              onClick={() => scroll("left")}
              aria-label="Scroll Left"
            >
              <FaChevronLeft size={24} />
            </button>
          )}

          <div className="blog-cards" ref={scrollRef}>
            {blogs.map(
              ({ title, author, date, excerpt, thumbnail, link }, index) => (
                <div key={index} className="blog-card">
                  <img src={thumbnail} alt={title} className="blog-thumbnail" />
                  <div className="blog-content">
                    <h3 className="blog-post-title">{title}</h3>
                    <p className="blog-excerpt">{excerpt}</p>
                    <span className="blog-meta">
                      {author} • {date}
                    </span>
                    <a
                      href={link}
                      className="read-more"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read more →
                    </a>
                  </div>
                </div>
              )
            )}
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

export default BlogList;
