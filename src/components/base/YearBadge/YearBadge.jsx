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
      fontSize: "var(--font-size-xs)"
    },
    medium: {
      padding: "0.25rem 0.5rem",
      fontSize: "var(--font-size-sm)"
    },
    large: {
      padding: "0.3rem 0.6rem",
      fontSize: "var(--font-size-base)"
    }
  };

  const badgeStyle = {
    background: "var(--color-primary)",
    color: "white",
    borderRadius: "16px",
    fontWeight: "var(--font-weight-bold)",
    border: "2px solid var(--color-primary)",
    boxShadow: "0 2px 8px color-mix(in srgb, var(--color-secondary) 40%, transparent), 0 1px 3px rgba(0, 0, 0, 0.2)",
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