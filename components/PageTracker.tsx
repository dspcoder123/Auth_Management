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
    // Add language as query parameter to the path
    const pathWithLanguage = path.includes('?') 
      ? `${path}&lang=${language}`
      : `${path}?lang=${language}`;
    
    const trackingData = {
      path: pathWithLanguage,
      language: language,
      timestamp: new Date().toISOString()
    };
    
    // Track page view with language in path
    fetch(`https://backend-gydk.onrender.com/api/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trackingData),
      credentials: 'omit'
    }).catch(() => {}); // Silent fail
  };

  useEffect(() => {
    const path = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    const language = i18n.language || 'en';
    
    trackPageView(path, language);
  }, [pathname, searchParams, i18n.language]);

  // Listen for language change events
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      const path = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      const language = event.detail.language;
      
      // Track language change with current path
      trackPageView(path, language);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, [pathname, searchParams]);

  return null; // This component renders nothing
}
