import React from "react";
import { motion } from "framer-motion";
import FlipCard from "./FlipCard";
import profile from '../data/profile.json';

const FlipCards = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      style={{
        display: 'flex',
        gap: '1.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '900px',
        width: '100%',
      }}
    >
      {profile.flipCards.map((card, index) => (
        <FlipCard key={index} card={card} index={index} />
      ))}
    </motion.div>
  );
};

export default FlipCards; 