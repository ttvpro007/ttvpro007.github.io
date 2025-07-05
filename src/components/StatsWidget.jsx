import React from "react";
import { motion } from "framer-motion";
import { ProgressBar } from "./base";
import { projects } from "../data";

const StatsWidget = ({ projects: projectItems }) => {
  // Calculate tech usage statistics
  const techUsage = {};
  projectItems.forEach(project => {
    project.tech.forEach(tech => {
      techUsage[tech] = (techUsage[tech] || 0) + 1;
    });
  });

  const sortedTech = Object.entries(techUsage)
    .sort(([,a], [,b]) => b - a)
    .slice(0, projects.config.stats.maxTechDisplay);

  // Calculate yearly breakdown
  const yearlyBreakdown = {};
  projectItems.forEach(project => {
    yearlyBreakdown[project.year] = (yearlyBreakdown[project.year] || 0) + 1;
  });

  const sortedYears = Object.entries(yearlyBreakdown)
    .sort(([a], [b]) => parseInt(b) - parseInt(a));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      style={{
        textAlign: "center"
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          marginBottom: "3rem"
        }}
      >
        <div style={{
          fontSize: "3rem",
          marginBottom: "1rem"
        }}>
          📊
        </div>
        <h2 style={{
          color: "var(--text)",
          margin: 0,
          fontSize: "2.5rem",
          fontWeight: "bold",
          background: "linear-gradient(45deg, var(--primary), #FC9460)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          {projects.ui.statsWidget.title}
        </h2>
        <p style={{
          color: "var(--text-secondary)",
          fontSize: "1.1rem",
          marginTop: "0.5rem"
        }}>
          A glimpse into my development journey
        </p>
      </motion.div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        gap: "3rem",
        maxWidth: "1000px",
        margin: "0 auto"
      }}>
        {/* Tech Usage */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: "var(--card-bg)",
            borderRadius: "20px",
            padding: "2rem",
            border: "1px solid var(--border)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            transform: "rotate(-1deg)"
          }}
        >
          <h3 style={{ 
            color: "var(--text)", 
            marginBottom: "1.5rem",
            fontSize: "1.3rem",
            fontWeight: "bold"
          }}>
            {projects.ui.statsWidget.sections.techUsage.title}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {sortedTech.map(([tech, count], index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div style={{ 
                  minWidth: "80px",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  color: "var(--text)"
                }}>
                  {tech}
                </div>
                <div style={{ flex: 1 }}>
                  <ProgressBar 
                    progress={count} 
                    max={Math.max(...sortedTech.map(([,c]) => c))}
                    height="12px"
                    color="var(--primary)"
                  />
                </div>
                <div style={{ 
                  minWidth: "40px",
                  textAlign: "right",
                  fontSize: "1rem",
                  color: "var(--primary)",
                  fontWeight: "bold"
                }}>
                  {count}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Yearly Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: "var(--card-bg)",
            borderRadius: "20px",
            padding: "2rem",
            border: "1px solid var(--border)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            transform: "rotate(1deg)"
          }}
        >
          <h3 style={{ 
            color: "var(--text)", 
            marginBottom: "1.5rem",
            fontSize: "1.3rem",
            fontWeight: "bold"
          }}>
            {projects.ui.statsWidget.sections.yearlyBreakdown.title}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {sortedYears.map(([year, count], index) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div style={{ 
                  minWidth: "80px",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  color: "var(--text)"
                }}>
                  {year}
                </div>
                <div style={{ flex: 1 }}>
                  <ProgressBar 
                    progress={count} 
                    max={Math.max(...sortedYears.map(([,c]) => c))}
                    height="12px"
                    color="var(--primary)"
                  />
                </div>
                <div style={{ 
                  minWidth: "40px",
                  textAlign: "right",
                  fontSize: "1rem",
                  color: "var(--primary)",
                  fontWeight: "bold"
                }}>
                  {count}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StatsWidget; 