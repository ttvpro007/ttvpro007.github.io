import React from "react";
import { motion } from "framer-motion";
import { Card, Section } from "./base";
import { profile } from "../data";

const AnimatedSkillBars = () => {
  return (
    <Section title="Skills & Expertise" icon="⚡" centered={true}>
      {Object.entries(profile.skills.categories).map(([category, skills]) => (
        <Card key={category} style={{ marginBottom: "2rem" }}>
          <h3 style={{ 
            color: "var(--text)", 
            marginBottom: "1.5rem", 
            textAlign: "center",
            fontSize: "1.3rem"
          }}>
            {category}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  background: "var(--bg)"
                }}
              >
                <div style={{ fontSize: "1.5rem", minWidth: "40px" }}>
                  {skill.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    marginBottom: "0.25rem" 
                  }}>
                    <span style={{ fontWeight: "bold", color: "var(--text)" }}>
                      {skill.name}
                    </span>
                    <span style={{ color: "var(--primary)", fontWeight: "bold" }}>
                      {skill.level || skill.percentage}%
                    </span>
                  </div>
                  <div style={{ 
                    background: "var(--text-secondary)", 
                    height: "8px", 
                    borderRadius: "4px",
                    overflow: "hidden"
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level || skill.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      style={{
                        height: "100%",
                        background: skill.color || "var(--primary)",
                        borderRadius: "4px"
                      }}
                    />
                  </div>
                  <p style={{ 
                    margin: "0.25rem 0 0 0", 
                    fontSize: "0.9rem", 
                    color: "var(--text-secondary)" 
                  }}>
                    {skill.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      ))}
    </Section>
  );
};

export default AnimatedSkillBars; 