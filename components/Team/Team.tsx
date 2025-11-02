import React from "react";
import "./Team.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faFacebookF, faLinkedinIn, faYoutube } from "@fortawesome/free-brands-svg-icons";

const teamMembers = [
  {
    avatar: "https://crypto.demo.nextjstemplates.com/_next/image?url=%2Fimages%2Fteam%2Fimage-01.jpg&w=384&q=75",
    name: "Matheus Ferrero",
    role: "Marketing Expert",
    socials: {
      twitter: "#",
      facebook: "#",
      linkedin: "#",
      youtube: "#"
    }
  },
  {
    avatar: "https://crypto.demo.nextjstemplates.com/_next/image?url=%2Fimages%2Fteam%2Fimage-01.jpg&w=384&q=75",
    name: "Eva Hudson",
    role: "Blockchain Developer",
    socials: {
      twitter: "#",
      facebook: "#",
      linkedin: "#",
      youtube: "#"
    }
  },
  {
    avatar: "https://crypto.demo.nextjstemplates.com/_next/image?url=%2Fimages%2Fteam%2Fimage-03.jpg&w=384&q=75",
    name: "Jackie Sanders",
    role: "Creative Designer",
    socials: {
      twitter: "#",
      facebook: "#",
      linkedin: "#",
      youtube: "#"
    }
  },
  {
    avatar: "https://crypto.demo.nextjstemplates.com/_next/image?url=%2Fimages%2Fteam%2Fimage-04.jpg&w=384&q=75",
    name: "Jackie Sanders",
    role: "SEO Expert",
    socials: {
      twitter: "#",
      facebook: "#",
      linkedin: "#",
      youtube: "#"
    }
  }
];

export default function TeamSection() {
  return (
    <section className="team-section">
      <div className="team-section__header">
        <span className="team-section__subtitle">OUT TEAM</span>
        <h2 className="team-section__title">Meet out Team</h2>
        <p className="team-section__desc">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed congue arcu, In et dignissim quam condimentum vel.
        </p>
      </div>
      <div className="team-section__grid">
        {teamMembers.map((member, i) => (
          <div className="team-card" key={i}>
            <div className="team-card__image">
              <img src={member.avatar} alt={member.name} />
            </div>
            <div className="team-card__info">
              <div className="team-card__name">{member.name}</div>
              <div className="team-card__role">{member.role}</div>
              <div className="team-card__socials">
                <a href={member.socials.facebook}><FontAwesomeIcon icon={faFacebookF} /></a>
                <a href={member.socials.twitter}><FontAwesomeIcon icon={faTwitter} /></a>
                <a href={member.socials.linkedin}><FontAwesomeIcon icon={faLinkedinIn} /></a>
                <a href={member.socials.youtube}><FontAwesomeIcon icon={faYoutube} /></a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
