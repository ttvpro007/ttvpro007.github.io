import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmationModal({ isOpen, title, text, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(8px)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          style={{
            background: 'var(--card-bg)',
            border: '3px solid var(--primary)',
            borderRadius: 'var(--border-radius)',
            padding: '3rem',
            textAlign: 'center',
            maxWidth: '500px',
            width: '90%',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(238, 182, 75, 0.3)'
          }}
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Treasure Chest Animation */}
          <motion.div
            style={{
              width: '80px',
              height: '60px',
              margin: '0 auto 2rem',
              position: 'relative'
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", damping: 15 }}
          >
            <motion.div
              style={{
                width: '100%',
                height: '40px',
                background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
                border: '2px solid #654321',
                borderRadius: '8px 8px 0 0',
                position: 'absolute',
                bottom: 0
              }}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ delay: 1.2, duration: 0.3 }}
            />
            <motion.div
              style={{
                width: '100%',
                height: '20px',
                background: 'linear-gradient(135deg, #CD853F 0%, #DEB887 100%)',
                border: '2px solid #8B4513',
                borderRadius: '8px 8px 0 0',
                position: 'absolute',
                top: 0,
                transformOrigin: 'bottom'
              }}
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -45 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            />
            
            {/* Sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: '4px',
                  height: '4px',
                  background: 'var(--primary)',
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }}
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: 0,
                  y: 0
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.cos(i * 60 * Math.PI / 180) * 100,
                  y: Math.sin(i * 60 * Math.PI / 180) * 100
                }}
                transition={{ 
                  delay: 1.5 + i * 0.1,
                  duration: 1.5
                }}
              />
            ))}
          </motion.div>

          <motion.h2
            style={{
              fontSize: '2rem',
              marginBottom: '1rem',
              color: 'var(--primary)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {title}
          </motion.h2>

          <motion.p
            style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              marginBottom: '2rem',
              lineHeight: 1.6
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {text}
          </motion.p>

          <motion.button
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              color: 'var(--bg)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onClick={onClose}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 8px 20px rgba(238, 182, 75, 0.4)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span style={{ fontSize: '1.1rem' }}>✨</span>
            Continue Adventure
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 