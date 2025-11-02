import React from "react";
import "./News.css";

interface NewsProps{
    isDark :boolean;
}

const NewsletterSection: React.FC <NewsProps> = ({isDark}) => (
  <section className="newsletter-section">
    <div className="newsletter-inner">
      <div className="newsletter-left">
        <h2 className="newsletter-title">Newsletter</h2>
        <p className="newsletter-desc">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          <br />
          Nam vitae quam nec ante aliquet fringilla vel at erat.
        </p>
      </div>
      <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
        <input
          className="newsletter-input"
          type="email"
          placeholder="Enter email address"
          required
        />
        <button className="newsletter-btn" type="submit">
          Submit <span className="arrow">➔</span>
        </button>
      </form>
    </div>
  </section>
);

export default NewsletterSection;
