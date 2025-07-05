import React from "react";
import { motion } from "framer-motion";
import profile from '../data/profile.json';
import { Icon, Section } from "./base";

const Timeline = () => {
  return (
    <Section title="Journey Timeline" icon="⏰" centered={true}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '800px',
          width: '100%',
          margin: '2rem auto',
          position: 'relative',
        }}
      >
        {/* Timeline line */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '0',
          right: '0',
          height: '2px',
          background: 'var(--primary)',
          zIndex: 1,
        }} />

        {profile.journey.map((item, index) => (
          <motion.div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              style={{
                marginBottom: '0.5rem',
              }}
              animate={item.animation === 'sparkle' ? {
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              } : item.animation === 'rocket' ? {
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              } : {
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Icon 
                emoji={item.icon}
                size="large"
                circular={true}
                style={{
                  background: 'var(--card-bg)',
                  border: '3px solid var(--primary)',
                  boxShadow: 'var(--shadow)',
                }}
              />
            </motion.div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}>{item.title}</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>{item.year}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};

export default Timeline; 