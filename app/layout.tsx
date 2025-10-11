// app/layout.tsx
'use client';
import './globals.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId="55940499103-kcti4g9ainlt5korcheq00heqqnabvt8.apps.googleusercontent.com">
          {children}
          <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
