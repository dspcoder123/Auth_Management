'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import '../styles/RegisterForm.css'; // 👈 Import the CSS file

export default function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('https://backend-gydk.onrender.com/api/auth/register', form);
      toast.success(res.data.toastMessage || 'Registration successful!');
      setForm({ name: '', email: '', mobile: '', password: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.toastMessage || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const res = await axios.post('https://backend-gydk.onrender.com/api/auth/google-auth', {
        idToken: credentialResponse.credential,
      });
      toast.success(res.data.toastMessage || 'Google registration successful!');
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);

    } catch {
      toast.error('Google registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full Name"
        required
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="tel"
        name="mobile"
        value={form.mobile}
        onChange={handleChange}
        placeholder="Mobile Number"
        required
      />
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>

      <div className="divider">or</div>

      <div className="google-login">
        <GoogleLogin
          onSuccess={handleGoogleRegister}
          onError={() => toast.error('Google login failed')}

        />
      </div>
    </form>
  );
}
