'use client';

import '../styles/HomePage.css';
import HomeContent from '../components/HomeContent';

export default function HomePage() {
  return (
    <div className="home-container">
      <HomeContent />

      <footer className="footer">
        © {new Date().getFullYear()} Auth System by Dinesh
      </footer>
    </div>
  );
}
