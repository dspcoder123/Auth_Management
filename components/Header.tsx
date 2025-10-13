'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiLogOut, FiUser } from 'react-icons/fi';

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

type StrapiResponse<T> = { data: T[]; };

export default function Header({
  user,
  onProfile,
  onLogout,
  activeTab,
  setActiveTab,
}: {
  user: any;
  onProfile: () => void;
  onLogout: () => void;
  activeTab: 'home' | 'profile';
  setActiveTab: (tab: 'home' | 'profile') => void;
}) {
  const { i18n, t } = useTranslation('common');
  const currentLocale = (i18n.language as 'en' | 'hi') || 'en';
  const [headerItem, setHeaderItem] = useState<StrapiHeaderItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strapiBaseUrl = useMemo(() => {
    return process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const fetchHeader = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = `${strapiBaseUrl}/api/headers?locale=${currentLocale}&pagination[pageSize]=1`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load header (${res.status})`);
        const json: StrapiResponse<StrapiHeaderItem> = await res.json();
        if (!isCancelled) setHeaderItem(json.data?.[0] || null);
      } catch (e: unknown) {
        if (!isCancelled) setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };
    fetchHeader();
    return () => { isCancelled = true; };
  }, [currentLocale, strapiBaseUrl]);

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
        background: '#fff',
        borderBottom: '1px solid #e6e6e6',
        padding: 0,
        fontFamily: 'Inter, sans-serif',
        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
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
          padding: '0 32px',
        }}
      >
        {/* Logo and Nav */}
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
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: activeTab === 'home' ? '#1e81f6' : '#222',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    borderBottom: activeTab === 'home' ? '2.5px solid #1e81f6' : '2.5px solid transparent',
                    padding: '6px 0',
                    outline: 'none',
                  }}
                >{homeLabel}</button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('profile')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: activeTab === 'profile' ? '#1e81f6' : '#222',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    borderBottom: activeTab === 'profile' ? '2.5px solid #1e81f6' : '2.5px solid transparent',
                    padding: '6px 0',
                    outline: 'none',
                  }}
                >My Profile</button>
              </li>
              <li><a href="#about" style={{ color: '#666', textDecoration: 'none', fontSize: 15 }}>{aboutLabel}</a></li>
              <li><a href="#services" style={{ color: '#666', textDecoration: 'none', fontSize: 15 }}>{servicesLabel}</a></li>
              <li><a href="#portfolio" style={{ color: '#666', textDecoration: 'none', fontSize: 15 }}>{portfolioLabel}</a></li>
              <li><a href="#blog" style={{ color: '#666', textDecoration: 'none', fontSize: 15 }}>{blogLabel}</a></li>
              <li><a href="#contact" style={{ color: '#666', textDecoration: 'none', fontSize: 15 }}>{contactLabel}</a></li>
            </ul>
          </nav>
        </div>
        {/* Language/Hello/Logout/User */}
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
            Hello, {user?.name?.split(' ')[0]}
          </span>
          {user?.profilePic ? (
            <img src={user.profilePic} alt="User" style={{
              width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb'
            }}/>
          ) : (
            <FiUser style={{
              width: 34, height: 34, padding: 5, border: '1.5px solid #e5e7eb', borderRadius: '50%', background: '#f3f4f6', color: '#555'
            }} />
          )}
          <button
            onClick={onLogout}
            title="Logout"
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              color: '#e11d48',
              fontSize: 18,
              marginLeft: 7,
              borderRadius: 7,
              padding: '5px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FiLogOut style={{ marginRight: 3 }} />
            Logout
          </button>
        </div>
      </div>
      {error ? <div className="error-text">{error}</div> : null}
    </header>
  );
}
