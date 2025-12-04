// components/Deepfake/DeepfakeTool.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DeepFake.css";

type Props = {
  onBack?: () => void;
};

type DeepfakeResult = {
  id: string;
  score: number | null;
  percentage: number | null;
  label: string;
};

const DeepfakeTool: React.FC<Props> = ({ onBack }) => {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DeepfakeResult | null>(null);

  useEffect(() => {
    return () => {
      if (previewSrc && previewSrc.startsWith("blob:")) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [previewSrc]);

  const resetPreview = () => {
    if (previewSrc && previewSrc.startsWith("blob:")) {
      URL.revokeObjectURL(previewSrc);
    }
    setPreviewSrc(null);
  };

  const handleModeChange = (m: "url" | "upload") => {
    setMode(m);
    setImageUrl("");
    setFile(null);
    setResult(null);
    setError(null);
    resetPreview();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setResult(null);
    setError(null);
    resetPreview();
    if (f) {
      const url = URL.createObjectURL(f);
      setPreviewSrc(url);
    }
  };

  const handleUrlChange = (value: string) => {
    setImageUrl(value);
    setResult(null);
    setError(null);
    if (!value.trim()) {
      setPreviewSrc(null);
      return;
    }
    try {
      const u = new URL(value);
      if (u.protocol === "http:" || u.protocol === "https:") {
        setPreviewSrc(value.trim());
      } else {
        setPreviewSrc(null);
      }
    } catch {
      setPreviewSrc(null);
    }
  };

  const getLabelClass = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("likely deepfake")) return "risk-high";
    if (l.includes("uncertain")) return "risk-mid";
    if (l.includes("likely real")) return "risk-low";
    return "risk-none";
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setResult(null);

      const base =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

      let res;
      if (mode === "upload") {
        if (!file) {
          setError("Please select an image file.");
          return;
        }
        const form = new FormData();
        form.append("image", file);
        setLoading(true);
        res = await axios.post<DeepfakeResult>(
          `${base}/api/deepfake/analyze`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        if (!imageUrl.trim()) {
          setError("Please enter an image URL.");
          return;
        }
        setLoading(true);
        res = await axios.post<DeepfakeResult>(
          `${base}/api/deepfake/analyze`,
          { url: imageUrl.trim() }
        );
      }

      setResult(res.data);
    } catch (e: any) {
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        "Deepfake analysis failed.";
      setError(typeof msg === "string" ? msg : "Deepfake analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="df-shell">
      <div className="df-tool-panel">
        <header className="df-header-row">
          <div>
            <h1 className="df-title">Deepfake Check</h1>
            <p className="df-subtitle">
              Analyze an image to estimate whether it is likely real or a
              deepfake. Use clear face images for best results.
            </p>
          </div>
          {onBack && (
            <button className="df-back-pill" type="button" onClick={onBack}>
              Back to Conversion
            </button>
          )}
        </header>

        <div className="df-main-grid">
          {/* Input + preview */}
          <section className="df-pane df-input-pane">
            <div className="df-mode-tabs">
              <button
                type="button"
                className={mode === "url" ? "active" : ""}
                onClick={() => handleModeChange("url")}
              >
                URL
              </button>
              <button
                type="button"
                className={mode === "upload" ? "active" : ""}
                onClick={() => handleModeChange("upload")}
              >
                Upload
              </button>
            </div>

            {mode === "url" && (
              <div className="df-control">
                <label className="df-label">Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                />
                <p className="df-hint">
                  Publicly reachable URL to a JPG/PNG/WebP image.
                </p>
              </div>
            )}

            {mode === "upload" && (
              <div className="df-control">
                <label className="df-label">Upload image file</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <p className="df-hint">
                  Max 8 MB. Faces centered and well lit work best.
                </p>
              </div>
            )}

            {previewSrc && (
              <div className="df-preview-box">
                <span className="df-preview-label">Preview</span>
                <div className="df-preview-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewSrc} alt="Selected for analysis" />
                </div>
              </div>
            )}

            <button
              type="button"
              className="df-submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Image"}
            </button>

            {error && <p className="df-error">{error}</p>}
          </section>

          {/* Output */}
          <section className="df-pane df-output-pane">
            {!result && !loading && (
              <p className="df-placeholder">
                Run an analysis to see the deepfake score and risk label.
              </p>
            )}

            {loading && !result && (
              <p className="df-placeholder">
                Contacting detection engine… please wait.
              </p>
            )}

            {result && (
              <div className="df-results">
                <div
                  className={`df-score-bar ${
                    result.label ? getLabelClass(result.label) : "risk-none"
                  }`}
                >
                  <div className="df-score-main">
                    <div>
                      <span className="df-score-title">Deepfake likelihood</span>
                      <div className="df-score-subtitle">
                        Scores near 0% &rarr; likely real, near 100% &rarr; likely deepfake.
                      </div>
                    </div>
                    <span className="df-score-value">
                      {result.percentage != null
                        ? `${result.percentage.toFixed(1)}%`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="df-score-label">{result.label}</div>
                </div>

                <div className="df-detail-row">
                  <div className="df-detail-item">
                    <span className="df-detail-label">Raw score</span>
                    <span className="df-detail-value">
                      {result.score != null ? result.score.toFixed(3) : "—"}
                    </span>
                  </div>
                  <div className="df-detail-item">
                    <span className="df-detail-label">Risk category</span>
                    <span className="df-detail-value">
                      {getLabelClass(result.label) === "risk-high"
                        ? "High risk"
                        : getLabelClass(result.label) === "risk-mid"
                        ? "Needs review"
                        : getLabelClass(result.label) === "risk-low"
                        ? "Low risk"
                        : "No clear face"}
                    </span>
                  </div>
                </div>

                <div className="df-help-box">
                  <p className="df-help-title">Important</p>
                  <p className="df-help-text">
                    This tool provides an automated estimate only. Always combine
                    scores with human judgment and additional verification steps
                    before taking action.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default DeepfakeTool;
