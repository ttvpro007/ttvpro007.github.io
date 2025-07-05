import React from "react";
import { motion } from "framer-motion";

const ProgressBar = ({ 
  progress, 
  max = 100, 
  height = "12px",
  color = "var(--primary)",
  bgColor = "var(--text-secondary)",
  showLabel = false,
  label,
  animated = true,
  style = {},
  ...props 
}) => {
  const percentage = Math.min((progress / max) * 100, 100);
  
  const containerStyle = {
    width: '100%',
    height,
    background: bgColor,
    borderRadius: '6px',
    overflow: 'hidden',
    border: '1px solid var(--primary)',
    position: 'relative',
    ...style
  };

  const progressStyle = {
    height: '100%',
    background: color,
    borderRadius: '6px',
    position: 'relative'
  };

  const ProgressComponent = animated ? motion.div : 'div';
  const motionProps = animated ? {
    initial: { width: 0 },
    animate: { width: `${percentage}%` },
    transition: { duration: 1, ease: "easeOut" }
  } : { style: { width: `${percentage}%` } };

  return (
    <div style={{ width: '100%' }}>
      <div style={containerStyle} {...props}>
        <ProgressComponent
          style={progressStyle}
          {...motionProps}
        />
      </div>
      {showLabel && (
        <div style={{
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          marginTop: '0.25rem',
          textAlign: 'center'
        }}>
          {label || `${progress} / ${max}`}
        </div>
      )}
    </div>
  );
};

export default ProgressBar; 