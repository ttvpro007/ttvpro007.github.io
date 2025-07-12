import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ConfirmationModal.css';

export default function ConfirmationModal({ isOpen, title, text, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-container"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Treasure Chest Animation */}
          <motion.div
            className="treasure-chest"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", damping: 15 }}
          >
            <motion.div
              className="treasure-base"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ delay: 1.2, duration: 0.3 }}
            />
            <motion.div
              className="treasure-lid"
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -45 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            />
            
            {/* Sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="treasure-sparkle"
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
            className="modal-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {title}
          </motion.h2>

          <motion.p
            className="modal-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {text}
          </motion.p>

          <motion.button
            className="modal-button"
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
            <span className="modal-button-icon">✨</span>
            Continue Adventure
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 