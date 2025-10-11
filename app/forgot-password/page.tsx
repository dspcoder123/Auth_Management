'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../styles/ForgotPassword.css'
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('https://backend-gydk.onrender.com/api/auth/forgot-password', { email });
      toast.success(res.data.toastMessage || 'Password reset initiated');

      // Clear form
      setEmail('');

      // Redirect to login after 1 second
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err: any) {
      toast.error(err.response?.data?.toastMessage || 'Failed to reset password');

      // Redirect to register page after 1 second
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit} className="forgot-password-form">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
