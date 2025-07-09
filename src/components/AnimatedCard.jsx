import React from "react";
import { AnimatedContainer } from "./base";
import { AnimationCategories } from "../utils/animations";

const AnimatedCard = ({ 
  children, 
  entryStrategy = "scaleFade",
  hoverStrategy = "hover",
  className = "",
  style = {}
}) => {
  return (
    <AnimatedContainer
      entryStrategy={entryStrategy}
      hoverStrategy={hoverStrategy}
      category={AnimationCategories.CARD}
      className={className}
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, rgba(252, 148, 96, 0.05) 100%)",
        border: "2px solid #333",
        borderRadius: "15px",
        padding: "1.5rem",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
        backdropFilter: "blur(10px)",
        cursor: "pointer",
        ...style
      }}
    >
      {children}
    </AnimatedContainer>
  );
};

// Example usage component
export const AnimationExamples = () => {
  return (
    <div style={{ padding: "2rem", display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
      {/* Card with different entry animations */}
      <AnimatedCard entryStrategy="scaleFade">
        <h3>Scale Fade Entry</h3>
        <p>This card uses the scaleFade entry animation.</p>
      </AnimatedCard>

      <AnimatedCard entryStrategy="slideFade">
        <h3>Slide Fade Entry</h3>
        <p>This card uses the slideFade entry animation.</p>
      </AnimatedCard>

      <AnimatedCard entryStrategy="bouncePop">
        <h3>Bounce Pop Entry</h3>
        <p>This card uses the bouncePop entry animation.</p>
      </AnimatedCard>

      <AnimatedCard entryStrategy="flipRotate">
        <h3>Flip Rotate Entry</h3>
        <p>This card uses the flipRotate entry animation.</p>
      </AnimatedCard>

      <AnimatedCard entryStrategy="zoomIn">
        <h3>Zoom In Entry</h3>
        <p>This card uses the zoomIn entry animation.</p>
      </AnimatedCard>

      <AnimatedCard entryStrategy="slideUp">
        <h3>Slide Up Entry</h3>
        <p>This card uses the slideUp entry animation.</p>
      </AnimatedCard>
    </div>
  );
};

export default AnimatedCard; 