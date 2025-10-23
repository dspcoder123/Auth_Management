'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

// Prevent Next.js from pre-rendering this page
export const dynamic = 'force-dynamic';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams ? searchParams.get('token') : null;
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    async function verify() {
      if (!token) return;
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify-email?token=${token}`);
        toast(res.data.toastMessage || 'Email verified', { type: 'success' });
        setVerified(true);
      } catch (err: any) {
        toast(err.response?.data?.toastMessage || 'Verification failed', { type: 'error' });
      }
    }
    verify();
  }, [token]);

  return (
    <div style={{ maxWidth: 350, margin: '2rem auto' }}>
      <h2>Email Verification</h2>
      {verified
        ? <div>Email verified! <a href="/">Go to Login</a></div>
        : <div>Verifying...</div>
      }
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div style={{ maxWidth: 350, margin: '2rem auto' }}>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
