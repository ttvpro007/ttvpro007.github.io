import React from "react";

const YearBadge = ({ 
  year, 
  size = "medium",
  style = {},
  ...props 
}) => {
  const sizeStyles = {
    small: {
      padding: "0.2rem 0.4rem",
      fontSize: "0.65rem"
    },
    medium: {
      padding: "0.25rem 0.5rem",
      fontSize: "0.75rem"
    },
    large: {
      padding: "0.3rem 0.6rem",
      fontSize: "0.85rem"
    }
  };

  const badgeStyle = {
    background: "var(--primary)",
    color: "white",
    borderRadius: "16px",
    fontWeight: "bold",
    border: "2px solid var(--primary)",
    boxShadow: "0 2px 8px rgba(252, 148, 96, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2)",
    ...sizeStyles[size],
    ...style
  };

  return (
    <div style={badgeStyle} {...props}>
      {year}
    </div>
  );
};

export default YearBadge; 