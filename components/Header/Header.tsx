'use client';

import React, { useState, useEffect, useMemo } from "react";
import auth from '../../lib/auth';
import { useTranslation } from 'react-i18next';
import { FiUser, FiChevronDown } from "react-icons/fi";
import './Header.css';
import { useRouter } from 'next/navigation';


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
  const router = useRouter();

  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    document.body.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;  // Prevent running on server
  
    const handleScroll = () => setScrolled(window.scrollY > 10);
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  

  const [mobileOpen, setMobileOpen] = useState(false);
  const { i18n, t } = useTranslation('common');
  const currentLocale = (i18n.language as 'en' | 'hi') || 'en';

  const [headerItem, setHeaderItem] = useState<StrapiHeaderItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const strapiBaseUrl = useMemo(() => process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337', []);

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
          try { if (json.user) auth.setAuth(token, json.user); } catch (e) {}
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

  const handleDropdownToggle = () => setDropdownOpen((open) => !open);
  const handleProfileNav = () => { setDropdownOpen(false); router.push('/profile');
  };
  const handleMouseEnter = () => setDropdownOpen(true);
  const handleMouseLeave = () => setDropdownOpen(false);
  const handleLogoutInternal = () => {
    try { auth.clearAuth(); } catch (e) { }
    setDropdownOpen(false);
    setLocalUser(null);
    router.push('/');

  };
  const handleToggle = () => setIsDark((d) => !d);

  // Labels
  const siteTitle = headerItem?.MultiLang || 'Site';
  const homeLabel = headerItem?.Home || 'Home';
  const aboutLabel = headerItem?.About || 'About';
  const servicesLabel = headerItem?.Services || 'Services';
  const portfolioLabel = headerItem?.Portfolio || 'Portfolio';
  const blogLabel = headerItem?.Blog || 'Blog';
  const contactLabel = headerItem?.Contact || 'Contact';

  return (
    <header className={`mainHeader${isDark ? ' headerDark' : ' headerLight'}${scrolled ? ' headerScrolled' : ''}`}>
      <div className="headerInner">
        {/* Logo */}
        <div className="headerLogo">
          <span className="logoLetter">e</span>
          <span><a href="/" className="siteTitle">{siteTitle}</a></span>
        </div>
        {/* Nav + Actions */}
        <div className="headerSpread">
          <nav className="headerNav">
            <a href="#" className="headerNavLink">{homeLabel}</a>
            <a href="#" className="headerNavLink">{aboutLabel}</a>
            <a href="#" className="headerNavLink">{servicesLabel}</a>
            <a href="#" className="headerNavLink">{portfolioLabel}</a>
            <a href="/news" className="headerNavLink">{blogLabel}</a>
            <a href="#" className="headerNavLink">{contactLabel}</a>
          </nav>
          <div className="headerActions">
            <select
              aria-label={t ? t('selectLanguage') : 'Select language'}
              value={currentLocale}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="headerLangSelect"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
            <button aria-label="Toggle theme" onClick={handleToggle} className="headerThemeToggle">
              <span className="themeSun">☀️</span>
              <span className="themeMoon">🌙</span>
              <span className={`themeCircle${isDark ? ' dark' : ' light'}`}>{isDark ? "🌙" : "☀️"}</span>
            </button>
            {localUser ? (
              <div className="userDropdownWrapper" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <span className="userHello">Hello, {localUser?.name ? localUser.name.trim().split(' ')[0] : 'User'}</span>
                <div className="userDropdownTrigger" onClick={handleDropdownToggle}>
                  {localUser?.profilePic ? (
                    <img src={localUser.profilePic} alt="User" className="userProfilePic" />
                  ) : (<FiUser className="userProfileIcon" />)}
                  <FiChevronDown style={{ marginLeft: 4, color: '#888' }} />
                  {dropdownOpen && (
                    <div className="userDropdownMenu">
                      <button className="userDropdownItem" onClick={handleProfileNav}>My Profile</button>
                      <button className="userDropdownItem userLogout" onClick={handleLogoutInternal}>Logout</button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="authLinks">
                <a href="/login" className="loginLink">Login</a>
                <a href="/register" className="registerLink">Register</a>
              </div>
            )}
            {localUser && (
              <>
                <button
                  className="myAIButton"
                  onClick={() => router.push('/myai')}
                  aria-label="Open MyAI"
                >
                  MyAI
                </button>
                <button
                  className="myAIButton"
                  onClick={() => router.push('/conversion')}
                  aria-label="Open Conversion"
                >
                  Conversion
                </button>
              </>
            )}
          </div>
        </div>
        <button className="mobileMenuToggle" aria-label="Open menu" onClick={() => setMobileOpen((open) => !open)} id="mobile-menu-toggle">☰</button>
      </div>
      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="mobileNav">
          <a href="#" className="mobileNavLink">{homeLabel}</a>
          <a href="#" className="mobileNavLink">{aboutLabel}</a>
          <a href="#" className="mobileNavLink">{servicesLabel}</a>
          <a href="#" className="mobileNavLink">{portfolioLabel}</a>
          <a href="#" className="mobileNavLink">{blogLabel}</a>
          <a href="#" className="mobileNavLink">{contactLabel}</a>
          <div className="mobileLangTheme">
            <select aria-label={t ? t('selectLanguage') : 'Select language'} value={currentLocale} onChange={(e) => i18n.changeLanguage(e.target.value)} className="headerLangSelect">
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
            <button aria-label="Toggle theme" onClick={handleToggle} className="headerThemeToggle">
              <span className="themeSun">☀️</span>
              <span className="themeMoon">🌙</span>
              <span className={`themeCircle${isDark ? ' dark' : ' light'}`}>{isDark ? "🌙" : "☀️"}</span>
            </button>
          </div>
        </div>
      )}
      {error && <div className="headerError">{error}</div>}
    </header>
  );
};

export default Header;
