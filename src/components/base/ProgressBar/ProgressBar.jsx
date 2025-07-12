import React from "react";
import { motion } from "framer-motion";
import { 
  AnimationCategories, 
  getAnimation 
} from "@/utils/animations";

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
  animationStrategy = "fill",
  glow = false,
  animatedGradient = false,
  ...props 
}) => {
  const percentage = Math.min((progress / max) * 100, 100);
  
  const isGradient = typeof color === 'string' && color.includes('gradient');

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
    borderRadius: '6px',
    position: 'relative',
    boxShadow: glow ? `0 0 12px 2px var(--primary), 0 0 24px 4px ${isGradient ? 'rgba(252,148,96,0.4)' : 'var(--primary)'}` : undefined,
    transition: animatedGradient ? 'background-position 1.5s linear' : undefined,
    ...(isGradient
      ? {
          backgroundImage: color,
          backgroundSize: animatedGradient ? '200% 100%' : '100% 100%',
          backgroundPosition: animatedGradient ? '0% 50%' : '0% 0%',
          backgroundColor: undefined,
        }
      : {
          backgroundImage: undefined,
          backgroundSize: undefined,
          backgroundPosition: undefined,
          backgroundColor: color,
        }
    )
  };

  // For animated gradient, animate backgroundPosition
  const ProgressComponent = animated ? motion.div : 'div';
  const motionProps = animated ? {
    ...getAnimation(AnimationCategories.PROGRESS, animationStrategy),
    animate: { 
      ...getAnimation(AnimationCategories.PROGRESS, animationStrategy).animate,
      width: `${percentage}%`,
      ...(animatedGradient && isGradient ? { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] } : {})
    },
    transition: {
      ...getAnimation(AnimationCategories.PROGRESS, animationStrategy).transition,
      ...(animatedGradient && isGradient ? { backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" } } : {})
    }
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