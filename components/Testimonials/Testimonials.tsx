import React from "react";
import "./Testimonials.css";

const testimonials = [
  {
    avatar: "https://crypto.demo.nextjstemplates.com/_next/image?url=%2Fimages%2Ftestimonials%2Fimage-01.jpg&w=96&q=75", // Place each client image in /public
    name: "Jason Keys",
    title: "CEO & Founder @ Dreampeet.",
    body: "I believe in lifelong learning and Learn. is a great place to learn from experts. I've learned a lot and recommend it to all my friends and family's."
  },
  {
    avatar: "https://crypto.demo.nextjstemplates.com/_next/image?url=%2Fimages%2Ftestimonials%2Fimage-02.jpg&w=96&q=75",
    name: "Mariya Merry",
    title: "CEO & Founder @ Betex.",
    body: "I believe in lifelong learning and Learn. is a great place to learn from experts. I've learned a lot and recommend it to all my friends and family's."
  },
  {
    avatar: "https://crypto.demo.nextjstemplates.com/_next/image?url=%2Fimages%2Ftestimonials%2Fimage-02.jpg&w=96&q=75",
    name: "Andria Jolly",
    title: "CEO & Founder @ CryptoX.",
    body: "I believe in lifelong learning and Learn. is a great place to learn from experts. I've learned a lot and recommend it to all my friends and family's."
  },
  {
    avatar: "https://crypto.demo.nextjstemplates.com/_next/image?url=%2Fimages%2Ftestimonials%2Fimage-02.jpg&w=96&q=75",
    name: "Devid Willium",
    title: "CEO & Founder @ Coinbase.",
    body: "I believe in lifelong learning and Learn. is a great place to learn from experts. I've learned a lot and recommend it to all my friends and family's."
  },
];

export default function TestimonialsSection() {
  return (
    <section className="testimonials-section">
      <div className="testimonials-section__header">
        <span className="testimonials-section__subtitle">TESTIMONIALS</span>
        <h2 className="testimonials-section__title">What Our Client Say's</h2>
        <p className="testimonials-section__desc">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed congue arcu, In et dignissim quam condimentum vel.
        </p>
      </div>
      <div className="testimonials-section__grid">
        {testimonials.map((t, i) => (
          <div className="testimonial-card" key={i}>
            <div className="testimonial-card__person">
              <img src={t.avatar} className="testimonial-card__avatar" alt={t.name} />
              <div>
                <div className="testimonial-card__name">{t.name}</div>
                <div className="testimonial-card__title">{t.title}</div>
              </div>
            </div>
            <div className="testimonial-card__body">
              “{t.body}”
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
