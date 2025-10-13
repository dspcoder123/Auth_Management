// app/layout.tsx
'use client';
import './globals.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Add these imports:
import I18nProvider from '../components/I18nProvider';
import PageTracker from '../components/PageTracker';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId="55940499103-kcti4g9ainlt5korcheq00heqqnabvt8.apps.googleusercontent.com">
          {/* Add I18nProvider and PageTracker for global language/context support */}
          <I18nProvider>
            {children}
            <PageTracker />
          </I18nProvider>
          <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
