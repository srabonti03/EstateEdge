import React from 'react';
import './termsAndConditions.scss';

function TermsAndConditions() {
  const terms = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing or using EstateEdge, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, you may not use our services.",
    },
    {
      title: "2. Modifications to Terms",
      content:
        "EstateEdge reserves the right to change or update these terms at any time. Continued use of the service after changes means you accept the new terms.",
    },
    {
      title: "3. User Responsibilities",
      content:
        "You are responsible for maintaining the confidentiality of your account, and for all activities that occur under your account.",
    },
    {
      title: "4. Property Listings",
      content:
        "Listings must be accurate and truthful. EstateEdge holds the right to remove listings that are misleading or violate our policies.",
    },
    {
      title: "5. Intellectual Property",
      content:
        "All content on EstateEdge, including text, graphics, logos, and software, is the property of EstateEdge and protected by copyright laws.",
    },
    {
      title: "6. Privacy Policy",
      content:
        "Our Privacy Policy explains how we collect, use, and protect your personal data. By using EstateEdge, you agree to our privacy practices.",
    },
    {
      title: "7. Termination",
      content:
        "EstateEdge may terminate or suspend access to the platform for users who violate these terms, without prior notice or liability.",
    },
    {
      title: "8. Limitation of Liability",
      content:
        "EstateEdge is not liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the platform.",
    },
    {
      title: "9. Governing Law",
      content:
        "These Terms shall be governed by and interpreted in accordance with the laws of the jurisdiction in which EstateEdge operates.",
    },
    {
      title: "10. Contact Us",
      content:
        "For any questions regarding these Terms and Conditions, please contact us through our official support channels.",
    },
  ];

  return (
    <div className="termsWrapper">
      <div className="termsSection">
        <h2>Terms and Conditions</h2>
        <div className="termsContent">
          {terms.map((term, index) => (
            <div className="termItem" key={index}>
              <h3 className="termTitle">{term.title}</h3>
              <p className="termText">{term.content}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="imageSection">
        <img src="/termsandconditions.png" alt="Terms and Conditions" />
      </div>
    </div>
  );
}

export default TermsAndConditions;
