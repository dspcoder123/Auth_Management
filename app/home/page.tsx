'use client';

import Header from '../../components/Header'; 
import HomeHero from '../../components/HomeHero';

interface HomePageProps {
  user: any;
}

export default function HomePage() {
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  return (
    <>
      <Header user={null} onLogout={handleLogout} />
      <HomeHero />
      {/* Any other home content */}
    </>
  );
}
