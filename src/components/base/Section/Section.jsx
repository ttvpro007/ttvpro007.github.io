import React from "react";
import { motion } from "framer-motion";
import "./Section.css";

const Section = ({ 
  title, 
  subtitle,
  icon,
  children, 
  centered = false,
  padding = "2rem",
  marginBottom = "2rem",
  style = {},
  className = "",
  ...props 
}) => {
  const sectionStyle = {
    padding,
    marginBottom,
    ...style
  };

  const headerClassName = `section-header ${centered ? 'centered' : 'left-aligned'}`;
  const titleClassName = `section-title ${centered ? 'centered' : 'left-aligned'}`;
  const containerClassName = `section-container ${className}`.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={containerClassName}
      style={sectionStyle}
      {...props}
    >
      {title && (
        <div className={headerClassName}>
          <h3 className={titleClassName}>
            {icon && <span>{icon}</span>}
            {title}
          </h3>
          {subtitle && (
            <p className="section-subtitle">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default Section; 