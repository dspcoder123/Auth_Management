// GdprChecker.tsx
import React, { useState } from "react";
import axios from "axios";
import "./Gdpr.css";

type Props = {
  onBack?: () => void;
};

type GdprResult = {
  _id?: string;
  url: string;
  userId?: string;
  score: number;
  sslSecure: boolean;
  privacyPolicyFound: boolean;
  cookieBannerFound: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const GdprChecker: React.FC<Props> = ({ onBack }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GdprResult | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setError(null);
  };

  const handleScan = async () => {
    setError(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a website URL.");
      return;
    }
    if (!/^https?:\/\//i.test(trimmed)) {
      setError("URL must start with http:// or https://");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const base =
        process.env.REACT_APP_API_BASE_URL || "${process.env.NEXT_PUBLIC_BACKEND_URL}";

      const res = await axios.post<GdprResult>(`${base}/api/gdpr/scan`, {
        url: trimmed,
        // userId: "1", // optional: fill from your auth context later
      });

      setResult(res.data);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Failed to run GDPR scan.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString();
  };

  return (
    <div className="gdpr-page">
      <div className="gdpr-header">
        {onBack && (
          <button className="gdpr-back" onClick={onBack} type="button">
            ← Back
          </button>
        )}
        <div>
          <h1 className="gdpr-title">GDPR Compliance Check</h1>
          <p className="gdpr-subtitle">
            Scan a website for basic GDPR indicators like HTTPS, privacy policy,
            and cookie banner using your backend scanner.
          </p>
        </div>
      </div>

      <div className="gdpr-layout">
        {/* Left: input */}
        <div className="gdpr-card">
          <div className="gdpr-control">
            <label className="gdpr-label">Website URL</label>
            <input
              type="url"
              placeholder="https://www.example.com"
              value={url}
              onChange={handleUrlChange}
            />
            <p className="gdpr-hint">
              Enter the public URL of the site you want to check.
            </p>
          </div>

          <button
            type="button"
            className="gdpr-scan-btn"
            onClick={handleScan}
            disabled={loading}
          >
            {loading ? "Scanning..." : "Scan Website"}
          </button>

          {error && <p className="gdpr-error">{error}</p>}

          {result && (
            <p className="gdpr-last-scanned">
              Last scanned: <span>{formatDate(result.createdAt)}</span>
            </p>
          )}
        </div>

        {/* Right: results */}
        <div className="gdpr-card gdpr-results-card">
          <h2 className="gdpr-results-title">Scan Results</h2>

          {!result && !loading && (
            <p className="gdpr-placeholder">
              Enter a website URL and click Scan to see its GDPR indicators.
            </p>
          )}

          {loading && !result && (
            <p className="gdpr-placeholder">Running scan, please wait…</p>
          )}

          {result && (
            <div className="gdpr-results-content">
              <div className="gdpr-score-block">
                <span className="gdpr-score-label">Overall Score</span>
                <span className="gdpr-score-value">{result.score ?? 0}</span>
              </div>

              <div className="gdpr-results-grid">
                <div className="gdpr-result-row">
                  <span className="label">SSL / HTTPS</span>
                  <span
                    className={
                      "value " + (result.sslSecure ? "ok" : "bad")
                    }
                  >
                    {result.sslSecure ? "Yes" : "No"}
                  </span>
                </div>
                <div className="gdpr-result-row">
                  <span className="label">Privacy Policy Found</span>
                  <span
                    className={
                      "value " + (result.privacyPolicyFound ? "ok" : "bad")
                    }
                  >
                    {result.privacyPolicyFound ? "Yes" : "No"}
                  </span>
                </div>
                <div className="gdpr-result-row">
                  <span className="label">Cookie Banner Found</span>
                  <span
                    className={
                      "value " + (result.cookieBannerFound ? "ok" : "bad")
                    }
                  >
                    {result.cookieBannerFound ? "Yes" : "No"}
                  </span>
                </div>
                <div className="gdpr-result-row meta">
                  <span className="label">URL</span>
                  <span className="value url">{result.url}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GdprChecker;
