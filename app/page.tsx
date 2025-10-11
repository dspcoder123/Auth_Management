'use client';

import { useState } from 'react';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import '../styles/HomePage.css';

export default function HomePage() {
  const [view, setView] = useState<'register' | 'login' | 'login'>('login');

  return (
    <div className="home-container">
      <div className="auth-box">
        <h1 className="title">
          Welcome to <span className="highlight">User Auth</span>
        </h1>

        <div className="button-group">
          <button
            onClick={() => setView('register')}
            className={`toggle-btn ${view === 'register' ? 'active' : ''}`}
          >
            Register
          </button>
          <button
            onClick={() => setView('login')}
            className={`toggle-btn ${view === 'login' ? 'active' : ''}`}
          >
            Login
          </button>
        </div>

        <div className="form-container">
          {view === 'register' && <RegisterForm />}
          {view === 'login' && <LoginForm />}
        </div>
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} Auth System by Dinesh
      </footer>
    </div>
  );
}
