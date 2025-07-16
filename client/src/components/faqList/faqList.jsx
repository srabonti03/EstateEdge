import React, { useState } from "react";
import "./faqList.scss";

function FAQList() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I schedule a visit to a property?",
      answer:
        "To schedule a visit, please click the 'Send a Message' button on the property page and inform the agent of your preferred time. The agent will coordinate with you directly to arrange the visit.",
    },
    {
      question: "Can I save properties for later viewing?",
      answer:
        "Yes, you can save properties for later by logging into your account and clicking the 'Save the Place' button on any listing. This allows you to easily access your favorite properties at any time.",
    },
    {
      question: "What is the process for buying a property through EstateEdge?",
      answer:
        "The process involves searching for your desired property, contacting the agent via message, scheduling a visit, and finalizing the purchase through the necessary documentation and agreements.",
    },
    {
      question: "Are the prices negotiable?",
      answer:
        "While sellers set the listed price, there is often room for negotiation. Agents can assist you in negotiating terms to achieve a fair deal.",
    },
    {
      question: "Is it possible to list my property on EstateEdge?",
      answer:
        "Yes, property owners can list their properties by registering on our platform and posting through their dashboard. This gives you full control over your listing and inquiries.",
    },
    {
      question: "What are the pet policies for rental properties?",
      answer:
        "Pet policies vary by property. Please refer to the 'Pet Policy' section on each listing or consult the agent directly for specific details.",
    },
    {
      question: "How secure is my personal information on EstateEdge?",
      answer:
        "We use industry-standard security measures to protect your personal information. Your data is stored securely and handled with strict confidentiality.",
    },
    {
      question: "Can I get help if I have trouble using the site?",
      answer:
        "Certainly. You can contact our support team via the contact page or reach out to the agent directly through the messaging system for assistance.",
    },
    {
      question: "What fees should I expect when buying or renting?",
      answer:
        "Typical fees may include agent commissions, taxes, and maintenance costs. These vary by transaction and location. Your agent can provide detailed information tailored to your situation.",
    },
    {
      question: "How do I know if a property is still available?",
      answer:
        "Listings that are sold or rented are clearly marked as such. For confirmation, please contact the agent directly to ensure the property is currently available.",
    },
    {
      question: "Can I negotiate rental terms?",
      answer:
        "Yes, rental terms can often be negotiated. Please discuss your requirements with the property owner or agent to agree on terms that suit you.",
    },
    {
      question: "Are virtual tours available for properties?",
      answer:
        "Some properties offer virtual tours or video walkthroughs. Look for multimedia icons on the listing or ask the agent if this option is available.",
    },
    {
      question: "What documents do I need to buy or rent a property?",
      answer:
        "Commonly required documents include valid identification, proof of income, and references. Your agent will guide you through the specific requirements.",
    },
    {
      question: "How can I contact the agent if I have questions?",
      answer:
        "You may contact the agent by clicking the 'Send a Message' button on the property listing page for prompt responses.",
    },
    {
      question: "Is there a mobile app for EstateEdge?",
      answer:
        "Currently, there is no dedicated mobile app. However, our website is fully optimized for mobile use, allowing access from any device.",
    },
    {
      question: "Can I get alerts for new properties matching my criteria?",
      answer:
        "Yes, by setting your preferences after registering an account, you will receive email notifications for new listings matching your criteria.",
    },
    {
      question: "What happens if I break my lease early?",
      answer:
        "Breaking a lease early may result in penalties or fees as outlined in your rental agreement. Please review your contract carefully and consult your agent.",
    },
    {
      question: "Do you provide mortgage or financing assistance?",
      answer:
        "We collaborate with trusted financial advisors who can assist you in exploring mortgage and financing options tailored to your needs.",
    },
    {
      question: "Can agents help me find properties based on my lifestyle?",
      answer:
        "Yes, our agents specialize in various property types and can assist in finding options that suit your lifestyle and preferences.",
    },
    {
      question: "Are there special listings for investment properties?",
      answer:
        "Yes, we offer listings focused on investment properties, supported by consultants who can help you build your real estate portfolio.",
    },
    {
      question: "How do I become an agent or admin on EstateEdge?",
      answer:
        "To become an agent or admin, please apply through our recruitment posts, demonstrating your qualifications and expertise.",
    },
    {
      question: "Can I chat directly with agents before visiting a property?",
      answer:
        "Yes, you can use our chat system to communicate directly with agents at any time for quick and direct conversations.",
    },
    {
      question: "Is there support for users with disabilities?",
      answer:
        "We are committed to accessibility and encourage users with specific needs to contact support so we can provide appropriate assistance.",
    },
  ];

  return (
    <div className="faqList">
      <div className="faq">
            <h2>Frequently Asked Questions</h2>
        <div className="faqItems">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faqItem ${openIndex === index ? "open" : ""}`}
            >
              <h3
                className="question"
                onClick={() => toggleFAQ(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") toggleFAQ(index);
                }}
              >
                {faq.question}
                <span className={`icon ${openIndex === index ? "open" : ""}`}>
                  ▼
                </span>
              </h3>
              {openIndex === index && <p className="answer">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </div>
      <div className="image-container">
        <img src="/faq.png" alt="Faqs" />
      </div>
    </div>
  );
}

export default FAQList;
