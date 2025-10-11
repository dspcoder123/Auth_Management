"use client";
import "../styles/LoginPage.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from 'next/navigation';


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
        "https://backend-gydk.onrender.com/api/auth/login",
        form
      );
      toast.success(res.data.toastMessage || "Login successful!");
      if (res.data.token) localStorage.setItem("authToken", res.data.token);
      setTimeout(() => (window.location.href = "/profile"), 1000);
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
        "https://backend-gydk.onrender.com/api/auth/google-login",
        {
          idToken: credentialResponse.credential,
        }
      );
      toast.success(res.data.toastMessage || "Google login successful!");
      if (res.data.token) localStorage.setItem("authToken", res.data.token);
      setTimeout(() => router.push('/home'), 1000);
    } catch {
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
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
  );
}
