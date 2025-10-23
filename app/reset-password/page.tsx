'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../styles/ResetPassword.css'
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function validatePassword(pw: string) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pw);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validatePassword(password)) {
      toast.error('Password is too weak');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/reset-password`, { token, password });
      toast.success(res.data.toastMessage || 'Password reset successful');

      // Clear fields
      setToken('');
      setPassword('');

      // Redirect after toast
      setTimeout(() => {
        router.push('/'); // redirect to login page
      }, 1000);
    } catch (err: any) {
      toast.error(err.response?.data?.toastMessage || 'Failed to reset password');

      // Redirect to forgot-password page after failure
      setTimeout(() => {
        router.push('/forgot-password');
      }, 1000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit} className="reset-password-form">
          <input
            type="text"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Reset token"
            required
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="New password"
            required
          />
          <span className="password-hint">
            Must have 8+ chars, upper/lowercase, number, special char.
          </span>
          <button type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
