import React from "react";
import { motion } from "framer-motion";
import profile from '../data/profile.json';

const ShowAndTell = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      style={{
        background: 'var(--card-bg)',
        borderRadius: 'var(--border-radius)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow)',
        maxWidth: '600px',
        width: '100%',
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', textAlign: 'center' }}>Show & Tell</h3>
      
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <motion.img
          key={currentIndex}
          src={profile.showAndTell[currentIndex].image}
          alt={profile.showAndTell[currentIndex].title}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: 'var(--border-radius)',
            marginBottom: '0.5rem',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>
            {profile.showAndTell[currentIndex].title}
          </h4>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.8 }}>
            {profile.showAndTell[currentIndex].description}
          </p>
          <span style={{
            fontSize: '0.8rem',
            fontStyle: 'italic',
            color: 'var(--primary)',
            fontWeight: 'bold',
          }}>
            "{profile.showAndTell[currentIndex].caption}"
          </span>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
        {profile.showAndTell.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              background: index === currentIndex ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ShowAndTell; 