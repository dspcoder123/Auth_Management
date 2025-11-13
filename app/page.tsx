'use client';

import '../styles/HomePage.css';
import Hero from '../components/Hero';
import Features from '../components/Features/Features';
import dynamic from 'next/dynamic';  // ✅ import dynamic
import Timeline from '../components/Timeline/Timeline';
import Team from '../components/Team/Team';
import Testimonials from '../components/Testimonials/Testimonials';
import CTA from '../components/CTA/Cta';
import Faq from '../components/FAQ/Faq';
import Blog from '../components/Blogs/Blogs';
import News from '../components/NewsLetter/News';
import Contact from '../components/Contact/Contact';
import Footer from '../components/Footer/Footer';

// ✅ dynamically import Chart component (disable SSR)
const Chart = dynamic(() => import('../components/PieChart/Chart'), {
  ssr: false,
});

export default function HomePage() {
  return (
    <div className="home-container">
      <Hero isDark={true} />
      <Features isDark={true} />
      <Chart /> {/* ✅ now loads only on client */}
      <Timeline />
      <Team />
      <Testimonials />
      <CTA />
      <Faq isDark={true} />
      <Blog isDark={true} />
      <Contact isDark={true} />
      <News isDark={true} />
      <Footer isDark={true} />
    </div>
  );
}
