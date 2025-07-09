import React from 'react';
import { motion } from 'framer-motion';
import { Card, Icon } from "./base";
import '../styling/components/social-links.css';

const EmailSVG = (
  <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#d44638"/>
    <path d="M5 8.5V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5l-7 5-7-5Z" fill="#fff"/>
    <path d="M19 7a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1l7 5 7-5Z" fill="#fff"/>
  </svg>
);

export default function SocialLinks({ socialLinks }) {
  return (
    <Card hover={false}>
      <div className="social-links-container">
        <h3 className="social-links-title">
          <Icon 
            emoji="🏕️"
            size="large"
            className="social-links-title-icon"
          />
          Social Links
        </h3>
        <div className="social-links-list">
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="social-link-icon">
                {link.icon === 'email-svg' ? EmailSVG :
                  link.icon && link.icon.startsWith('http') ? (
                    <img src={link.icon} alt={link.name + ' icon'} style={{ width: '1.5em', height: '1.5em', verticalAlign: 'middle' }} />
                  ) : null}
              </span>
              <span className="social-link-name">{link.name}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </Card>
  );
} 