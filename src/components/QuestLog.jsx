import React from "react";
import { motion } from "framer-motion";

function QuestCard({ quest }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      style={{
        background: 'var(--card-bg)',
        borderRadius: "12px",
        padding: "1.5rem",
        border: "2px solid var(--primary)",
        boxShadow: "var(--shadow)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Quest header */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <div style={{
          background: "var(--primary)",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem"
        }}>
          {quest.icon}
        </div>
        <div>
          <h4 style={{ color: "var(--text)", margin: "0 0 0.25rem 0" }}>
            {quest.title}
          </h4>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {quest.year}
          </div>
        </div>
      </div>
      {/* Quest description */}
      <p style={{ color: "var(--text-secondary)", marginBottom: "1rem", lineHeight: "1.5" }}>
        {quest.description}
      </p>
      {/* Tech stack */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {quest.tech.map((tech, index) => (
          <span key={index} style={{
            background: "var(--primary)",
            color: "var(--card-bg)",
            padding: "0.25rem 0.75rem",
            borderRadius: "12px",
            fontSize: "0.8rem",
            fontWeight: "500"
          }}>
            {tech}
          </span>
        ))}
      </div>
      {/* Reward */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        color: "var(--primary)",
        fontSize: "0.9rem",
        fontWeight: "bold"
      }}>
        <span>🏆</span>
        <span>+{quest.xp} XP</span>
      </div>
    </motion.div>
  );
}

function QuestLog({ projects }) {
  const quests = projects.map(project => ({
    title: project.title,
    description: project.description,
    year: project.year,
    tech: project.tech,
    icon: "🎯",
    xp: Math.floor(Math.random() * 300) + 200 // Random XP between 200-500
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--card-bg)',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow)',
        padding: "2rem",
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
        📝 Quest Log
      </h3>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "1.5rem"
      }}>
        {quests.map((quest, index) => (
          <QuestCard key={index} quest={quest} />
        ))}
      </div>
    </motion.div>
  );
}

export default QuestLog; 