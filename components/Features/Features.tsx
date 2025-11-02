import React from "react";
import './Features.css'; // Import this CSS file

interface FeatureSectionProps {
  isDark: boolean;
}

const features = [
  {
    icon: "shield",
    title: "Safe & Secure",
    desc: "Lorem ipsum dolor sit amet consectetur elit, sed do eiusmod tempor labore labore labore et dolor ."
  },
  {
    icon: "gift",
    title: "Early Bonus",
    desc: "Lorem ipsum dolor sit amet consectetur elit, sed do eiusmod tempor labore labore labore et dolor ."
  },
  {
    icon: "upload",
    title: "Universal Access",
    desc: "Lorem ipsum dolor sit amet consectetur elit, sed do eiusmod tempor labore labore labore et dolor ."
  },
  {
    icon: "database",
    title: "Secure Storage",
    desc: "Lorem ipsum dolor sit amet consectetur elit, sed do eiusmod tempor labore labore labore et dolor ."
  },
  {
    icon: "wallet",
    title: "Low Cost",
    desc: "Lorem ipsum dolor sit amet consectetur elit, sed do eiusmod tempor labore labore labore et dolor ."
  },
  {
    icon: "target",
    title: "Several Profit",
    desc: "Lorem ipsum dolor sit amet consectetur elit, sed do eiusmod tempor labore labore labore et dolor ."
  }
];

// Simple SVG icons, you can replace with your own
const FeatureIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case "shield":
      return (
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none"><circle cx="19" cy="19" r="19" fill="#3e7dff"/><path d="M19 11l6 3v4.5c0 4.2-2.902 8.026-6 9-3.098-0.974-6-4.8-6-9V14l6-3z" fill="#fff"/></svg>
      );
    case "gift":
      return (
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none"><circle cx="19" cy="19" r="19" fill="#3e7dff"/><rect x="12" y="16" width="14" height="10" rx="2" fill="#fff"/><rect x="16" y="12" width="6" height="4" rx="2" fill="#fff"/></svg>
      );
    case "upload":
      return (
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none"><circle cx="19" cy="19" r="19" fill="#3e7dff"/><polygon points="19,13 25,20 13,20" fill="#fff"/></svg>
      );
    case "database":
      return (
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none"><circle cx="19" cy="19" r="19" fill="#3e7dff"/><rect x="13" y="16" width="12" height="6" rx="2" fill="#fff"/></svg>
      );
    case "wallet":
      return (
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none"><circle cx="19" cy="19" r="19" fill="#3e7dff"/><rect x="12" y="15" width="14" height="8" rx="2" fill="#fff"/></svg>
      );
    case "target":
      return (
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none"><circle cx="19" cy="19" r="19" fill="#3e7dff"/><circle cx="19" cy="19" r="5" fill="#fff"/></svg>
      );
    default:
      return null;
  }
};

const FeatureSection: React.FC<FeatureSectionProps> = ({ isDark }) => (
  <section className={`features-section ${isDark ? "dark" : "light"}`}>
    <div className="features-header">
      <h2 className="features-title">Best Features</h2>
      <p className="features-desc">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nunc sed congue arcu, In et dignissim quam condimentum vel.
      </p>
    </div>
    <div className="features-grid">
      {features.map((feat, idx) => (
        <div className="feature-card" key={idx}>
          <div className="feature-icon">
            <FeatureIcon icon={feat.icon} />
          </div>
          <h3 className="feature-title">{feat.title}</h3>
          <p className="feature-text">{feat.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default FeatureSection;
