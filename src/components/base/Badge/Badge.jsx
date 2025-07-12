import React from "react";
import { motion } from "framer-motion";
import "./Badge.css";

const Badge = ({ 
  children, 
  variant = "primary",
  size = "medium",
  className = "",
  animated = false,
  ...props 
}) => {
  // Build CSS classes
  const badgeClasses = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    animated && 'badge--animated',
    className
  ].filter(Boolean).join(' ');

  const Component = animated ? motion.span : 'span';
  const motionProps = animated ? {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  } : {};

  return (
    <Component
      className={badgeClasses}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Badge; 