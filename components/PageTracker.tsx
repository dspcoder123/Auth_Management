'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

// Page tracking component
export default function PageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { i18n } = useTranslation();

  const trackPageView = (path: string, language: string) => {
    const pathWithLanguage = path.includes('?')
      ? `${path}&lang=${language}`
      : `${path}?lang=${language}`;

    const trackingData = {
      path: pathWithLanguage,
      language,
      timestamp: new Date().toISOString(),
    };

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trackingData),
      credentials: 'omit',
    }).catch(() => {}); // Silent fail
  };

  useEffect(() => {
    const paramsString = searchParams?.toString() ?? '';
    const path = pathname + (paramsString ? `?${paramsString}` : '');
    const language = i18n.language || 'en';

    trackPageView(path, language);
  }, [pathname, searchParams, i18n.language]);

  useEffect(() => {
    if (typeof window === 'undefined') return; // guard for server side
  
    const handleLanguageChange = (event: CustomEvent) => {
      const paramsString = searchParams?.toString() ?? '';
      const path = pathname + (paramsString ? `?${paramsString}` : '');
      const language = event.detail.language;
  
      trackPageView(path, language);
    };
  
    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, [pathname, searchParams]);
  
  return null; // Component renders nothing
}
