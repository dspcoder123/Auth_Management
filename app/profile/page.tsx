"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import auth from '../../lib/auth';
import { FiUser } from 'react-icons/fi';
import '../../styles/ProfilePage.css'; // You can create or extend your CSS here
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/');
        return;
      }
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.user);
      } catch {
        localStorage.removeItem('authToken');
        router.push('/');
      }
    }
    fetchProfile();
  }, []);

  if (!user) return <div className="loading">Loading...</div>;

  const handleLogout = () => {
    auth.clearAuth();
    router.push('/login');
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
