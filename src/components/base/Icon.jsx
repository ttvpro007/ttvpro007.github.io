import React from "react";
import { motion } from "framer-motion";

const Icon = ({ 
  src, 
  emoji, 
  alt = "", 
  size = "medium",
  circular = false,
  animated = false,
  style = {},
  ...props 
}) => {
  const sizes = {
    small: { width: '20px', height: '20px', fontSize: '1rem' },
    medium: { width: '40px', height: '40px', fontSize: '1.5rem' },
    large: { width: '60px', height: '60px', fontSize: '2rem' },
    xlarge: { width: '80px', height: '80px', fontSize: '2.5rem' }
  };

  const iconStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: circular ? '50%' : '8px',
    overflow: 'hidden',
    ...sizes[size],
    ...style
  };

  const Component = animated ? motion.div : 'div';
  const motionProps = animated ? {
    whileHover: { scale: 1.1, rotate: 5 },
    whileTap: { scale: 0.95 }
  } : {};

  if (src) {
    return (
      <Component style={iconStyle} {...motionProps} {...props}>
        <img 
          src={src} 
          alt={alt} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }} 
        />
      </Component>
    );
  }

  if (emoji) {
    return (
      <Component style={iconStyle} {...motionProps} {...props}>
        {emoji}
      </Component>
    );
  }

  return null;
};

export default Icon; 