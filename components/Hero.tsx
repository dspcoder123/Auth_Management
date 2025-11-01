import React from "react";
import '../styles/HomePage.css';
interface HeroSectionProps {
  isDark: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isDark }) => {
  return (
    <section className={`hero-section ${isDark ? "dark" : "light"}`}>
      <div className="hero-content">
        <h1 className="hero-title">
          Next.js Template and Boilerplate<br />for Crypto, ICO and Web3
        </h1>
        <p className="hero-desc">
          A Next.js website template for Crypto Currency, Blockchain, ICO,<br></br> 
          and Web3, meticulously styled with Tailwind CSS. This boilerplate includes <br></br>
          essential integrations, UI components, pages, and enabling you to <br></br>
          launch a comprehensive website or landing page for anything related to <br></br>
          Crypto, Blockchain, and Web3.
        </p>
        <div className="hero-icons">
          <span className="icon icon-btc">₿</span>
          <span className="icon icon-blue">●</span>
          <span className="icon icon-m">M</span>
          <span className="icon icon-diamond">♦</span>
          <span className="icon icon-purple">◉</span>
          <span className="icon icon-red">▲</span>
        </div>
        <button className="hero-btn">
          Buy Tokens 47% Off
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
