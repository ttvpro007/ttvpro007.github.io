import React from "react";
import { motion } from "framer-motion";

const Grid = ({ 
  children, 
  columns = "auto-fit",
  minWidth = "300px",
  gap = "1.5rem",
  style = {},
  animated = true,
  staggerDelay = 0.1,
  ...props 
}) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(${minWidth}, 1fr))`,
    gap,
    ...style
  };

  const Component = animated ? motion.div : 'div';
  const motionProps = animated ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' }
  } : {};

  return (
    <Component style={gridStyle} {...motionProps} {...props}>
      {React.Children.map(children, (child, index) => {
        if (animated && React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            style: {
              ...child.props.style,
              animationDelay: `${index * staggerDelay}s`
            }
          });
        }
        return child;
      })}
    </Component>
  );
};

// Responsive grid variants
export const ResponsiveGrid = ({ children, ...props }) => (
  <Grid 
    columns="auto-fit" 
    minWidth="280px" 
    gap="1.5rem" 
    {...props}
  >
    {children}
  </Grid>
);

export const CardGrid = ({ children, ...props }) => (
  <Grid 
    columns="auto-fit" 
    minWidth="300px" 
    gap="2rem" 
    {...props}
  >
    {children}
  </Grid>
);

export const StatsGrid = ({ children, ...props }) => (
  <Grid 
    columns="auto-fit" 
    minWidth="200px" 
    gap="1rem" 
    {...props}
  >
    {children}
  </Grid>
);

export default Grid; 