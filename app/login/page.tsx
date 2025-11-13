"use client";
import "../../styles/LoginPage.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from 'next/navigation';
import auth from '../../lib/auth'; // Your existing auth lib
import Footer from "@/components/Footer/Footer";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        form
      );
      toast.success(res.data.toastMessage || "Login successful!");

      // Store token and user
      if (res.data.token || res.data.user) auth.setAuth(res.data.token || null, res.data.user || null);
      setTimeout(() => router.push('/'), 1000);
    } catch (err: any) {
      toast.error(err.response?.data?.toastMessage || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google-login`,
        {
          idToken: credentialResponse.credential,
        }
      );
      toast.success(res.data.toastMessage || "Google login successful!");

      // Store token and user
      if (res.data.token || res.data.user) auth.setAuth(res.data.token || null, res.data.user || null);
      setTimeout(() => router.push('/'), 1000);
    } catch {
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="login-page-background">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-description">Sign in to continue to MultiLang</p>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
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
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="divider">or</div>
        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Google login failed")}
          />
        </div>
        <div className="forgot-password">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </form>
    </div>
    <Footer isDark = {true}/>
    </>
  );
}
