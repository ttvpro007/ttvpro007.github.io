import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import profile from '../data/profile.json';

const FunFacts = () => {
  const [currentFact, setCurrentFact] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCurrentFact((prev) => (prev + 1) % profile.funFacts.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      style={{
        background: 'var(--card-bg)',
        borderRadius: 'var(--border-radius)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
      }}
      onHoverStart={() => setIsVisible(true)}
      onHoverEnd={() => setIsVisible(false)}
    >
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Did you know...?</h3>
      <AnimatePresence mode="wait">
        <motion.p
          key={currentFact}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.4,
            fontStyle: 'italic',
          }}
        >
          {profile.funFacts[currentFact]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
};

export default FunFacts; 