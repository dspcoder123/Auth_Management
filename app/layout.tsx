// app/layout.tsx
'use client';
import './globals.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import I18nProvider from '../components/I18nProvider';
import PageTracker from '../components/PageTracker';
import Header from '../components/Header';
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-70QEE0P49H"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-70QEE0P49H');
            `,
          }}
        />
      </head>
      <body>
        <GoogleOAuthProvider clientId="55940499103-kcti4g9ainlt5korcheq00heqqnabvt8.apps.googleusercontent.com">
          <I18nProvider>
            <Header />
            {children}
            <PageTracker />
          </I18nProvider>
          <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
