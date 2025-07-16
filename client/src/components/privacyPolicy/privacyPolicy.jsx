import React, { useState } from "react";
import "./privacyPolicy.scss";

function PrivacyPolicy() {
  const [openIndex, setOpenIndex] = useState(null);

  const togglePolicy = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const policies = [
    {
      title: "Introduction",
      content:
        "Welcome to EstateEdge. We are committed to protecting your personal information and your right to privacy. This policy explains how we collect, use, and safeguard your data.",
    },
    {
      title: "Information We Collect",
      content:
        "We collect personal information that you provide when registering, using our services, or communicating with agents. This includes your name, email, phone number, and property preferences.",
    },
    {
      title: "How We Use Your Information",
      content:
        "Your data is used to personalize your experience, facilitate property transactions, improve our services, and communicate important updates. We do not sell your information to third parties.",
    },
    {
      title: "Data Security",
      content:
        "We implement industry-standard security measures to protect your information from unauthorized access, alteration, disclosure, or destruction.",
    },
    {
      title: "Cookies and Tracking",
      content:
        "Our website uses cookies to enhance your browsing experience and collect analytics data. You can manage cookie preferences through your browser settings.",
    },
    {
      title: "Third-Party Services",
      content:
        "We may share your information with trusted service providers who assist us in operating our platform and services, always under strict confidentiality agreements.",
    },
    {
      title: "Your Rights",
      content:
        "You have the right to access, correct, or delete your personal information. You can also opt out of marketing communications at any time by contacting us.",
    },
    {
      title: "Children's Privacy",
      content:
        "EstateEdge does not knowingly collect information from children under 13. If you believe we have, please contact us immediately to remove the data.",
    },
    {
      title: "Changes to This Policy",
      content:
        "We may update this Privacy Policy periodically. We will notify you of any significant changes by posting the new policy on our website.",
    },
    {
      title: "Contact Us",
      content:
        "For any questions or concerns regarding your privacy, please contact our support team at privacy@estateedge.com.",
    },
  ];

  return (
    <div className="privacy-policy container">
      <div className="privacy-policy-content">
        <header className="policy-header">
          <h1>Privacy Policy</h1>
          <p className="policy-intro">
            Your privacy is important to us. Read below to learn how we protect
            your personal data.
          </p>
        </header>
        <section className="policies-list" aria-label="Privacy Policy Sections">
          {policies.map((policy, index) => (
            <article key={index} className="policy-section">
              <button
                onClick={() => togglePolicy(index)}
                aria-expanded={openIndex === index}
                aria-controls={`policy-content-${index}`}
                className="policy-title"
              >
                {policy.title}
                <span
                  className={`icon ${openIndex === index ? "open" : ""}`}
                  aria-hidden="true"
                >
                  ▼
                </span>
              </button>
              {openIndex === index && (
                <div
                  id={`policy-content-${index}`}
                  className="policy-content"
                  tabIndex={0}
                >
                  <p>{policy.content}</p>
                </div>
              )}
            </article>
          ))}
        </section>
      </div>
      <div className="image-container">
        <img src="/privacypolicy.png" alt="Policy Illustration" />
      </div>
    </div>
  );
}

export default PrivacyPolicy;
