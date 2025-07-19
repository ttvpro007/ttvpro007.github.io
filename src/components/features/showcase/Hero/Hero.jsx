import React from "react";
import { motion } from "framer-motion";
import Confetti from 'react-dom-confetti';
import { profile } from '@/data';
import { Section } from '@/components/base';
import './Hero.css';

export default function Hero({ 
  profilePicSize = 'medium', 
  showSocialLinks = true 
}) {
  const [bounce, setBounce] = React.useState(false);
  const [confetti, setConfetti] = React.useState(false);

  // Profile picture size configurations
  const sizeConfigs = {
    small: { width: 120, height: 120, className: 'hero-profile-pic-small' },
    medium: { width: 160, height: 160, className: 'hero-profile-pic-medium' },
    large: { width: 200, height: 200, className: 'hero-profile-pic-large' }
  };

  const currentSize = sizeConfigs[profilePicSize] || sizeConfigs.medium;

  // Add loading state check
  if (!profile || !profile.personal) {
    return (
      <div className="hero-loading body-text">
        Loading...
      </div>
    );
  }

  return (
    <Section
      centered={true}
      className="hero"
    >
      <div className="hero-profile-container">
        <motion.img
          src={profile.personal?.profilePic}
          alt={profile.personal?.name + " profile"}
          className={`hero-profile-pic ${currentSize.className}`}
          width={currentSize.width}
          height={currentSize.height}
          animate={bounce ? { y: [0, -30, 0], scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.6, type: 'tween', ease: 'easeInOut' }}
          onClick={() => {
            setBounce(true);
            setConfetti(true);
            setTimeout(() => setBounce(false), 600);
            setTimeout(() => setConfetti(false), 700);
          }}
        />
        <div className="hero-confetti-container">
          <Confetti active={confetti} config={{
            angle: 90,
            spread: 60,
            startVelocity: 35,
            elementCount: 50,
            dragFriction: 0.1,
            duration: 3000,
            stagger: 0,
            width: "10px",
            height: "10px",
            perspective: "500px",
            colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
          }} />
        </div>
      </div>

      <div className="hero-title">
        <h1 className="hero-name">{profile.personal?.name}</h1>
        <p className="hero-tagline">{profile.personal?.tagline}</p>
      </div>
      
      {showSocialLinks && (
        <div className="hero-social-links">
          {profile.socialLinks?.map(link => (
            <a
              key={link.type}
              href={link.url}
              target={link.type !== 'email' ? '_blank' : undefined}
              rel={link.type !== 'email' ? 'noopener noreferrer' : undefined}
              className="hero-social-link"
              style={{ color: link.color }}
            >
              {link.icon === 'email-svg' ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#eee"/><path d="M4 8V16C4 17.1046 4.89543 18 6 18H18C19.1046 18 20 17.1046 20 16V8C20 6.89543 19.1046 6 18 6H6C4.89543 6 4 6.89543 4 8Z" stroke="#d44638" strokeWidth="2"/><path d="M4 8L12 13L20 8" stroke="#d44638" strokeWidth="2"/></svg>
              ) : (
                <img src={link.icon} alt={link.type} width={32} height={32} />
              )}
            </a>
          ))}
        </div>
      )}
    </Section>
  );
} 