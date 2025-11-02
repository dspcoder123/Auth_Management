import React from "react";
import "./Cta.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faGooglePlay } from "@fortawesome/free-brands-svg-icons";



export default function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-section__container">
        <div className="cta-section__content">
          <span className="cta-section__subtitle">DOWNLOAD OUR APP</span>
          <h1 className="cta-section__title">
            The choice is yours,<br />we&apos;ve got you covered
          </h1>
          <p className="cta-section__desc">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tristique, nisl ut viverra porttitor, dolor sem lacinia orci, et pretium quam mi a eros sed molestie est.
          </p>
          <div className="cta-section__buttons">
            <a className="cta-section__btn cta-section__appstore" href="#">
            <FontAwesomeIcon icon={faApple} size="lg" />

              App Store
            </a>
            <a className="cta-section__btn cta-section__playstore" href="#">
            <FontAwesomeIcon icon={faGooglePlay} size="lg" />
              Play Store
            </a>
          </div>
        </div>
        <div className="cta-section__image">
          <img src="https://media.fortuneindia.com/fortune-india/import/2023-12/4c3e7d91-47c6-4600-8f6b-98ec2baa8c50/GettyImages_1309642082.jpg?w=640&auto=format,compress&q=80" alt="App Screen" />
        </div>
      </div>
    </section>
  );
}
