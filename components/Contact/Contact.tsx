import React from "react";
import "./Contact.css";
interface ContactSectionProps{
    isDark:boolean;
}

const ContactSection: React.FC<ContactSectionProps> = () => (
  <section className="contact-section">
    <div className="contact-inner">
      {/* Left: Info */}
      <div className="contact-info">
        <h5 className="contact-label">CONTACT US</h5>
        <h2 className="contact-title">
          Let's talk about
          <br />
          your problem.
        </h2>
        <div className="contact-list-grid">
          <div>
            <h6 className="contact-list-heading">Our Location</h6>
            <p className="contact-list-item">
              401 Broadway, 24th Floor, <br />
              Orchard Cloud View, London
            </p>
          </div>
          <div>
            <h6 className="contact-list-heading">Email Address</h6>
            <p className="contact-list-item">info@yourdomain.com<br />contact@yourdomain.com</p>
          </div>
          <div>
            <h6 className="contact-list-heading">Phone Number</h6>
            <p className="contact-list-item">
              +990 846 73644<br />+550 9475 4543
            </p>
          </div>
          <div>
            <h6 className="contact-list-heading">How Can We Help?</h6>
            <p className="contact-list-item">
              Tell us your problem we will get<br />
              back to you ASAP.
            </p>
          </div>
        </div>
      </div>
      {/* Right: Form */}
      <div className="contact-form-card">
        <h3 className="form-title">Send us a Message</h3>
        <form className="contact-form" onSubmit={e => e.preventDefault()}>
          <label>
            <span>Full Name*</span>
            <input type="text" placeholder="Enter your full name" required />
          </label>
          <label>
            <span>Email Address*</span>
            <input type="email" placeholder="Enter your email address" required />
          </label>
          <label>
            <span>Message*</span>
            <textarea placeholder="Type your message" rows={4} required />
          </label>
          <button type="submit" className="contact-submit-btn">
            Send Message
          </button>
        </form>
      </div>
    </div>
  </section>
);

export default ContactSection;
