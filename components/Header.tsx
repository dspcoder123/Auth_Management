'use client';

import { useEffect, useMemo, useState } from 'react';
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
  user: any;
  onLogout: () => void;
}) {
  const { i18n, t } = useTranslation('common');
  const currentLocale = (i18n.language as 'en' | 'hi') || 'en';
  const [headerItem, setHeaderItem] = useState<StrapiHeaderItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  // Click outside to close dropdown (accessibility)
  useEffect(() => {
    if (!dropdownOpen) return;
    const closeDropdown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-dropdown-trigger') && !target.closest('.user-dropdown-content')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', closeDropdown);
    return () => document.removeEventListener('mousedown', closeDropdown);
  }, [dropdownOpen]);

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
          <a href="/home" className="logo" style={{
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
              <li><a href="/home" style={{ color: '#1e81f6', fontWeight: 600, fontSize: 16 }}>{homeLabel}</a></li>
              <li><a href="/about" style={{ color: '#666', textDecoration: 'none', fontSize: 15 }}>{aboutLabel}</a></li>
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
          <span style={{ color: '#374151', fontWeight: 500, fontSize: 16, marginRight: 5 }}>
            {/* Hello, {user?.name} */}
            Hello, {user?.name ? user.name.trim().split(' ')[0] : 'User'}

          </span>
          <div
            className="user-dropdown-trigger"
            style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
            onClick={handleDropdownToggle}
          >
            {user?.profilePic ? (
              <img src={user.profilePic} alt="User" style={{
                width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb'
              }} />
            ) : (
              <FiUser style={{
                width: 32, height: 32, border: '1.5px solid #e5e7eb', borderRadius: '50%', background: '#f3f4f6', color: '#555'
              }} />
            )}
            <FiChevronDown style={{ marginLeft: 4, color: '#555' }} />
            {dropdownOpen &&
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
                }} onClick={onLogout}>
                  Logout
                </button>
              </div>
            }
          </div>
        </div>
      </div>
      {error ? <div className="error-text">{error}</div> : null}
    </header>
  );
}
