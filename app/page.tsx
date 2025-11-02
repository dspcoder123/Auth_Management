'use client';

import '../styles/HomePage.css';
import Hero from '../components/Hero';
import Features from '../components/Features/Features';
import Chart from '../components/PieChart/Chart';
import Timeline from '../components/Timeline/Timeline';
import Team from '../components/Team/Team';
import Testimonials from '../components/Testimonials/Testimonials';
import CTA from '../components/CTA/Cta';
import Faq from '../components/FAQ/Faq';
import Blog from '../components/Blogs/Blogs';
import News from '../components/NewsLetter/News';
import Contact from '../components/Contact/Contact';
import Footer from '../components/Footer/Footer';

// import '../styles/globals.css';

export default function HomePage() {
  return (
    <div className="home-container">
      <Hero isDark={true} />
      <Features isDark = {true} />
      <Chart />
      <Timeline />
      <Team />  
      <Testimonials/>
      <CTA/>
      <Faq isDark = {true} />
      <Blog isDark = {true} />
      <Contact isDark = {true} />
      <News isDark = {true} />
      <Footer isDark = {true} />
    </div>
  );
}
