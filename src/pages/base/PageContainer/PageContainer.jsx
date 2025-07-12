import React from 'react';
import { motion } from 'framer-motion';
import './PageContainer.css';

const PageContainer = ({ 
  children, 
  className = '', 
  initialAnimation = { opacity: 0, y: 20 },
  animateAnimation = { opacity: 1, y: 0 },
  transition = { duration: 0.7 },
  ...props 
}) => {
  return (
    <main className={`page-container ${className}`} {...props}>
      <div className="body-panel">
        <motion.div
          initial={initialAnimation}
          animate={animateAnimation}
          transition={transition}
          className="page-content"
        >
          {children}
        </motion.div>
      </div>
    </main>
  );
};

export default PageContainer; 