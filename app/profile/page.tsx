'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import auth from '../../lib/auth';
import { FiUser } from 'react-icons/fi';
import '../../styles/ProfilePage.css'; // You can create or extend your CSS here

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

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

  if (!user) return <div className="loading">Loading...</div>;

  const handleLogout = () => {
    auth.clearAuth();
    window.location.href = '/login';
  };

  return (
    <div className="profile-page-container">
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
    </div>
  );
}
