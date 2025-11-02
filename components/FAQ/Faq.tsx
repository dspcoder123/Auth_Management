import React, { useState } from "react";
import "./Faq.css";

interface FAQprops{
    isDark : boolean;
}

const faqList = [
  {
    question: "How can I participate in the ICO Token sale?",
    answer: `There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything.`,
  },
  {
    question: "What is ICO Crypto?",
    answer: "ICO Crypto is a cryptocurrency token built on the Ethereum network, designed for secure and fast transactions.",
  },
  {
    question: "How do I benefit from the ICO Token?",
    answer: "By holding ICO Tokens, you get early access to new platform features, lower transaction fees, and potential rewards.",
  },
  {
    question: "How can I purchase bitcoin?",
    answer: "You can purchase bitcoin through various exchanges, using bank transfer, credit card, or other cryptocurrencies.",
  },
];

const FAQSection: React.FC<FAQprops> = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="faq-section">
      <div className="faq-section__header">
        <span className="faq-section__subtitle">FAQ</span>
        <h2 className="faq-section__title">Frequently Asked Questions</h2>
        <p className="faq-section__desc">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed congue arcu, In et dignissim quam condimentum vel.
        </p>
      </div>
      <div className="faq-section__list">
        {faqList.map((item, i) => (
          <div
            className={`faq-card${openIndex === i ? ' open' : ''}`}
            key={i}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <div className="faq-card__question">
              <span>{item.question}</span>
              <span className="faq-card__toggle">{openIndex === i ? "▴" : "▾"}</span>
            </div>
            {openIndex === i && (
              <div className="faq-card__answer">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
