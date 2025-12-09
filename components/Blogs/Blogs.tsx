"use client";
import React, { useEffect, useState } from "react";
import "./Blogs.css";

interface NewsItem {
  _id: string;
  title: string;
  description: string;
  sourceName: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  impactDescription: string;
  quickActions: string;
}

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("${process.env.NEXT_PUBLIC_BACKEND_URL}/api/news")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNews(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="news-page">
      <div className="news-header">
        <span className="news-badge">Latest News</span>
        <h1 className="news-heading">Recent News Highlights</h1>
        <p className="news-subtitle">
          Curated headlines with quick-impact summaries and actions tailored for
          you.
        </p>
      </div>

      {loading ? (
        <p className="loading">Loading news...</p>
      ) : (
        <div className="news-grid">
          {news.map((item) => {
            const isExpanded = expandedId === item._id;

            return (
              <article
                key={item._id}
                className={`news-card ${
                  isExpanded ? "news-card--expanded" : ""
                }`}
              >
                <div className="news-image-wrapper">
                  <img
                    className="news-image"
                    src={item.urlToImage}
                    alt={item.title}
                  />
                  <div className="news-chip">{item.sourceName}</div>
                </div>

                <div className="news-content">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-title"
                  >
                    {item.title}
                  </a>

                  <p className="news-description">{item.description}</p>

                  <div className="news-meta">
                    <span className="news-date">
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </span>
                    <button
                      className="view-more-btn"
                      onClick={() => toggleExpand(item._id)}
                    >
                      {isExpanded ? "Hide insight" : "View insight"}
                    </button>
                  </div>

                  {/* Insight section with smooth expand */}
                  <div
                    className={`ai-text-container ${
                      isExpanded ? "ai-text-container--open" : ""
                    }`}
                  >
                    <div className="ai-text-section">
                      <div className="impact-description">
                        <h3>Impact analysis</h3>
                        <p>
                          {item.impactDescription ||
                            "No impact description available."}
                        </p>
                      </div>

                      <div className="quick-actions">
                        <h3>Quick actions</h3>
                        <p>
                          {item.quickActions || "No quick actions available."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom action bar */}
                  <div className="news-actions-bar">
                    <button className="news-action-btn">👍 Like</button>
                    <button className="news-action-btn">👎 Dislike</button>
                    <button className="news-action-btn">🔗 Share</button>
                    <button className="news-action-btn">🔔 Subscribe</button>
                    <button className="news-action-btn news-action-btn--primary">
                      🧠 Ask expert
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default NewsPage;
