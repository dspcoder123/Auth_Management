'use client';

import { useEffect, useMemo, useState } from 'react';
import auth from '../lib/auth';
import { useTranslation } from 'react-i18next';
import { FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';

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

export default function Header({
  user,
  onLogout,
}: {
  user?: any;
  onLogout?: () => void;
}) {
  const { i18n, t } = useTranslation('common');
  const currentLocale = (i18n.language as 'en' | 'hi') || 'en';
  const [headerItem, setHeaderItem] = useState<StrapiHeaderItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [localUser, setLocalUser] = useState<any>(user ?? null);

  const strapiBaseUrl = useMemo(() => process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337', []);

  // Fetch header labels from Strapi
  useEffect(() => {
    let isCancelled = false;
    const fetchHeader = async () => {
      try {
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

  // If no user prop provided, attempt to load profile from token in localStorage
  useEffect(() => {
    let isCancelled = false;
    const loadUserFromToken = async () => {
      // if parent provided a user and it's truthy, use it
      if (user) {
        setLocalUser(user);
        return;
      }

      // prefer cached user object
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
          try {
            if (json.user) auth.setAuth(token, json.user);
          } catch (e) { }
        }
      } catch (e) {
        localStorage.removeItem('authToken');
      }
    };
    loadUserFromToken();
    return () => { isCancelled = true; };
  }, [user]);

  // Listen for auth updates (login/logout) dispatched elsewhere in the app
  useEffect(() => {
    const unsub = auth.subscribeAuth((data) => {
      if (data?.loggedIn === false) setLocalUser(null);
      else if (data?.user) setLocalUser(data.user);
    });
    return unsub;
  }, []);

  // Navigation labels fallback
  const siteTitle = headerItem?.MultiLang || 'Site';
  const homeLabel = headerItem?.Home || 'Home';
  const aboutLabel = headerItem?.About || 'About';
  const servicesLabel = headerItem?.Services || 'Services';
  const portfolioLabel = headerItem?.Portfolio || 'Portfolio';
  const blogLabel = headerItem?.Blog || 'Blog';
  const contactLabel = headerItem?.Contact || 'Contact';

  // Dropdown handlers
  const handleDropdownToggle = () => setDropdownOpen((open) => !open);
  const handleProfileNav = () => {
    setDropdownOpen(false);
    window.location.href = '/profile';
  };

  // Hover behavior for accessibility
  const handleMouseEnter = () => setDropdownOpen(true);
  const handleMouseLeave = () => setDropdownOpen(false);

  // Logout
  const handleLogoutInternal = () => {
    try { auth.clearAuth(); } catch (e) { }
    setDropdownOpen(false);
    setLocalUser(null);
    if (onLogout) {
      try { onLogout(); } catch (e) { }
    } else {
      window.location.href = '/';
    }
  };
  return (
    <header
      style={{
        background: '#fff',
        borderBottom: '1px solid #e6e6e6',
        fontFamily: 'Inter, sans-serif',
        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)'
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          height: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px'
        }}
      >
        {/* Logo and Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="/" className="logo" style={{
            textDecoration: 'none', color: '#222', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 23
          }}>
            <span style={{ fontSize: 28, marginRight: 8 }}>🌍</span>
            <span>{siteTitle}</span>
          </a>
          <nav>
            <ul style={{
              display: 'flex',
              alignItems: 'center',
              listStyle: 'none',
              margin: 0, padding: 0, gap: 24
            }}>
              <li><a href="/" style={{ color: '#1e81f6', fontWeight: 600, fontSize: 16 }}>{homeLabel}</a></li>
              <li><a href="/" style={{ color: '#666', textDecoration: 'none', fontSize: 15 }}>{aboutLabel}</a></li>
              <li><a href="#services" style={{ color: '#666', textDecoration: 'none', fontSize: 15 }}>{servicesLabel}</a></li>
              <li><a href="#portfolio" style={{ color: '#666', textDecoration: 'none', fontSize: 15 }}>{portfolioLabel}</a></li>
              <li><a href="#blog" style={{ color: '#666', textDecoration: 'none', fontSize: 15 }}>{blogLabel}</a></li>
              <li><a href="#contact" style={{ color: '#666', textDecoration: 'none', fontSize: 15 }}>{contactLabel}</a></li>
            </ul>
          </nav>
        </div>
        {/* Language / User Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <select
            aria-label={t ? t('selectLanguage') : 'Select language'}
            value={currentLocale}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            style={{
              padding: '6px 14px',
              borderRadius: 7,
              border: '1px solid #e5e7eb',
              backgroundColor: '#f8fafc',
              color: '#111827',
              fontSize: 14,
              fontWeight: 500,
              outline: 'none',
              minWidth: 100,
              marginRight: 10,
              transition: 'border 0.2s'
            }}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
          {localUser ? (
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <span style={{ color: '#374151', fontWeight: 500, fontSize: 16, marginRight: 5 }}>
                Hello, {localUser?.name ? localUser.name.trim().split(' ')[0] : 'User'}
              </span>
              <div
                className="user-dropdown-trigger"
                style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
                onClick={handleDropdownToggle}
              >
                {localUser?.profilePic ? (
                  <img src={localUser.profilePic} alt="User" style={{
                    width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb'
                  }} />
                ) : (
                  <FiUser style={{
                    width: 32, height: 32, border: '1.5px solid #e5e7eb', borderRadius: '50%', background: '#f3f4f6', color: '#555'
                  }} />
                )}
                <FiChevronDown style={{ marginLeft: 4, color: '#555' }} />
                {(dropdownOpen) && (
                  <div className="user-dropdown-content" style={{
                    position: 'absolute',
                    right: 0, top: '110%',
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    boxShadow: '0px 2px 14px rgba(30,60,80,0.08)',
                    minWidth: 140,
                    zIndex: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                  }}>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: '#222',
                      padding: '12px 18px',
                      fontSize: 15,
                      textAlign: 'left',
                      cursor: 'pointer',
                      width: '100%',
                    }} onClick={handleProfileNav}>
                      My Profile
                    </button>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: '#e11d48',
                      padding: '12px 18px',
                      fontSize: 15,
                      textAlign: 'left',
                      cursor: 'pointer',
                      width: '100%',
                    }} onClick={handleLogoutInternal}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Not logged in: show Login / Register buttons
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <a href="/login" style={{
                padding: '8px 14px', borderRadius: 8, border: '1px solid #1e81f6', color: '#1e81f6', textDecoration: 'none', fontWeight: 600
              }}>Login</a>
              <a href="/register" style={{
                padding: '8px 14px', borderRadius: 8, background: '#1e81f6', color: '#fff', textDecoration: 'none', fontWeight: 600
              }}>Register</a>
            </div>
          )}
        </div>
      </div>
      {error ? <div className="error-text">{error}</div> : null}
    </header>
  );
}
