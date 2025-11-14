// app/layout.tsx
'use client';
import './globals.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import I18nProvider from '../components/I18nProvider';
import PageTracker from '../components/PageTracker';
import Header from '../components/Header/Header';
import Script from 'next/script';
import { Suspense } from 'react';
import { Analytics } from "@vercel/analytics/next"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body>
        
        <GoogleOAuthProvider clientId="55940499103-kcti4g9ainlt5korcheq00heqqnabvt8.apps.googleusercontent.com">
          <I18nProvider>
            <Header/>
            {children}
            <Analytics />
            <Suspense fallback = {null}>
            <PageTracker />
            </Suspense>
            
          </I18nProvider>
          <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
