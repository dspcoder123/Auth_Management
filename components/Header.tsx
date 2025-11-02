import React, { useState, useEffect } from "react";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  // Default to dark theme
  const [isDark, setIsDark] = useState(true);
  // Mobile menu state
  const [mobileOpen, setMobileOpen] = useState(false);
  // Scrolled state for transparent background
  const [scrolled, setScrolled] = useState(false);

  // Track scroll to apply transparent/blur header
  useEffect(() => {
    document.body.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle theme switch
  const handleToggle = () => setIsDark((t) => !t);

  return (
    <header
      style={{
        position: "fixed",
        padding: "3px 0",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 100,
        background: scrolled
          ? isDark
            ? "rgba(19, 27, 77, 0.8)"
            : "rgba(255,255,255,0.7)"
          : isDark
          ? "#070a2b"
          : "#fff",
        color: isDark ? "#fff" : "#070a2b",
        boxShadow: scrolled
          ? "0 4px 20px rgba(30,30,55,0.12)"
          : "0 2px 16px rgba(0, 0, 0, 0.07)",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        transition:
          "background 0.3s, color 0.3s, box-shadow 0.3s, backdrop-filter 0.3s",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2rem",
          height: "64px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontWeight: 800,
            fontSize: "2rem",
            letterSpacing: "1px",
            gap: "10px",
          }}
        >
          <span
            style={{
              color: "#3e7dff",
              fontWeight: 900,
              fontSize: "2.2rem",
            }}
          >
            e
          </span>
          <span><a href="/">Crypto</a></span>
        </div>
        {/* Desktop Nav */}
        <nav
          style={{
            display: mobileOpen ? "none" : "flex",
            gap: "2.2rem",
            fontWeight: 600,
            fontSize: "1.06rem",
          }}
        >
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            Home
          </a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            Features
          </a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            Roadmap
          </a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            Pages
          </a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            Support
          </a>
        </nav>
        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.1rem" }}>
          {/* Search Icon with circular background */}
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: isDark ? "#10153a" : "#e1e5facd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: isDark
                ? "0px 2px 10px rgba(60,80,150,0.10)"
                : "0px 1px 5px #dbe5ff30",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <circle
                cx="8"
                cy="8"
                r="7"
                stroke={isDark ? "#fff" : "#070a2b"}
                strokeWidth="2"
                fill="none"
              />
              <line
                x1="13"
                y1="13"
                x2="17"
                y2="17"
                stroke={isDark ? "#fff" : "#070a2b"}
                strokeWidth="2"
              />
            </svg>
          </div>
          {/* Theme Toggle Switch (pill) */}
          <button
            aria-label="Toggle theme"
            onClick={handleToggle}
            style={{
              border: "none",
              background: "none",
              padding: 0,
              cursor: "pointer",
              outline: "none",
              position: "relative",
              width: 68,
              height: 36,
              borderRadius: "18px",
              backgroundColor: isDark ? "#222c57" : "#e5eafc",
              boxShadow: "0 2px 12px rgba(50,90,220,0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "background 0.25s",
            }}
          >
            {/* Sun pill icon (left) */}
            <span
              style={{
                marginLeft: 10,
                fontSize: "1.15rem",
                opacity: isDark ? 0.4 : 1,
                transition: "opacity 0.2s",
              }}
            >
              ☀️
            </span>
            {/* Moon pill icon (right) */}
            <span
              style={{
                marginRight: 13,
                fontSize: "1.15rem",
                opacity: isDark ? 1 : 0.4,
                transition: "opacity 0.2s",
              }}
            >
              🌙
            </span>
            {/* Thumb only shows relevant icon */}
            <span
              style={{
                position: "absolute",
                left: isDark ? 36 : 4,
                top: 4,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: isDark ? "#3e7dff" : "#ffe66d",
                boxShadow: "0 2px 8px rgba(62,125,255,0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.18rem",
                color: isDark ? "#fff" : "#f89e0e",
                zIndex: 1,
                transition: "left 0.25s, background 0.25s",
              }}
            >
              {isDark ? "🌙" : "☀️"}
            </span>
          </button>
          {/* Sign In Button */}
          <button
            style={{
              background: "#3e7dff",
              color: "#fff",
              fontWeight: 700,
              borderRadius: "24px",
              border: "none",
              padding: "8px 24px",
              cursor: "pointer",
              fontSize: "1.05rem",
              boxShadow: "0px 2px 12px rgba(50,90,220,0.10)",
              transition: "background 0.20s",
              marginLeft: "auto",
            }}
          >
            <a href="/login">Sign In</a>
          </button>
          {/* Mobile Nav Toggle */}
          <button
            style={{
              background: "transparent",
              color: isDark ? "#fff" : "#070a2b",
              border: "none",
              cursor: "pointer",
              padding: "3px 8px",
              display: "none", // Shown only on mobile via media query
              fontSize: "1.4rem",
            }}
            aria-label="Open menu"
            onClick={() => setMobileOpen((open) => !open)}
            id="mobile-menu-toggle"
          >
            ☰
          </button>
        </div>
      </div>
      {/* Mobile Nav */}
      {mobileOpen && (
        <div
          style={{
            background: isDark ? "#070a2b" : "#fff",
            color: isDark ? "#fff" : "#070a2b",
            transition: "all 0.3s",
            boxShadow: "0 2px 24px rgba(15,20,40,0.11)",
            position: "absolute",
            left: 0,
            top: 64,
            width: "100vw",
            padding: "2rem 0",
            display: "flex",
            flexDirection: "column",
            gap: "1.75rem",
          }}
        >
          <a
            href="#"
            style={{
              color: "inherit",
              textDecoration: "none",
              fontSize: "1.09rem",
              padding: "0.85rem 2rem",
            }}
          >
            Home
          </a>
          <a
            href="#"
            style={{
              color: "inherit",
              textDecoration: "none",
              fontSize: "1.09rem",
              padding: "0.85rem 2rem",
            }}
          >
            Features
          </a>
          <a
            href="#"
            style={{
              color: "inherit",
              textDecoration: "none",
              fontSize: "1.09rem",
              padding: "0.85rem 2rem",
            }}
          >
            Roadmap
          </a>
          <a
            href="#"
            style={{
              color: "inherit",
              textDecoration: "none",
              fontSize: "1.09rem",
              padding: "0.85rem 2rem",
            }}
          >
            Pages
          </a>
          <a
            href="#"
            style={{
              color: "inherit",
              textDecoration: "none",
              fontSize: "1.09rem",
              padding: "0.85rem 2rem",
            }}
          >
            Support
          </a>
        </div>
      )}
      {/* Responsive styles */}
      <style>
        {`
          @media (max-width: 900px) {
            nav { display: none !important; }
            #mobile-menu-toggle { display: inline-block !important; }
          }
          @media (min-width: 901px) {
            #mobile-menu-toggle { display: none !important; }
          }
        `}
      </style>
    </header>
  );
};

export default Header;
