'use client';

import Header from '../../components/Header'; 
import HomeHero from '../../components/HomeHero';

interface HomePageProps {
  user: any;
}

export default function HomePage({ user }: HomePageProps) {
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';  // change to your actual login page path
  };

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      <HomeHero />
      {/* Any other home content */}
    </>
  );
}
