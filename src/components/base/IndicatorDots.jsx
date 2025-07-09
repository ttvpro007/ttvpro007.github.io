import React from "react";
import { motion } from "framer-motion";
import { 
  AnimationCategories, 
  getAnimation 
} from "../../utils/animations";

const IndicatorDots = ({ 
  count, 
  currentIndex, 
  onDotClick,
  size = "12px",
  activeColor = "var(--primary)",
  inactiveColor = "var(--text-muted)",
  style = {},
  ...props 
}) => {
  const buttonAnimation = getAnimation(AnimationCategories.BUTTON, 'press');

  const dotStyle = {
    width: size,
    height: size,
    aspectRatio: '1 / 1',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    boxSizing: 'border-box',
  };

  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
        ...style
      }}
      {...props}
    >
      {Array.from({ length: count }, (_, index) => (
        <motion.button
          key={index}
          onClick={() => onDotClick(index)}
          style={{
            ...dotStyle,
            background: index === currentIndex ? activeColor : inactiveColor,
          }}
          {...buttonAnimation}
        />
      ))}
    </div>
  );
};

export default IndicatorDots; 