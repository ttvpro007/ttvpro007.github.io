import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "./base";

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
      <div>
        <h3 style={{
          color: 'var(--text)',
          margin: '0 0 1rem 0',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>🏕️</span>
          Contact Campfires
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                background: 'rgba(238, 182, 75, 0.1)',
                border: '1px solid rgba(238, 182, 75, 0.3)',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'var(--text)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
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
              <div style={{ position: 'relative', fontSize: '1.5rem' }}>
                <span>{getIcon(link.iconComponent)}</span>
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    width: '8px',
                    height: '8px',
                    background: 'var(--primary)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                  }}
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
              <span style={{ fontWeight: '500' }}>{link.name}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </Card>
  );
} 