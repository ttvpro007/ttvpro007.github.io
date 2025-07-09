import React from "react";
import { motion } from "framer-motion";
import { 
  AnimationCategories, 
  getAnimation 
} from "../../utils/animations";

const ImageContainer = ({ 
  src, 
  alt, 
  height = "200px",
  borderRadius = "var(--border-radius)",
  objectFit = "cover",
  animation = "scaleFade",
  className = "",
  style = {},
  onClick,
  hover = false,
  ...props 
}) => {
  const imageAnimation = getAnimation(AnimationCategories.ENTRY_EXIT, animation);
  const hoverAnimation = hover ? getAnimation(AnimationCategories.HOVER, 'scale') : {};

  const containerStyle = {
    position: "relative",
    overflow: "hidden",
    borderRadius,
    cursor: onClick ? "pointer" : "default",
    ...style
  };

  const imageStyle = {
    width: "100%",
    height,
    objectFit,
    borderRadius
  };

  const MotionComponent = hover || onClick ? motion.div : 'div';

  return (
    <MotionComponent
      style={containerStyle}
      className={className}
      onClick={onClick}
      {...imageAnimation}
      {...hoverAnimation}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        style={imageStyle}
      />
    </MotionComponent>
  );
};

export default ImageContainer; 