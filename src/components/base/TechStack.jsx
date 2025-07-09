import React from "react";
import { Badge } from "./index";

const TechStack = ({ 
  tech, 
  maxDisplay = 4, 
  size = "small",
  style = {},
  badgeStyle = {},
  showCount = true,
  ...props 
}) => {
  const displayedTech = tech.slice(0, maxDisplay);
  const remainingCount = tech.length - maxDisplay;

  const defaultBadgeStyle = {
    background: "rgba(252, 148, 96, 0.1)",
    border: "1px solid rgba(252, 148, 96, 0.3)",
    color: "var(--primary)",
    fontWeight: "600",
    fontSize: "0.8rem",
    ...badgeStyle
  };

  return (
    <div 
      style={{
        display: "flex",
        gap: "0.5rem",
        flexWrap: "wrap",
        ...style
      }}
      {...props}
    >
      {displayedTech.map((techItem, index) => (
        <Badge 
          key={index} 
          size={size}
          style={defaultBadgeStyle}
        >
          {techItem}
        </Badge>
      ))}
      
      {showCount && remainingCount > 0 && (
        <Badge 
          size={size}
          style={defaultBadgeStyle}
        >
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
};

export default TechStack; 