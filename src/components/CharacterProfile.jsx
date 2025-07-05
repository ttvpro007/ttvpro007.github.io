import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function CharacterProfile({ profile }) {
  const [level, setLevel] = useState(5); // 5 years experience
  const [xp, setXp] = useState(0);
  const [maxXp] = useState(1000);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    // Simulate XP gain based on skills and projects
    const totalSkills = profile.skills.length;
    const skillXp = totalSkills * 100;
    const newXp = Math.min(skillXp, maxXp);
    setXp(newXp);
    // Check for level up
    if (newXp >= maxXp && !showLevelUp) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
  }, [profile.skills, maxXp, showLevelUp]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="character-profile"
      style={{
        background: 'var(--card-bg)',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow)',
        padding: "2rem",
        marginBottom: "2rem",
        position: "relative",
        overflow: "hidden",
        border: '2px solid var(--primary)'
      }}
    >
      {/* Glow effect */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: "linear-gradient(90deg, transparent, var(--primary), transparent)",
        animation: "glow 2s ease-in-out infinite alternate"
      }} />
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid var(--primary)",
            boxShadow: "0 0 20px var(--primary)"
          }}
        >
          <img
            src={profile.profilePic}
            alt="Character Avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </motion.div>
        {/* Character Info */}
        <div style={{ flex: 1 }}>
          <h2 style={{ 
            color: "var(--text)", 
            margin: "0 0 0.5rem 0",
            fontSize: "2rem",
            fontWeight: "bold",
            textShadow: "0 0 10px var(--primary)"
          }}>
            {profile.name}
          </h2>
          <p style={{ 
            color: "var(--text-secondary)", 
            margin: "0 0 1rem 0",
            fontSize: "1.1rem"
          }}>
            {profile.tagline}
          </p>
          {/* Level and XP Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              background: "var(--primary)",
              color: "var(--card-bg)",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              fontWeight: "bold",
              fontSize: "1.2rem",
              boxShadow: "0 4px 15px var(--primary)"
            }}>
              Level {level}
            </div>
            <div style={{ flex: 1, maxWidth: "300px" }}>
              <div style={{
                background: "var(--text-secondary)",
                height: "12px",
                borderRadius: "6px",
                overflow: "hidden",
                border: "1px solid var(--primary)"
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(xp / maxXp) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{
                    height: "100%",
                    background: "var(--primary)",
                    borderRadius: "6px"
                  }}
                />
              </div>
              <div style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                marginTop: "0.25rem",
                textAlign: "center"
              }}>
                {xp} / {maxXp} XP
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes glow {
          from { opacity: 0.5; }
          to { opacity: 1; }
        }
      `}</style>
      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.2, y: -50 }}
            transition={{ duration: 0.5, type: "spring" }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "var(--primary)",
              color: "var(--card-bg)",
              padding: "1rem 2rem",
              borderRadius: "20px",
              fontWeight: "bold",
              fontSize: "1.5rem",
              boxShadow: "0 0 30px var(--primary)",
              zIndex: 10,
              border: "3px solid var(--text)"
            }}
          >
            🎉 LEVEL UP! 🎉
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default CharacterProfile; 