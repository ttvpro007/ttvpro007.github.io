import React from "react";
import { motion } from "framer-motion";
import { 
  AnimationCategories, 
  getAnimation 
} from "../../../utils/animations";
import "./AnimatedContainer.css";

const AnimatedContainer = ({ 
  children,
  entryStrategy = "scaleFade",
  hoverStrategy = "lift",
  category = AnimationCategories.ENTRY_EXIT,
  className = "",
  style = {},
  onClick,
  disabled = false,
  loading = false,
  ...props 
}) => {
  // Entry animations should always come from ENTRY_EXIT category
  const entryAnimation = getAnimation(AnimationCategories.ENTRY_EXIT, entryStrategy);
  
  // Use CARD category for hover if the component is card-like, otherwise use HOVER category
  const hoverCategory = category === AnimationCategories.CARD ? AnimationCategories.CARD : AnimationCategories.HOVER;
  const hoverAnimation = getAnimation(hoverCategory, hoverStrategy);

  // Build CSS classes
  const containerClasses = [
    'animated-container',
    onClick && !disabled ? 'animated-container--clickable' : 'animated-container--default',
    disabled && 'animated-container--disabled',
    loading && 'animated-container--loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      {...entryAnimation}
      {...hoverAnimation}
      className={containerClasses}
      style={style}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer; 