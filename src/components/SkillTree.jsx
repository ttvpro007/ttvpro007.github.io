import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function SkillTreeNode({ skill, isUnlocked, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        cursor: "pointer",
        padding: "1rem",
        borderRadius: "12px",
        background: isUnlocked 
          ? "var(--primary)" 
          : "var(--text-secondary)",
        border: isUnlocked ? "2px solid var(--primary)" : "2px solid var(--text-secondary)",
        boxShadow: isUnlocked 
          ? "0 8px 25px var(--primary)" 
          : "0 4px 15px rgba(0, 0, 0, 0.3)",
        transition: "all 0.3s ease",
        position: "relative"
      }}
    >
      <div style={{
        fontSize: "2rem",
        filter: isUnlocked ? "none" : "grayscale(100%)"
      }}>
        {skill.icon}
      </div>
      <div style={{
        textAlign: "center",
        color: isUnlocked ? "var(--card-bg)" : "var(--text-secondary)"
      }}>
        <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
          {skill.name}
        </div>
        <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
          {skill.percentage}%
        </div>
      </div>
      {!isUnlocked && (
        <div style={{
          position: "absolute",
          top: "0.5rem",
          right: "0.5rem",
          fontSize: "1.2rem"
        }}>
          🔒
        </div>
      )}
      {isUnlocked && (
        <motion.div
          animate={{ 
            boxShadow: [
              "0 0 0 var(--primary)",
              "0 0 20px var(--primary)",
              "0 0 0 var(--primary)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: "absolute",
            top: "-2px",
            left: "-2px",
            right: "-2px",
            bottom: "-2px",
            borderRadius: "12px",
            pointerEvents: "none"
          }}
        />
      )}
    </motion.div>
  );
}

function SkillTree({ skills }) {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [unlockedSkills, setUnlockedSkills] = useState(3); // First 3 skills unlocked

  const handleSkillClick = (skill, index) => {
    if (index < unlockedSkills) {
      setSelectedSkill(skill);
    }
  };

  const unlockNextSkill = () => {
    if (unlockedSkills < skills.length) {
      setUnlockedSkills(prev => prev + 1);
    }
  };

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
        🌳 Skill Tree
      </h3>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "1.5rem",
        marginBottom: "2rem"
      }}>
        {skills.map((skill, index) => (
          <SkillTreeNode
            key={skill.name}
            skill={skill}
            isUnlocked={index < unlockedSkills}
            onClick={() => handleSkillClick(skill, index)}
          />
        ))}
      </div>
      {/* Skill Details */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              background: "var(--card-bg)",
              borderRadius: "12px",
              padding: "1.5rem",
              border: "1px solid var(--primary)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "2rem" }}>{selectedSkill.icon}</span>
              <div>
                <h4 style={{ color: "var(--text)", margin: "0 0 0.5rem 0" }}>
                  {selectedSkill.name}
                </h4>
                <div style={{ color: "var(--text-secondary)" }}>
                  {selectedSkill.description}
                </div>
              </div>
            </div>
            <div style={{
              background: "var(--text-secondary)",
              height: "8px",
              borderRadius: "4px",
              overflow: "hidden"
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${selectedSkill.percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                  height: "100%",
                  background: "var(--primary)",
                  borderRadius: "4px"
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Unlock More Skills Button */}
      {unlockedSkills < skills.length && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={unlockNextSkill}
          style={{
            background: "var(--primary)",
            color: "var(--card-bg)",
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "25px",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
            display: "block",
            margin: "0 auto",
            boxShadow: "0 4px 15px var(--primary)"
          }}
        >
          🔓 Unlock Next Skill
        </motion.button>
      )}
    </motion.div>
  );
}

export default SkillTree; 