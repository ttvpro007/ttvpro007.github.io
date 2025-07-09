import React from "react";
import { motion } from "framer-motion";
import { 
  AnimationCategories, 
  getAnimation 
} from "../../utils/animations";

const AnimatedContainer = ({ 
  children,
  entryStrategy = "scaleFade",
  hoverStrategy = "lift",
  category = AnimationCategories.ENTRY_EXIT,
  className = "",
  style = {},
  onClick,
  cursor = "default",
  ...props 
}) => {
  // Entry animations should always come from ENTRY_EXIT category
  const entryAnimation = getAnimation(AnimationCategories.ENTRY_EXIT, entryStrategy);
  
  // Use CARD category for hover if the component is card-like, otherwise use HOVER category
  const hoverCategory = category === AnimationCategories.CARD ? AnimationCategories.CARD : AnimationCategories.HOVER;
  const hoverAnimation = getAnimation(hoverCategory, hoverStrategy);

  const containerStyle = {
    cursor: onClick ? "pointer" : cursor,
    ...style
  };

  return (
    <motion.div
      {...entryAnimation}
      {...hoverAnimation}
      className={className}
      style={containerStyle}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer; 