import React from "react";
import { Card, Icon } from "./index";

const ContentCard = ({ 
  title,
  description,
  icon,
  children,
  titleSize = "medium",
  showIcon = true,
  iconSize = "small",
  style = {},
  titleStyle = {},
  descriptionStyle = {},
  ...cardProps 
}) => {
  const titleSizes = {
    small: "1.1rem",
    medium: "1.3rem",
    large: "1.5rem"
  };

  const defaultTitleStyle = {
    color: "var(--text)",
    margin: 0,
    fontSize: titleSizes[titleSize],
    fontWeight: "bold",
    textShadow: "0 1px 2px rgba(0,0,0,0.1)",
    lineHeight: "1.2",
    ...titleStyle
  };

  const defaultDescriptionStyle = {
    color: "var(--text-secondary)",
    margin: "0.75rem 0 1.25rem 0",
    fontSize: "0.9rem",
    lineHeight: "1.6",
    textShadow: "0 1px 1px rgba(0,0,0,0.05)",
    ...descriptionStyle
  };

  return (
    <Card style={style} {...cardProps}>
      {/* Title with Icon */}
      {title && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "0.75rem"
        }}>
          {showIcon && icon && (
            <div style={{
              width: titleSize === 'small' ? "6px" : "8px",
              height: titleSize === 'small' ? "6px" : "8px",
              background: "var(--primary)",
              borderRadius: "50%",
              boxShadow: "0 0 10px var(--primary)"
            }} />
          )}
          <h3 style={defaultTitleStyle}>
            {title}
          </h3>
        </div>
      )}

      {/* Description */}
      {description && (
        <p style={defaultDescriptionStyle}>
          {description}
        </p>
      )}

      {/* Children content */}
      {children}
    </Card>
  );
};

export default ContentCard; 