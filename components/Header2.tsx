'use client';

import React, { useState, useEffect, useMemo } from "react";
import auth from '../lib/auth';
import { useTranslation } from 'react-i18next';
import { FiUser, FiChevronDown } from "react-icons/fi";

// Type for your CMS header nav items in Strapi
type StrapiHeaderItem = {
  id: number;
  documentId: string;
  MultiLang?: string;
  Home?: string;
  About?: string;
  Services?: string;
  Portfolio?: string;
  Blog?: string;
  Contact?: string;
  locale?: string;
};

type StrapiResponse<T> = { data: T[] };

const Header: React.FC = () => {
  // Theme state and effect
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    document.body.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Scroll effect for header background
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile menu toggle
  const [mobileOpen, setMobileOpen] = useState(false);

  // Internationalization
  const { i18n, t } = useTranslation('common');
  const currentLocale = (i18n.language as 'en' | 'hi') || 'en';

  // Fetch header nav items from CMS (Strapi)
  const [headerItem, setHeaderItem] = useState<StrapiHeaderItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const strapiBaseUrl = useMemo(() => process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337', []);
  useEffect(() => {
    let isCancelled = false;
    const fetchHeader = async () => {
      try {
        // const url = `${strapiBaseUrl}/api/headers?locale=${currentLocale}&pagination[pageSize]=1`;
        const url = `${strapiBaseUrl}/api/headers?locale=${currentLocale}&pagination[pageSize]=1`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load header (${res.status})`);
        const json: StrapiResponse<StrapiHeaderItem> = await res.json();
        if (!isCancelled) setHeaderItem(json.data?.[0] || null);
      } catch (e: unknown) {
        if (!isCancelled) setError(e instanceof Error ? e.message : 'Unknown error');
      }
    };
    fetchHeader();
    return () => { isCancelled = true; };
  }, [currentLocale, strapiBaseUrl]);

  // Auth state management
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [localUser, setLocalUser] = useState<any>(null);
  useEffect(() => {
    let isCancelled = false;
    const loadUserFromToken = async () => {
      const cachedUser = auth.getUser();
      if (cachedUser) {
        setLocalUser(cachedUser);
        return;
      }
      const token = auth.getToken();
      if (!token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          localStorage.removeItem('authToken');
          return;
        }
        const json = await res.json();
        if (!isCancelled) {
          setLocalUser(json.user || null);
          try { if (json.user) auth.setAuth(token, json.user); } catch (e) { }
        }
      } catch (e) { localStorage.removeItem('authToken'); }
    };
    loadUserFromToken();
    return () => { isCancelled = true; };
  }, []);

  useEffect(() => {
    const unsub = auth.subscribeAuth((data: any) => {
      if (data?.loggedIn === false) setLocalUser(null);
      else if (data?.user) setLocalUser(data.user);
    });
    return unsub;
  }, []);

  // User dropdown handlers
  const handleDropdownToggle = () => setDropdownOpen((open) => !open);
  const handleProfileNav = () => {
    setDropdownOpen(false);
    window.location.href = '/profile';
  };
  const handleMouseEnter = () => setDropdownOpen(true);
  const handleMouseLeave = () => setDropdownOpen(false);

  // Logout
  const handleLogoutInternal = () => {
    try { auth.clearAuth(); } catch (e) { }
    setDropdownOpen(false);
    setLocalUser(null);
    window.location.href = '/';
  };

  // Theme toggle
  const handleToggle = () => setIsDark((d) => !d);

  // Fallback nav labels if CMS not ready
  const siteTitle = headerItem?.MultiLang || 'Site';
  const homeLabel = headerItem?.Home || 'Home';
  const aboutLabel = headerItem?.About || 'About';
  const servicesLabel = headerItem?.Services || 'Services';
  const portfolioLabel = headerItem?.Portfolio || 'Portfolio';
  const blogLabel = headerItem?.Blog || 'Blog';
  const contactLabel = headerItem?.Contact || 'Contact';

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
          <span style={{
            color: "#3e7dff",
            fontWeight: 900,
            fontSize: "2.2rem"
          }}>
            e
          </span>
          <span><a href="/">{siteTitle}</a></span>
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
            {homeLabel}
          </a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            {aboutLabel}
          </a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            {servicesLabel}
          </a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            {portfolioLabel}
          </a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            {blogLabel}
          </a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
            {contactLabel}
          </a>
        </nav>
        {/* Actions: Language, Theme, Auth */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.1rem" }}>
          {/* Language dropdown */}
          <select
            aria-label={t ? t('selectLanguage') : 'Select language'}
            value={currentLocale}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            style={{
              padding: '7px 16px', borderRadius: 9, border: '1px solid #dbeafe',
              backgroundColor: isDark ? '#10153a' : '#f3f6ff',
              color: isDark ? '#fff' : '#070a2b', fontWeight: 500, minWidth: 98
            }}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
          {/* Theme toggle */}
          <button
            aria-label="Toggle theme"
            onClick={handleToggle}
            style={{
              border: "none", background: "none", padding: 0, cursor: "pointer", outline: "none",
              position: "relative", width: 68, height: 36, borderRadius: "18px",
              backgroundColor: isDark ? "#222c57" : "#e5eafc",
              boxShadow: "0 2px 12px rgba(50,90,220,0.10)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              transition: "background 0.25s"
            }}
          >
            <span style={{
              marginLeft: 10, fontSize: "1.15rem", opacity: isDark ? 0.4 : 1, transition: "opacity 0.2s"
            }}>☀️</span>
            <span style={{
              marginRight: 13, fontSize: "1.15rem", opacity: isDark ? 1 : 0.4, transition: "opacity 0.2s"
            }}>🌙</span>
            <span style={{
              position: "absolute", left: isDark ? 36 : 4, top: 4, width: 28, height: 28, borderRadius: "50%",
              background: isDark ? "#3e7dff" : "#ffe66d", boxShadow: "0 2px 8px rgba(62,125,255,0.16)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.18rem",
              color: isDark ? "#fff" : "#f89e0e", zIndex: 1, transition: "left 0.25s, background 0.25s"
            }}>{isDark ? "🌙" : "☀️"}</span>
          </button>
          {/* Auth: User dropdown or Login/Register */}
          {localUser ? (
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <span style={{
                color: isDark ? "#e0e7ef" : "#374151", fontWeight: 500, fontSize: 16, marginRight: 5
              }}>
                Hello, {localUser?.name ? localUser.name.trim().split(' ')[0] : 'User'}
              </span>
              <div
                style={{
                  display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none'
                }}
                onClick={handleDropdownToggle}
              >
                {localUser?.profilePic ? (
                  <img src={localUser.profilePic} alt="User" style={{
                    width: 34, height: 34, borderRadius: '50%', objectFit: 'cover',
                    border: '2px solid #e5e7eb'
                  }} />
                ) : (<FiUser style={{
                  width: 32, height: 32, border: '1.5px solid #e5e7eb', borderRadius: '50%',
                  background: isDark ? '#262C47' : '#f3f4f6', color: '#555'
                }} />)}
                <FiChevronDown style={{ marginLeft: 4, color: '#888' }} />
                {dropdownOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: '110%', background: isDark ? '#222c48' : '#fff',
                    border: '1px solid #e5e7eb', borderRadius: 8,
                    boxShadow: '0px 2px 14px rgba(30,60,80,0.08)',
                    minWidth: 144, zIndex: 20, display: 'flex',
                    flexDirection: 'column', overflow: 'hidden'
                  }}>
                    <button style={{
                      background: 'none', border: 'none', color: isDark ? "#ccc" : '#222',
                      padding: '12px 18px', fontSize: 15, textAlign: 'left', cursor: 'pointer', width: '100%',
                    }} onClick={handleProfileNav}>
                      My Profile
                    </button>
                    <button style={{
                      background: 'none', border: 'none', color: '#e11d48',
                      padding: '12px 18px', fontSize: 15, textAlign: 'left', cursor: 'pointer', width: '100%',
                    }} onClick={handleLogoutInternal}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) :
            (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <a href="/login" style={{
                  padding: '8px 18px', borderRadius: 8, border: '1px solid #3e7dff',
                  color: "#3e7dff", textDecoration: 'none', fontWeight: 600, background: 'none'
                }}>Login</a>
                <a href="/register" style={{
                  padding: '8px 18px', borderRadius: 8, background: "#3e7dff", color: "#fff",
                  textDecoration: 'none', fontWeight: 600
                }}>Register</a>
              </div>
            )}
          {localUser && (
            <button
              style={{
                marginLeft: '7px',
                padding: '8px 20px',
                borderRadius: 8,
                background: "#3e7dff",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                fontSize: "1.13rem",
                cursor: "pointer"
              }}
              onClick={() => window.location.href = '/myai'}
              aria-label="Open MyAI"
            >
              MyAI
            </button>
          )}

          {/* Mobile Nav Toggle */}
          <button
            style={{
              background: "transparent",
              color: isDark ? "#fff" : "#070a2b",
              border: "none",
              cursor: "pointer",
              padding: "3px 8px",
              display: "none",
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
            zIndex: 90
          }}
        >
          <a href="#" style={navMobileLinkStyle}>{homeLabel}</a>
          <a href="#" style={navMobileLinkStyle}>{aboutLabel}</a>
          <a href="#" style={navMobileLinkStyle}>{servicesLabel}</a>
          <a href="#" style={navMobileLinkStyle}>{portfolioLabel}</a>
          <a href="#" style={navMobileLinkStyle}>{blogLabel}</a>
          <a href="#" style={navMobileLinkStyle}>{contactLabel}</a>
          {/* Language and theme toggles for mobile nav */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14, marginLeft: 18 }}>
            <select
              aria-label={t ? t('selectLanguage') : 'Select language'}
              value={currentLocale}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              style={{
                padding: '7px 16px', borderRadius: 9, border: '1px solid #dbeafe',
                backgroundColor: isDark ? '#10153a' : '#f3f6ff',
                color: isDark ? '#fff' : '#070a2b', fontWeight: 500, minWidth: 98
              }}
            >
              <option value="en">English</option>
              <option value="hi">[translate:हिन्दी]</option>
            </select>
            <button
              aria-label="Toggle theme"
              onClick={handleToggle}
              style={{
                border: "none", background: "none", padding: 0, cursor: "pointer", outline: "none",
                position: "relative", width: 56, height: 30, borderRadius: "14px",
                backgroundColor: isDark ? "#222c57" : "#e5eafc",
                boxShadow: "0 2px 12px rgba(50,90,220,0.10)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                transition: "background 0.25s"
              }}
            >
              <span style={{
                marginLeft: 8, fontSize: "1.07rem", opacity: isDark ? 0.4 : 1, transition: "opacity 0.2s"
              }}>☀️</span>
              <span style={{
                marginRight: 10, fontSize: "1.07rem", opacity: isDark ? 1 : 0.4, transition: "opacity 0.2s"
              }}>🌙</span>
              <span style={{
                position: "absolute", left: isDark ? 26 : 4, top: 4, width: 21, height: 21, borderRadius: "50%",
                background: isDark ? "#3e7dff" : "#ffe66d", boxShadow: "0 2px 8px rgba(62,125,255,0.16)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
                color: isDark ? "#fff" : "#f89e0e", zIndex: 1, transition: "left 0.25s, background 0.25s"
              }}>{isDark ? "🌙" : "☀️"}</span>
            </button>
          </div>
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
      {error ? <div className="error-text">{error}</div> : null}
    </header>
  );
};

const navMobileLinkStyle = {
  color: "inherit",
  textDecoration: "none",
  fontSize: "1.09rem",
  padding: "0.85rem 2rem"
};

export default Header;
