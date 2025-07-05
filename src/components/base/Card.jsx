import React from "react";
import { motion } from "framer-motion";

const Card = ({ 
  children, 
  className = "", 
  style = {}, 
  hover = true, 
  border = true,
  shadow = true,
  padding = "1.5rem",
  onClick,
  ...props 
}) => {
  const cardStyle = {
    background: 'var(--card-bg)',
    borderRadius: 'var(--border-radius)',
    padding,
    boxShadow: shadow ? 'var(--shadow)' : 'none',
    border: border ? '2px solid var(--primary)' : 'none',
    position: 'relative',
    overflow: 'hidden',
    ...style
  };

  const MotionComponent = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { scale: 1.02, y: -2 },
    transition: { duration: 0.2, ease: 'easeOut' }
  } : {};

  return (
    <MotionComponent
      style={cardStyle}
      className={className}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

export default Card; 