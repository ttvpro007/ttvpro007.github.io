import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, Section } from "./base";
import { profile } from "../data";

const InteractiveGrid = () => {
  const [selectedSection, setSelectedSection] = useState(null);

  return (
    <Section title="What I Do" icon="🎯" centered={true}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "2rem"
      }}>
        {Object.entries(profile.skills.categories).map(([categoryName, categoryData], index) => (
          <motion.div
            key={categoryName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card
              hover={true}
              onClick={() => setSelectedSection(selectedSection === index ? null : index)}
              style={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: selectedSection === index ? "2px solid var(--primary)" : "2px solid transparent"
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <h3 style={{
                  color: "var(--text)",
                  margin: "0 0 1rem 0",
                  fontSize: "1.3rem",
                  fontWeight: "bold"
                }}>
                  {categoryName}
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {categoryData.skills.map((skill, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + itemIndex * 0.05 }}
                    style={{
                      padding: "0.75rem",
                      background: "var(--bg)",
                      borderRadius: "8px",
                      border: "1px solid var(--border)"
                    }}
                  >
                    <p style={{
                      margin: 0,
                      color: "var(--text-secondary)",
                      lineHeight: "1.5",
                      fontSize: "0.95rem"
                    }}>
                      {skill.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Highlights */}
              {selectedSection === index && categoryData.highlights && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    background: "var(--primary)",
                    borderRadius: "8px",
                    color: "var(--card-bg)"
                  }}
                >
                  <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>
                    Key Highlights:
                  </h4>
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem"
                  }}>
                    {categoryData.highlights.map((highlight, highlightIndex) => (
                      <span
                        key={highlightIndex}
                        style={{
                          background: "rgba(255, 255, 255, 0.2)",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "12px",
                          fontSize: "0.8rem",
                          fontWeight: "bold"
                        }}
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default InteractiveGrid; 