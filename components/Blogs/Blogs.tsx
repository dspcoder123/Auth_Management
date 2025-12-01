"use client";
import React, { useEffect, useState } from "react";
import "./Blogs.css";

interface QuickAction {
  title: string;
  description: string;
}

interface NewsItem {
  _id: string;
  title: string;
  description: string;
  sourceName: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  impactDescription : string;
  quickActions : string;
  
}

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/news")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNews(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="news-page">
      <div className="news-header">
        <span className="news-badge">Latest News</span>
        <h1 className="news-heading">Recent News Highlights</h1>
        <p className="news-subtitle">
          Curated headlines with quick-impact summaries and actions tailored for you.
        </p>
      </div>

      {loading ? (
        <p className="loading">Loading news...</p>
      ) : (
        <div className="news-grid">
          {news.map((item) => {

            const isExpanded = expandedId === item._id;

            return (
              <article key={item._id} className="news-card">
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

                  {isExpanded && (
                    <div className="ai-text-section">
                      <div className="impact-description">
                        <h3>Impact Analysis</h3>
                        <p>
                          {item.impactDescription||
                            "No impact description available."}
                        </p>
                        <h3>Quick Actions</h3>
                        <p>
                          {item.quickActions||
                            "No quick actions available."}
                        </p>
                      </div>

                     
                    </div>
                  )}
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
