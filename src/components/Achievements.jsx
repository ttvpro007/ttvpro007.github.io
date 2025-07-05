import React from "react";
import { motion } from "framer-motion";

function AchievementBadge({ achievement }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 5 }}
      style={{
        background: "var(--primary)",
        borderRadius: "50%",
        width: "80px",
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "2rem",
        boxShadow: "0 8px 25px var(--primary)",
        border: "3px solid var(--text)",
        position: "relative",
        cursor: "pointer"
      }}
      title={achievement.story}
    >
      {achievement.icon}
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--card-bg)',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow)',
        padding: "2rem",
        marginBottom: "2rem",
        border: "2px solid var(--primary)"
      }}
    >
      <h3 style={{ 
        color: "var(--text)", 
        marginBottom: "1.5rem",
        fontSize: "1.5rem",
        textAlign: "center",
        textShadow: "0 0 10px var(--primary)"
      }}>
        🏆 Achievements
      </h3>
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
    </motion.div>
  );
}

export default Achievements; 