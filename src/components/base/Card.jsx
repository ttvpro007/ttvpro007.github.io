import React from "react";
import { motion } from "framer-motion";
import { 
  AnimationCategories, 
  getAnimation 
} from "../../utils/animations";

const Card = ({ 
  children, 
  className = "", 
  style = {}, 
  hover = true, 
  border = true,
  shadow = true,
  padding = "1.5rem",
  onClick,
  hoverStrategy = "hover",
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
  const motionProps = hover ? getAnimation(AnimationCategories.CARD, hoverStrategy) : {};

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