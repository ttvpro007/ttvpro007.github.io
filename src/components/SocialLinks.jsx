import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "./base";
import '../styling/components/social-links.css';

export default function SocialLinks({ socialLinks }) {
  const getIcon = (iconComponent) => {
    switch (iconComponent) {
      case 'linkedin':
        return '💼';
      case 'github':
        return '🐙';
      case 'twitter':
        return '🐦';
      case 'discord':
        return '🎮';
      case 'email':
        return '📧';
      default:
        return '🔥';
    }
  };

  return (
    <Card hover={false}>
      <div className="social-links-container">
        <h3 className="social-links-title">
          <span>🏕️</span>
          Contact Campfires
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
              whileHover={{ 
                scale: 1.02,
                background: 'rgba(238, 182, 75, 0.2)',
                borderColor: 'var(--primary)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(238, 182, 75, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="social-link-icon">
                <span>{getIcon(link.iconComponent)}</span>
                <motion.div
                  className="social-link-sparkle"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                />
              </div>
              <span className="social-link-name">{link.name}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </Card>
  );
} 