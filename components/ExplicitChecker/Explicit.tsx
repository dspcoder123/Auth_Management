// ExplicitChecker.tsx
import React, { useState } from "react";
import axios from "axios";
import "./Explicit.css";

type Props = {
  onBack?: () => void;
};

type Percentages = {
  safe: number | null;
  partial: number | null;
  raw: number | null;
  deepfake: number | null;
  aiGenerated: number | null;
};

const ExplicitChecker: React.FC<Props> = ({ onBack }) => {
  const [mode, setMode] = useState<"upload" | "camera" | "url">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [percentages, setPercentages] = useState<Percentages | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setUrl("");
    setError(null);
    setPercentages(null);
    setPreview(URL.createObjectURL(f));
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setFile(null);
    setPreview(e.target.value || null);
    setError(null);
    setPercentages(null);
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setPercentages(null);

      if (mode === "upload" || mode === "camera") {
        if (!file) {
          setError("Please select or capture an image first.");
          return;
        }
      } else if (mode === "url") {
        if (!url.trim()) {
          setError("Please enter an image URL.");
          return;
        }
      }

      setLoading(true);

      let res;
      if (mode === "upload" || mode === "camera") {
        const form = new FormData();
        form.append("image", file as Blob); // backend field name = image
        res = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/api/safety/analyze`,
          form,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        res = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/api/safety/analyze`,
          { url }
        );
      }

      const data = res.data as { percentages: Percentages };
      setPercentages(data.percentages);
    } catch (e: any) {
      const msg =
        e?.response?.data?.error?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Failed to analyze image.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (next: "upload" | "camera" | "url") => {
    setMode(next);
    setFile(null);
    setUrl("");
    setPreview(null);
    setPercentages(null);
    setError(null);
  };

  return (
    <div className="explicit-page">
      <div className="explicit-header">
        {onBack && (
          <button className="explicit-back" onClick={onBack} type="button">
            ← Back
          </button>
        )}
        <div>
          <h1 className="explicit-title">Explicit Content Check</h1>
          <p className="explicit-subtitle">
            Analyze images for deepfakes, nudity, and explicit content using Sightengine.
          </p>
        </div>
      </div>

      <div className="explicit-layout">
        {/* Left: input + preview */}
        <div className="explicit-card">
          <div className="explicit-mode-tabs">
            <button
              type="button"
              className={mode === "upload" ? "active" : ""}
              onClick={() => handleModeChange("upload")}
            >
              Upload
            </button>
            <button
              type="button"
              className={mode === "camera" ? "active" : ""}
              onClick={() => handleModeChange("camera")}
            >
              Camera
            </button>
            <button
              type="button"
              className={mode === "url" ? "active" : ""}
              onClick={() => handleModeChange("url")}
            >
              URL
            </button>
          </div>

          {mode === "upload" && (
            <div className="explicit-control">
              <label className="explicit-label">Choose image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          )}

          {mode === "camera" && (
            <div className="explicit-control">
              <label className="explicit-label">Capture from camera</label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
              />
              <p className="explicit-hint">
                On mobile this opens the camera. On desktop it behaves like a normal file picker. [web:93][web:27]
              </p>
            </div>
          )}

          {mode === "url" && (
            <div className="explicit-control">
              <label className="explicit-label">Image URL</label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={url}
                onChange={handleUrlChange}
              />
            </div>
          )}

          {preview && (
            <div className="explicit-preview">
              <img src={preview} alt="Preview" />
            </div>
          )}

          <button
            type="button"
            className="explicit-analyze-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>

          {error && <p className="explicit-error">{error}</p>}
        </div>

        {/* Right: results */}
        <div className="explicit-card explicit-results-card">
          <h2 className="explicit-results-title">Analysis Results</h2>

          {!percentages && !loading && (
            <p className="explicit-placeholder">
              Upload an image or provide a URL, then click Analyze to see scores.
            </p>
          )}

          {percentages && (
            <div className="explicit-results-grid">
              <div className="explicit-result safe">
                <span className="label">Safe Content</span>
                <span className="value">
                  {percentages.safe != null ? `${percentages.safe}%` : "–"}
                </span>
              </div>
              <div className="explicit-result warn">
                <span className="label">Partial Nudity</span>
                <span className="value">
                  {percentages.partial != null ? `${percentages.partial}%` : "–"}
                </span>
              </div>
              <div className="explicit-result danger">
                <span className="label">Explicit / Raw</span>
                <span className="value">
                  {percentages.raw != null ? `${percentages.raw}%` : "–"}
                </span>
              </div>
              <div className="explicit-result">
                <span className="label">Deepfake Likelihood</span>
                <span className="value">
                  {percentages.deepfake != null ? `${percentages.deepfake}%` : "–"}
                </span>
              </div>
              <div className="explicit-result">
                <span className="label">AI Generated Likelihood</span>
                <span className="value">
                  {percentages.aiGenerated != null
                    ? `${percentages.aiGenerated}%`
                    : "–"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplicitChecker;
