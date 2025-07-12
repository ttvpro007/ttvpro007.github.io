import React from 'react';
import { motion } from 'framer-motion';
import './PageFooter.css';

const PageFooter = ({ 
  children, 
  className = '',
  showBackToTop = true,
  ...props 
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`page-footer ${className}`}
      {...props}
    >
      {children}
      
      {showBackToTop && (
        <motion.button
          onClick={scrollToTop}
          className="page-footer-back-to-top"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          ↑ Back to Top
        </motion.button>
      )}
    </motion.footer>
  );
};

export default PageFooter; 