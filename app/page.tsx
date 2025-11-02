'use client';

import '../styles/HomePage.css';
import Hero from '../components/Hero';
import Features from '../components/Features/Features';
import News from '../components/NewsLetter/News';
import Contact from '../components/Contact/Contact';
import Footer from '../components/Footer/Footer';
// import '../styles/globals.css';

export default function HomePage() {
  return (
    <div className="home-container">
      <Hero isDark={true} />
      <Features isDark = {true} />
      <Contact isDark = {true} />
      <News isDark = {true} />
      <Footer isDark = {true} />
    </div>
  );
}
