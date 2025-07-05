import React from "react";
import { motion } from "framer-motion";
import { Card, Section } from "../components/base";
import { profile, projects } from "../data";

const Resume = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem"
      }}
    >
      <Section title="Resume" icon="📄" centered={true}>
        {/* Profile Section */}
        <Card style={{ marginBottom: "2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <img
              src={profile.personal.profilePic}
              alt={profile.personal.name}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                marginBottom: "1rem",
                border: "3px solid var(--primary)"
              }}
            />
            <h2 style={{ margin: "0 0 0.5rem 0", color: "var(--text)" }}>
              {profile.personal.name}
            </h2>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "1.1rem" }}>
              {profile.personal.tagline}
            </p>
          </div>
          
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "var(--text)", marginBottom: "1rem" }}>Skills</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {profile.skills.categories["Personal Skills"].map((skill, index) => (
                <div key={index} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{skill.icon}</div>
                  <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>{skill.name}</div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>{skill.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Projects Section */}
        <Card>
          <h3 style={{ color: "var(--text)", marginBottom: "1rem" }}>Projects</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {projects.resume.map((project, index) => (
              <div key={index} style={{ borderBottom: "1px solid var(--text-secondary)", paddingBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <h4 style={{ margin: 0, color: "var(--text)" }}>{project.title}</h4>
                  <span style={{ color: "var(--primary)", fontSize: "0.9rem" }}>{project.year}</span>
                </div>
                <p style={{ margin: "0 0 0.5rem 0", color: "var(--text-secondary)" }}>
                  {project.description}
                </p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      style={{
                        background: "var(--primary)",
                        color: "var(--card-bg)",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "12px",
                        fontSize: "0.8rem",
                        fontWeight: "bold"
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Section>
    </motion.div>
  );
};

export default Resume; 