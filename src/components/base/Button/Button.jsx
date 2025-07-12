import React from "react";
import { motion } from "framer-motion";
import { 
  AnimationCategories, 
  getAnimation 
} from "@/utils/animations";
import "./Button.css";

const Button = ({ 
  children, 
  variant = "primary", 
  size = "medium",
  fullWidth = false,
  disabled = false,
  className = "",
  onClick,
  hoverStrategy = "press",
  ...props 
}) => {
  // Build CSS classes
  const buttonClasses = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth && 'button--full-width',
    disabled && 'button--disabled',
    className
  ].filter(Boolean).join(' ');

  const motionProps = disabled ? {} : getAnimation(AnimationCategories.BUTTON, hoverStrategy);

  return (
    <motion.button
      className={buttonClasses}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button; 