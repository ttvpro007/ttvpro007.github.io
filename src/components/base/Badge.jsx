import React from "react";
import { motion } from "framer-motion";

const Badge = ({ 
  children, 
  color = "var(--primary)", 
  bgColor = "var(--primary)", 
  textColor = "var(--card-bg)",
  size = "medium",
  style = {},
  animated = false,
  ...props 
}) => {
  const sizeStyles = {
    small: { padding: '0.25rem 0.5rem', fontSize: '0.75rem' },
    medium: { padding: '0.25rem 0.75rem', fontSize: '0.8rem' },
    large: { padding: '0.5rem 1rem', fontSize: '0.9rem' }
  };

  const badgeStyle = {
    background: bgColor,
    color: textColor,
    borderRadius: '12px',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: `1px solid ${color}`,
    ...sizeStyles[size],
    ...style
  };

  const Component = animated ? motion.span : 'span';
  const motionProps = animated ? {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  } : {};

  return (
    <Component
      style={badgeStyle}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Badge; 