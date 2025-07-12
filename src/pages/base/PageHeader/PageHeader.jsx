import React from 'react';
import { motion } from 'framer-motion';
import './PageHeader.css';

const PageHeader = ({ 
  title, 
  subtitle, 
  icon, 
  className = '',
  titleClassName = '',
  subtitleClassName = '',
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`page-header ${className}`}
      {...props}
    >
      {icon && (
        <div className="page-header-icon">
          {icon}
        </div>
      )}
      <h1 className={`page-header-title ${titleClassName}`}>
        {title}
      </h1>
      {subtitle && (
        <p className={`page-header-subtitle ${subtitleClassName}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default PageHeader; 