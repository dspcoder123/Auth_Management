import React from "react";
import "./Footer.css";


interface FooterProps {
  isDark: boolean;
}

const newsPosts = [
  {
    img: "https://crypto.demo.nextjstemplates.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fd33zuypx%2Fproduction%2Fa0ca7f2ce7b15da5c3c4bb79e6856ab013fce446-970x430.jpg&w=1920&q=100", // replace with your images or links
    title: "Laboris nisi aliquip dium exiuliym commodo cons...",
    date: "Aug 21 2024"
  },
  {
    img: "https://crypto.demo.nextjstemplates.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fd33zuypx%2Fproduction%2Fdbd12e983d6827bf7923b41d837d298c0aefcd9e-740x340.jpg&w=1920&q=100",
    title: "Expenses as material bre mate insisted buildi...",
    date: "Aug 21 2024"
  }
];

const Footer: React.FC<FooterProps> = ({ isDark }) => (
  <footer className={`footer-main ${isDark ? "dark" : "light"}`}>
    <div className="footer-content">
      {/* Brand/About */}
      <div className="footer-col brand">
        <div className="footer-logo">
          <span className="logo-icon">e</span><span>Crypto</span>
        </div>
        <p className="footer-desc">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vitae quam nec ante fringilla vel at erat convallis elit.
        </p>
        <div className="footer-socials">
          <a href="#"><i className="fa-brands fa-discord"></i></a>
          <a href="#"><i className="fa-brands fa-twitter"></i></a>
          <a href="#"><i className="fa-brands fa-linkedin"></i></a>
          <a href="#"><i className="fa-brands fa-youtube"></i></a>
        </div>
      </div>
      {/* Quick Links */}
      <div className="footer-col links">
        <h4>Quick Links</h4>
        <a href="#">What is ico</a>
        <a href="#">Roadmap</a>
        <a href="#">Whitepaper</a>
        <a href="#">Social Network</a>
        <a href="#">Join Us Now</a>
      </div>
      {/* Supports */}
      <div className="footer-col support">
        <h4>Supports</h4>
        <a href="#">Setting & Privacy</a>
        <a href="#">Help & Support</a>
        <a href="#">Terms & Conditions</a>
        <a href="#">24/7 Supports</a>
        <a href="#">On Point FAQ</a>
      </div>
      {/* News & Post */}
      <div className="footer-col news">
        <h4>News & Post</h4>
        <div className="news-list">
          {newsPosts.map((post, i) => (
            <div className="newscard" key={i}>
              <img src={post.img} alt={post.title} />
              <div>
                <div className="news-title">{post.title}</div>
                <div className="news-date"><i className="fa-regular fa-calendar-days"></i> {post.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    {/* bottom bar */}
    <div className="footer-bottom">
      © Crypto - All Rights Reserved, Crafted by Next.js Templates
    </div>
  </footer>
);

export default Footer;
