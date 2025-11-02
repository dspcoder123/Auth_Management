import React from "react";
import "./Timeline.css";

const timeline = [
  {
    date: "Feb 25, 2025",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed congue arcu, in et dignissim quam condimentum vel.",
    badge: { label: "Bitcoin", value: "4.1%" }
  },
  {
    date: "Jan 14, 2026",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed congue arcu, in et dignissim quam condimentum vel.",
    badge: { label: "Ethereum", value: "3.3%" }
  },
  {
    date: "Mar 30, 2028",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed congue arcu, in et dignissim quam condimentum vel.",
    badge: { label: "Chainlink", value: "4.2%" }
  },
  {
    date: "Dec 19, 2028",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed congue arcu, in et dignissim quam condimentum vel.",
    badge: { label: "Polygon", value: "3.8%" }
  }
];

export default function TimelineSection() {
  return (
    <section className="timeline-section">
      <div className="timeline-section__header">
        <span className="timeline-section__subtitle">ROADMAP</span>
        <h2 className="timeline-section__title">The Timeline</h2>
        <p className="timeline-section__desc">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed congue arcu, in et dignissim quam condimentum vel.
        </p>
      </div>
      <div className="timeline-section__track">
        <div className="timeline-section__line"></div>
        <div className="timeline-section__cards">
          {timeline.map((step, i) => (
            <div key={i} className={`timeline-card ${i % 2 === 0 ? "timeline-card--left" : "timeline-card--right"}`}>
              <div className="timeline-card__content">
                <div className="timeline-card__date">{step.date}</div>
                <div className="timeline-card__desc">{step.description}</div>
                <div className="timeline-card__badge">
                  {step.badge.label} <span>{step.badge.value}</span>
                </div>
              </div>
              <div className="timeline-card__dot"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
