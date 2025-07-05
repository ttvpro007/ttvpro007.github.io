import React from "react";
import { motion } from "framer-motion";
import { Card } from "./base";

const FlipCard = ({ card, index }) => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        style={{
          width: '280px',
          height: '200px',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* Front of card */}
        <Card
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          hover={true}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{card.front.icon}</div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', textAlign: 'center' }}>{card.front.title}</h3>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8, textAlign: 'center' }}>{card.front.subtitle}</p>
        </Card>

        {/* Back of card */}
        <motion.div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'var(--primary)',
            color: 'white',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--shadow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.4 }}>{card.back.content}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default FlipCard; 