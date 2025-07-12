import React from "react";
import Badge from "../Badge";

const TechStack = ({ 
  tech, 
  maxDisplay = 4, 
  size = "small",
  style = {},
  className = "",
  showCount = true,
  ...props 
}) => {
  const displayedTech = tech.slice(0, maxDisplay);
  const remainingCount = tech.length - maxDisplay;

  return (
    <div 
      style={{
        display: "flex",
        gap: "0.5rem",
        flexWrap: "wrap",
        ...style
      }}
      className={className}
      {...props}
    >
      {displayedTech.map((techItem, index) => (
        <Badge 
          key={index} 
          size={size}
          variant="ghost"
        >
          {techItem}
        </Badge>
      ))}
      
      {showCount && remainingCount > 0 && (
        <Badge 
          size={size}
          variant="ghost"
        >
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
};

export default TechStack; 