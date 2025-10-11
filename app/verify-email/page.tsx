'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

export const dynamic = 'force-dynamic'; // <-- Add this

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    async function verify() {
      if (!token) return;
      try {
        const res = await axios.get(`http://localhost:4000/api/auth/verify-email?token=${token}`);
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
