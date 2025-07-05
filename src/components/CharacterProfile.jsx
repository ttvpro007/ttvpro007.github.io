import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon, ProgressBar, Section } from "./base";
import { characterProfile } from "../data";

function CharacterProfile({ profile }) {
  const [level, setLevel] = useState(characterProfile.levelConfig.initialLevel);
  const [xp, setXp] = useState(0);
  const [maxXp] = useState(characterProfile.levelConfig.maxXp);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    // Simulate XP gain based on skills and projects
    const totalSkills = profile.skills.length;
    const skillXp = totalSkills * characterProfile.levelConfig.xpPerSkill;
    const newXp = Math.min(skillXp, maxXp);
    setXp(newXp);
    // Check for level up
    if (newXp >= maxXp && !showLevelUp) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), characterProfile.levelConfig.levelUpDuration);
    }
  }, [profile.skills, maxXp, showLevelUp]);

  return (
    <Section style={{ position: "relative", overflow: "hidden" }}>
      {/* Glow effect */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: "linear-gradient(90deg, transparent, var(--primary), transparent)",
        animation: `glow ${characterProfile.animations.glow.duration} ${characterProfile.animations.glow.timing} ${characterProfile.animations.glow.iteration}`
      }} />
      
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        {/* Avatar */}
        <Icon 
          src={profile.profilePic}
          alt="Character Avatar"
          size="xlarge"
          circular={true}
          animated={true}
          style={{
            border: "3px solid var(--primary)",
            boxShadow: "0 0 20px var(--primary)"
          }}
        />
        
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
              <ProgressBar 
                progress={xp} 
                max={maxXp} 
                showLabel={true}
                label={`${xp} / ${maxXp} XP`}
              />
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
            {characterProfile.levelConfig.levelUpMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

export default CharacterProfile; 