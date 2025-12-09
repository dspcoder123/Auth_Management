"use client";

import React, { useState } from "react";
import axios from "axios";
import "./Trans.css";

type Props = {
  onBack?: () => void;
};

type SentimentSegment = {
  text: string;
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | string;
  confidence?: number;
};

type TranscriptResult = {
  _id: string;
  aaiTranscriptId: string;
  status: string;
  text: string;
  confidence?: number;
  audioDuration?: number;
  summary?: string;
  sentiment?: SentimentSegment[];
  createdAt?: string;
};

const Transcript: React.FC<Props> = ({ onBack }) => {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [audioUrl, setAudioUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TranscriptResult | null>(null);

  const handleModeChange = (next: "url" | "upload") => {
    setMode(next);
    setAudioUrl("");
    setFile(null);
    setResult(null);
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setError(null);
    setResult(null);
  };

  const formatDuration = (secs?: number) => {
    if (!secs && secs !== 0) return "—";
    const s = Math.round(secs);
    const m = Math.floor(s / 60);
    const r = s % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${r}s`;
  };

  const formatConfidence = (c?: number) =>
    typeof c === "number" ? `${(c * 100).toFixed(1)}%` : "—";

  const dominantSentiment = (sentiment?: SentimentSegment[]) => {
    if (!sentiment || sentiment.length === 0) return null;
    const counts: Record<string, number> = {};
    sentiment.forEach((seg) => {
      const key = seg.sentiment || "UNKNOWN";
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setResult(null);

      const base =
        process.env.REACT_APP_API_BASE_URL || "${process.env.NEXT_PUBLIC_BACKEND_URL}";

      let res;
      if (mode === "upload") {
        if (!file) {
          setError("Please choose an audio file.");
          return;
        }
        const form = new FormData();
        form.append("audio", file);
        form.append("userId", "1");
        setLoading(true);
        res = await axios.post<TranscriptResult>(
          `${base}/api/assemblyai/transcribe`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        if (!audioUrl.trim()) {
          setError("Please enter an audio URL.");
          return;
        }
        setLoading(true);
        res = await axios.post<TranscriptResult>(
          `${base}/api/assemblyai/transcribe`,
          { audioUrl: audioUrl.trim(), userId: "1" }
        );
      }

      setResult(res.data);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Transcription failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const domSent = dominantSentiment(result?.sentiment);

  return (
    <div className="trans-shell">
      <div className="trans-tool-panel">
        <header className="trans-header-row">
          <div>
            <h1 className="trans-title">Audio to Text (AssemblyAI)</h1>
            <p className="trans-subtitle">
              Upload audio or paste a URL, then explore clear transcript and
              sentiment insights.
            </p>
          </div>
          {onBack && (
            <button className="trans-back-pill" type="button" onClick={onBack}>
              Back to Conversion
            </button>
          )}
        </header>

        <div className="trans-main-grid">
          {/* Left: compact input pane */}
          <section className="trans-pane trans-input-pane">
            <div className="trans-mode-tabs">
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
              <div className="trans-control">
                <label className="trans-label">Audio URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/audio.mp3"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                />
                <p className="trans-hint">
                  Publicly reachable URL (mp3, wav, m4a, etc.).
                </p>
              </div>
            )}

            {mode === "upload" && (
              <div className="trans-control">
                <label className="trans-label">Upload audio file</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                />
                <p className="trans-hint">
                  File is uploaded securely to AssemblyAI for transcription
                  only.
                </p>
              </div>
            )}

            <button
              type="button"
              className="trans-submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Processing..." : "Transcribe Audio"}
            </button>

            {error && <p className="trans-error">{error}</p>}

            {result && (
              <div className="trans-inline-metrics">
                <div>
                  <span className="metric-label">Duration</span>
                  <span className="metric-value">
                    {formatDuration(result.audioDuration)}
                  </span>
                </div>
                <div>
                  <span className="metric-label">Confidence</span>
                  <span className="metric-value">
                    {formatConfidence(result.confidence)}
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* Right: larger result pane */}
          <section className="trans-pane trans-output-pane">
            <h2 className="trans-results-title">Results</h2>

            {!result && !loading && (
              <p className="trans-placeholder">
                Run a transcription to see your text and sentiment here.
              </p>
            )}

            {loading && !result && (
              <p className="trans-placeholder">
                Transcribing… this may take a few seconds.
              </p>
            )}

            {result && (
              <div className="trans-results-content">
                {/* Transcript */}
                <div className="trans-section">
                  <div className="trans-section-header">
                    <span className="title">Transcript</span>
                  </div>
                  <div className="trans-transcript-box">
                    {result.text || "No transcript text available."}
                  </div>
                </div>

                {/* Sentiment */}
                {result.sentiment && result.sentiment.length > 0 && (
                  <>
                    {domSent && (
                      <div
                        className={`trans-sentiment-banner ${domSent.toLowerCase()}`}
                      >
                        <span className="label">Overall Sentiment</span>
                        <span className="value">{domSent}</span>
                      </div>
                    )}

                    <div className="trans-section">
                      <div className="trans-section-header">
                        <span className="title">Sentiment Highlights</span>
                      </div>
                      <div className="trans-sentiment-list">
                        {result.sentiment.slice(0, 4).map((seg, idx) => (
                          <div
                            key={idx}
                            className={`trans-sentiment-chip ${seg.sentiment.toLowerCase()}`}
                          >
                            <span className="seg-label">{seg.sentiment}</span>
                            <span className="seg-text">{seg.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Transcript;
