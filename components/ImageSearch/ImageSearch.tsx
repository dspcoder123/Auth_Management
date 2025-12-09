// components/ImageSearch/ImageSearchTool.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ImageSearch.css";

type Props = {
  onBack?: () => void;
};

type MatchResult = {
  pageUrl: string | null;
  imageUrl: string | null;
  title: string | null;
  snippet: string | null;
  score: number | null;
};

type ApiResponse = {
  _id: string;
  imageUrl: string;
  provider: string;
  results: MatchResult[];
  createdAt: string;
  updatedAt: string;
};

const ImageSearchTool: React.FC<Props> = ({ onBack }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<MatchResult[] | null>(null);

  useEffect(() => {
    if (!imageUrl.trim()) {
      setPreviewSrc(null);
      return;
    }
    try {
      const u = new URL(imageUrl);
      if (u.protocol === "http:" || u.protocol === "https:") {
        setPreviewSrc(imageUrl.trim());
      } else {
        setPreviewSrc(null);
      }
    } catch {
      setPreviewSrc(null);
    }
  }, [imageUrl]);

  const handleSubmit = async () => {
    try {
      setError(null);
      setResults(null);

      if (!imageUrl.trim()) {
        setError("Please enter an image URL.");
        return;
      }

      const base =
        process.env.REACT_APP_API_BASE_URL || "${process.env.NEXT_PUBLIC_BACKEND_URL}";

      setLoading(true);
      const res = await axios.post<ApiResponse>(
        `${base}/api/image-search/save-input`,
        { imageUrl: imageUrl.trim(), userId: "1" }
      );

      setResults(res.data.results || []);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Image search failed.";
      setError(typeof msg === "string" ? msg : "Image search failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="is-shell">
      <div className="is-tool-panel">
        <header className="is-header-row">
          <div>
            <h1 className="is-title">Reverse Image Search</h1>
            <p className="is-subtitle">
              Check where this image (or very similar ones) appears on the web.
            </p>
          </div>
          {onBack && (
            <button className="is-back-pill" type="button" onClick={onBack}>
              Back to Conversion
            </button>
          )}
        </header>

        <div className="is-main-grid">
          {/* Left: input + preview */}
          <section className="is-pane is-input-pane">
            <div className="is-control">
              <label className="is-label">Image URL</label>
              <input
                type="url"
                placeholder="https://example.com/logo.png"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <p className="is-hint">
                Use a direct URL to a JPG/PNG/WebP image. Publicly accessible.
              </p>
            </div>

            {previewSrc && (
              <div className="is-preview-box">
                <span className="is-preview-label">Preview</span>
                <div className="is-preview-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewSrc} alt="Source image" />
                </div>
              </div>
            )}

            <button
              type="button"
              className="is-submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search Web for Matches"}
            </button>

            {error && <p className="is-error">{error}</p>}
          </section>

          {/* Right: results list */}
          <section className="is-pane is-output-pane">
            {!results && !loading && (
              <p className="is-placeholder">
                Run a search to see pages that contain visually similar images.
              </p>
            )}

            {loading && !results && (
              <p className="is-placeholder">
                Looking for similar images on the web…
              </p>
            )}

            {results && results.length === 0 && (
              <p className="is-placeholder">
                No matches found for this image. Try a higher‑resolution or more
                common image.
              </p>
            )}

            {results && results.length > 0 && (
              <div className="is-results-list">
                {results.map((r, idx) => (
                  <a
                    key={idx}
                    className="is-result-item"
                    href={r.pageUrl || undefined}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="is-result-thumb">
                      {r.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.imageUrl} alt={r.title || "Match image"} />
                      )}
                    </div>
                    <div className="is-result-body">
                      <div className="is-result-title">
                        {r.title || "Untitled page"}
                      </div>
                      {r.pageUrl && (
                        <div className="is-result-domain">
                          {new URL(r.pageUrl).hostname}
                        </div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ImageSearchTool;
