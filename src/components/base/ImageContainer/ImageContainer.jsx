import React from "react";
import { motion } from "framer-motion";
import { 
  AnimationCategories, 
  getAnimation 
} from "@/utils/animations";
import "./ImageContainer.css";

const ImageContainer = ({ 
  src, 
  alt, 
  height = "medium",
  borderRadius = "rounded-md",
  objectFit = "cover",
  animation = "scaleFade",
  className = "",
  onClick,
  hover = false,
  loading = false,
  error = false,
  ...props 
}) => {
  const imageAnimation = getAnimation(AnimationCategories.ENTRY_EXIT, animation);
  const hoverAnimation = hover ? getAnimation(AnimationCategories.HOVER, 'scale') : {};

  // Build CSS classes
  const containerClasses = [
    'image-container',
    `image-container--${height}`,
    `image-container--${objectFit}`,
    `image-container--${borderRadius}`,
    onClick && 'image-container--clickable',
    hover && 'image-container--hover',
    loading && 'image-container--loading',
    error && 'image-container--error',
    className
  ].filter(Boolean).join(' ');

  const MotionComponent = hover || onClick ? motion.div : 'div';

  return (
    <MotionComponent
      className={containerClasses}
      onClick={onClick}
      {...imageAnimation}
      {...hoverAnimation}
      {...props}
    >
      {!error && (
        <img
          src={src}
          alt={alt}
        />
      )}
    </MotionComponent>
  );
};

export default ImageContainer; 