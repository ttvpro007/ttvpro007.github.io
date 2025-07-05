import React from "react";
import { motion } from "framer-motion";

const Button = ({ 
  children, 
  variant = "primary", 
  size = "medium",
  fullWidth = false,
  disabled = false,
  style = {},
  onClick,
  ...props 
}) => {
  const variants = {
    primary: {
      background: 'var(--primary)',
      color: 'var(--card-bg)',
      border: 'none'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--primary)',
      border: '1px solid var(--primary)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--text)',
      border: '1px solid var(--border)'
    }
  };

  const sizes = {
    small: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    medium: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    large: { padding: '1rem 2rem', fontSize: '1.1rem' }
  };

  const buttonStyle = {
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
    ...variants[variant],
    ...sizes[size],
    ...style
  };

  const motionProps = {
    whileHover: disabled ? {} : { scale: 1.05, y: -2 },
    whileTap: disabled ? {} : { scale: 0.95 },
    transition: { duration: 0.2, ease: 'easeOut' }
  };

  return (
    <motion.button
      style={buttonStyle}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button; 