'use client';

import '../styles/HomePage.css';
import Hero from '../components/Hero';
// import '../styles/globals.css';

export default function HomePage() {
  return (
    <div className="home-container">
      <Hero isDark={true} />

    </div>
  );
}
