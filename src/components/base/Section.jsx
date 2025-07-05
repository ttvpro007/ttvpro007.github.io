import React from "react";
import { motion } from "framer-motion";

const Section = ({ 
  title, 
  subtitle,
  icon,
  children, 
  centered = false,
  padding = "2rem",
  marginBottom = "2rem",
  style = {},
  ...props 
}) => {
  const sectionStyle = {
    background: 'var(--card-bg)',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--shadow)',
    padding,
    marginBottom,
    border: '2px solid var(--primary)',
    ...style
  };

  const headerStyle = {
    textAlign: centered ? 'center' : 'left',
    marginBottom: '1.5rem'
  };

  const titleStyle = {
    color: 'var(--text)',
    margin: '0 0 0.5rem 0',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textShadow: '0 0 10px var(--primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    justifyContent: centered ? 'center' : 'flex-start'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={sectionStyle}
      {...props}
    >
      {(title || icon) && (
        <div style={headerStyle}>
          <h3 style={titleStyle}>
            {icon && <span>{icon}</span>}
            {title}
          </h3>
          {subtitle && (
            <p style={{
              color: 'var(--text-secondary)',
              margin: 0,
              fontSize: '1rem'
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default Section; 