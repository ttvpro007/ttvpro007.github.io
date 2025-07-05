import React from "react";
import { motion } from "framer-motion";
import { Icon, Section } from "./base";

function AchievementBadge({ achievement }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 5 }}
      style={{
        position: "relative",
        cursor: "pointer"
      }}
      title={achievement.story}
    >
      <Icon 
        emoji={achievement.icon} 
        size="xlarge" 
        circular={true}
        animated={true}
        style={{
          background: "var(--primary)",
          boxShadow: "0 8px 25px var(--primary)",
          border: "3px solid var(--text)"
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "var(--card-bg)",
          color: "var(--text)",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          fontSize: "0.8rem",
          whiteSpace: "nowrap",
          zIndex: 10,
          border: "1px solid var(--primary)"
        }}
      >
        {achievement.story}
      </motion.div>
    </motion.div>
  );
}

function Achievements() {
  const achievements = [
    {
      icon: "🎮",
      story: "Published multiple games on itch.io"
    },
    {
      icon: "🖨️",
      story: "Printed 20+ miniatures in 2024"
    },
    {
      icon: "⌨️",
      story: "Built custom mechanical keyboard"
    },
    {
      icon: "💻",
      story: "Solved 100+ coding problems"
    }
  ];

  return (
    <Section title="Achievements" icon="🏆" centered={true}>
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "2rem",
        flexWrap: "wrap"
      }}>
        {achievements.map((achievement, index) => (
          <AchievementBadge key={index} achievement={achievement} />
        ))}
      </div>
    </Section>
  );
}

export default Achievements; 