import React, { useState } from "react";
import "./Tools.css";
import ExplicitChecker from "../ExplicitChecker/Explicit";
import GdprChecker from "../GdprChecker/Gdpr";
import DeepFakeChecker from "../DeepFakeChecker/DeepFake";
import ImageSearch from "../ImageSearch/ImageSearch";




type ToolId = "sightengine" | "gdpr" | "copyleaks" | "reverse-image" | "deepfake";

const tools = [
  {
    id: "sightengine" as const,
    title: "Explicit Content Check",
    subtitle: "Sightengine",
    description:
      "Detect deepfakes, nudity, and explicit content in images and videos.",
    imageAlt: "Deepfake and explicit content detection illustration",
  },
  {
    id: "gdpr" as const,
    title: "GDPR Compliance",
    subtitle: "GDPR Validator",
    description: "Validate your app or website for GDPR compliance issues.",
    imageAlt: "GDPR compliance illustration",
  },
  {
    id: "copyleaks" as const,
    title: "Plagiarism Detection",
    subtitle: "Copyleaks",
    description: "Check text content for plagiarism across the web.",
    imageAlt: "Plagiarism detection illustration",
  },
  {
    id: "reverse-image" as const,
    title: "IP Violation Check",
    subtitle: "RapidAPI Reverse Image",
    description: "Search for similar images to find potential IP violations.",
    imageAlt: "Reverse image search illustration",
  },
  {
    id: "deepfake" as const,
    title: "Deepfake Check",
    subtitle: "Deepfake Check",
    description: "Check for deepfakes in images and videos.",
    imageAlt: "Deepfake check illustration",
  },
];

const ToolsPage: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);

  // When a tool is open, render its UI full-screen inside this page
  if (activeTool === "sightengine") {
    return <ExplicitChecker onBack={() => setActiveTool(null)} />;
  }

  if (activeTool === "gdpr") {
    return <GdprChecker onBack={() => setActiveTool(null)} />;
  }

  if (activeTool === "deepfake") {
    return <DeepFakeChecker onBack={() => setActiveTool(null)} />;
  }
  if (activeTool === "reverse-image") {
    return <ImageSearch onBack={() => setActiveTool(null)} />;
  }
  // Later you can add other tools:
  // if (activeTool === "gdpr") return <GdprTool onBack={() => setActiveTool(null)} />;

  return (
    <div className="tools-page">
      <h1 className="tools-title">Content Safety Tools</h1>
      <p className="tools-subtitle">
        Run checks for deepfakes, explicit content, GDPR compliance, plagiarism,
        and IP violations.
      </p>

      <div className="tools-grid">
        {tools.map((tool) => (
          <div key={tool.id} className="tool-card">
            <div className="tool-image">
              <span className="tool-image-placeholder">
                {tool.subtitle[0]}
              </span>
            </div>

            <div className="tool-body">
              <h2 className="tool-title">{tool.title}</h2>
              <p className="tool-vendor">{tool.subtitle}</p>
              <p className="tool-description">{tool.description}</p>
            </div>

            <div className="tool-footer">
              <button
                className="tool-button"
                type="button"
                onClick={() => setActiveTool(tool.id)}
              >
                Open Tool
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolsPage;
