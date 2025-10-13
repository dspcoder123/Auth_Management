'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiLogOut, FiUser } from 'react-icons/fi';
import '../../styles/ProfilePage.css';
import Header from '../../components/Header'; // Strapi header
import HomeHero from '../../components/HomeHero'; // Strapi hero

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'profile'>('home');

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem('authToken');
      if (!token) {
        window.location.href = '/';
        return;
      }
      try {
        const res = await axios.get('https://backend-gydk.onrender.com/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.user);
      } catch {
        localStorage.removeItem('authToken');
        window.location.href = '/';
      }
    }
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-page">
      {/* Strapi header always at top */}
      <Header
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onProfile={() => setActiveTab('profile')}
        onLogout={handleLogout} />
      {/* Strapi hero always at top */}
      <HomeHero />
      {/* Tab navigation and user menu area */}
      <nav className="header-tabs">
        <button
          className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          Home
        </button>
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          My Profile
        </button>
        <div className="profile-menu" style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 16 }}>
          {user.profilePic ? (
            <img src={user.profilePic} alt="User" className="avatar" />
          ) : (
            <FiUser className="avatar-icon" />
          )}
          <span className="username" style={{ marginLeft: 8 }}>{user.name.split(' ')[0]}</span>
          <button className="logout-btn" style={{ marginLeft: 12 }} onClick={handleLogout}>
            <FiLogOut />
          </button>
        </div>
      </nav>
      <main className="profile-content">
        {activeTab === 'home' && (
          <div className="welcome-msg">
            <h2>Welcome, {user.name.split(' ')[0]}</h2>
            <p>Use the header tabs to see your profile or logout.</p>
          </div>
        )}
        {activeTab === 'profile' && (
          <div className="profile-card">
            <div className="profile-header-card">
              {user.profilePic ? (
                <img src={user.profilePic} alt="User" className="avatar-lg" />
              ) : (
                <FiUser className="avatar-lg" />
              )}
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
            <div className="profile-details-grid">
              <div><strong>Mobile:</strong> {user.mobile || 'N/A'}</div>
              <div><strong>Status:</strong> {user.verified ? 'Verified' : 'Not Verified'}</div>
              <div><strong>Created:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleString() : ''}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
