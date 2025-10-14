'use client';

import Header from '../../components/Header'; // adjust path if needed
import { useState } from 'react';

export default function AboutPage() {
  // Example user data for demo
  const [user] = useState({
    name: 'John Doe',
    profilePic: '',
  });

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <>
      <Header user={user} onLogout={handleLogout}  />
      <main style={styles.main}>
        <section style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '40px',
          alignItems: 'center',
        }}>
          <div style={styles.textContainer}>
            <h1 style={styles.heading}>About Us</h1>
            <p style={styles.paragraph}>
              Welcome to our platform! We are focused on quality, user experience, and innovation.
              Our team strives to deliver exceptional content and seamless interactions.
            </p>
            <p style={styles.paragraph}>
              This site is powered by Next.js and Strapi CMS, bringing you dynamic content with a clean UI.
            </p>
          </div>
          <div style={styles.imageContainer}>
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
              alt="About Us"
              style={styles.image}
              loading="lazy"
            />
          </div>
        </section>
      </main>
    </>
  );
}

const styles = {
  main: {
    maxWidth: 1200,
    margin: '40px auto 60px',
    padding: '0 24px',
    fontFamily: 'Inter, sans-serif',
  },
  contentSection: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '40px',
    alignItems: 'center',
  },
  textContainer: {
    flex: '1 1 400px',
    maxWidth: 600,
  },
  heading: {
    fontSize: 36,
    fontWeight: 700,
    color: '#1e81f6',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 18,
    color: '#444',
    lineHeight: 1.6,
    marginBottom: 16,
  },
  imageContainer: {
    flex: '1 1 300px',
    maxWidth: 400,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  },
  image: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
};
