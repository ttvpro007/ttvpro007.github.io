import React from "react";
import { 
  AnimatedContainer, 
  ProjectCardBase, 
  AnimatedCard,
  Card 
} from "./base";
import { AnimationCategories } from "../utils/animations";

// Test data
const testProject = {
  title: "Test Project",
  description: "This is a test project to verify animations are working correctly.",
  image: "https://via.placeholder.com/300x200",
  tech: ["React", "JavaScript", "CSS"],
  year: "2024"
};

const AnimationTest = () => {
  return (
    <div style={{ padding: "2rem", display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
      <h2>Animation System Test</h2>
      
      {/* Test AnimatedContainer with HOVER category */}
      <AnimatedContainer
        entryStrategy="scaleFade"
        hoverStrategy="lift"
        style={{
          background: "var(--card-bg)",
          padding: "1rem",
          border: "2px solid var(--primary)",
          borderRadius: "var(--border-radius)"
        }}
      >
        <h3>AnimatedContainer (HOVER)</h3>
        <p>This should use lift animation from HOVER category</p>
      </AnimatedContainer>

      {/* Test AnimatedContainer with CARD category */}
      <AnimatedContainer
        entryStrategy="scaleFade"
        hoverStrategy="hover"
        category={AnimationCategories.CARD}
        style={{
          background: "var(--card-bg)",
          padding: "1rem",
          border: "2px solid var(--primary)",
          borderRadius: "var(--border-radius)"
        }}
      >
        <h3>AnimatedContainer (CARD)</h3>
        <p>This should use hover animation from CARD category</p>
      </AnimatedContainer>

      {/* Test ProjectCardBase */}
      <ProjectCardBase
        project={testProject}
        size="medium"
        entryStrategy="scaleFade"
        hoverStrategy="hover"
      />

      {/* Test AnimatedCard */}
      <AnimatedCard
        entryStrategy="scaleFade"
        hoverStrategy="hover"
      >
        <h3>AnimatedCard</h3>
        <p>This should use hover animation from CARD category</p>
      </AnimatedCard>

      {/* Test base Card */}
      <Card
        hover={true}
        hoverStrategy="hover"
        style={{ padding: "1rem" }}
      >
        <h3>Base Card</h3>
        <p>This should use hover animation from CARD category</p>
      </Card>
    </div>
  );
};

export default AnimationTest; 