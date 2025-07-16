import { useState, useRef } from "react";
import emailjs from "emailjs-com";
import { 
  FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn, FaInstagram, FaTwitter, 
  FaEnvelope, FaPhoneAlt, FaMapMarkerAlt 
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./contactPage.scss";

const ContactPage = () => {
  const form = useRef();
  const [sending, setSending] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setSending(true);

    emailjs.sendForm(
      "service_o8v355b",
      "template_v70ej55",
      form.current,
      "ZjwKmULXmRa7I_ozB"
    )
    .then(() => {
      toast.success("Message sent successfully! I'll get back to you soon.");
      form.current.reset();
    })
    .catch(() => {
      toast.error("Failed to send message. Please try again later.");
    })
    .finally(() => setSending(false));
  };

  return (
    <div className="contactPage">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="overlay" />
      <div className="contact-container">
        <div className="contact-left">
          <h2>Let's Get in Touch</h2>
          <div className="info">
            <p><FaEnvelope /> Email: estateedge@gmail.com</p>
            <p><FaPhoneAlt /> Phone: +880 1234-567890</p>
            <p><FaMapMarkerAlt /> Address: Noyashorok, Sylhet</p>
            <p className="socials">Follow us or drop a message:</p>
          </div>
          <div className="social-icons">
            <a href="#" className="icon"><FaGoogle /></a>
            <a href="#" className="icon"><FaFacebookF /></a>
            <a href="#" className="icon"><FaGithub /></a>
            <a href="#" className="icon"><FaLinkedinIn /></a>
            <a href="#" className="icon"><FaInstagram /></a>
            <a href="#" className="icon"><FaTwitter /></a>
          </div>
        </div>

        <div className="contact-right">
          <h2>We'd Love to Hear From You</h2>
          <form ref={form} onSubmit={sendEmail}>
            <input type="text" name="from_name" placeholder="Your Name" required />
            <input type="email" name="reply_to" placeholder="Your Email" required />
            <textarea name="message" placeholder="Your Message" rows="5" required />
            <button type="submit" disabled={sending}>
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
