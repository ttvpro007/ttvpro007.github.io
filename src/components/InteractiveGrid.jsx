import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gridItems from "../data/gridItems.json";

export default function InteractiveGrid() {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div style={{ width: '100%', marginBottom: '3rem' }}>
      <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem', textAlign: 'center' }}>
        What I Do
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {gridItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedItem(item)}
            style={{
              background: 'var(--card-bg)',
              borderRadius: 'var(--border-radius)',
              padding: '1.5rem',
              cursor: 'pointer',
              border: '2px solid transparent',
              transition: 'all 0.3s ease',
              boxShadow: 'var(--shadow)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              minHeight: '120px',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = item.color;
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.icon}</div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{item.title}</h4>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
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
              padding: '1rem'
            }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                background: 'var(--card-bg)',
                borderRadius: 'var(--border-radius)',
                padding: '2rem',
                maxWidth: '500px',
                width: '100%',
                position: 'relative',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'var(--text)',
                  padding: '0.5rem'
                }}
              >
                ×
              </button>
              
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{selectedItem.icon}</div>
                <h3 style={{ margin: 0, color: selectedItem.color }}>{selectedItem.title}</h3>
              </div>
              
              <ul style={{ margin: '0 0 1.5rem 0', paddingLeft: '1.5rem' }}>
                {selectedItem.content.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    style={{ marginBottom: '0.5rem', lineHeight: 1.5 }}
                  >
                    {point}
                  </motion.li>
                ))}
              </ul>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{
                  background: 'var(--bg)',
                  borderRadius: 'var(--border-radius)',
                  padding: '1rem',
                  textAlign: 'center',
                  border: `2px solid ${selectedItem.color}`,
                  color: selectedItem.color,
                  fontWeight: 600
                }}
              >
                {selectedItem.demo}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 