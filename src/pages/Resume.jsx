import React from "react";
import { motion } from "framer-motion";
import { Card, ProgressBar } from "../components/base";
import { profile, projects } from "../data";

const Resume = () => {
  // Use consolidated project data
  const resumeProjects = projects.items
    .filter(p => p.showOnResume)
    .sort((a, b) => (a.resumeOrder || 0) - (b.resumeOrder || 0));

  return (
    <main>
      <div className="body-panel">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            margin: "0 auto",
            width: "100%"
          }}
        >
          {/* Profile Section */}
          <Card style={{ marginBottom: "2rem" }}>
            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              <img
                src={profile.personal.profilePic}
                alt={profile.personal.name}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  marginBottom: "0.75rem",
                  border: "3px solid var(--primary)"
                }}
              />
              <h2 className="header-2" style={{ margin: "0 0 0.4rem 0", color: "var(--text)" }}>
                {profile.personal.name}
              </h2>
              <p className="body-text" style={{ margin: 0, color: "var(--text-secondary)" }}>
                {profile.personal.tagline}
              </p>
            </div>
            
            {/* All Skills Section (all categories, concise version) */}
            <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
              <h3 className="header-3" style={{ color: "var(--text)", marginBottom: "0.5rem", textAlign: 'center', fontSize: '1.1rem' }}>Skills</h3>
              {profile.skills && profile.skills.categories && Object.entries(profile.skills.categories).map(([categoryName, categoryData], categoryIndex) => (
                <div key={categoryIndex} style={{ marginBottom: categoryIndex !== Object.keys(profile.skills.categories).length - 1 ? '1rem' : 0 }}>
                  <h4 style={{
                    textAlign: 'center',
                    marginBottom: '0.25rem',
                    color: 'var(--primary)',
                    fontSize: '0.98rem',
                    fontWeight: 600
                  }}>{categoryName}</h4>
                  {categoryData.skills.map((skill, skillIndex) => {
                    // Concise skill bar: no description, smaller bar, tighter spacing
                    const percent = skill.level || skill.percentage;
                    return (
                      <div key={skillIndex} style={{ marginBottom: '0.5rem', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.15rem' }}>
                          <span style={{ marginRight: '0.4rem', fontSize: '1rem' }}>{skill.icon}</span>
                          <span style={{ fontWeight: 500, fontSize: '0.98rem', marginRight: 'auto' }}>{skill.name}</span>
                          <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>{percent}%</span>
                        </div>
                        <div style={{ width: '100%' }}>
                          <ProgressBar
                            progress={percent}
                            max={100}
                            height="7px"
                            color={skill.color || (skill.theme === 'filament' ? 'linear-gradient(90deg, #ff6b6b, #4ecdc4)' : skill.theme === 'switch' ? 'linear-gradient(90deg, #a8e6cf, #dcedc1)' : skill.theme === 'shavings' ? 'linear-gradient(90deg, #8b4513, #d2691e)' : skill.theme === 'rocket' ? 'linear-gradient(90deg, #667eea, #764ba2)' : 'var(--primary)')}
                            bgColor="#222"
                            glow={true}
                            animatedGradient={skill.theme === 'filament' || skill.theme === 'switch' || skill.theme === 'shavings' || skill.theme === 'rocket'}
                            animated={true}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </Card>

          {/* Projects Section */}
          <Card style={{ padding: "1.5rem 1rem" }}>
            <h3 className="header-3" style={{ color: "var(--text)", marginBottom: "0.7rem", fontSize: '1.1rem', textAlign: 'center' }}>Projects</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              {resumeProjects.map((project, index) => (
                <div key={index} style={{ borderBottom: index !== resumeProjects.length - 1 ? "1px solid var(--text-secondary)" : "none", paddingBottom: "0.7rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.2rem" }}>
                    <h4 style={{ margin: 0, color: "var(--text)", fontSize: "0.98rem", fontWeight: 600 }}>{project.title}</h4>
                    <span className="small-text" style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 500 }}>{project.year}</span>
                  </div>
                  <p className="body-text" style={{ margin: "0 0 0.2rem 0", color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.4 }}>
                    {project.longDescription}
                  </p>
                  <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="xsmall-text"
                        style={{
                          background: "var(--primary)",
                          color: "var(--card-bg)",
                          padding: "0.13rem 0.38rem",
                          borderRadius: "10px",
                          fontWeight: "bold",
                          fontSize: "0.78rem"
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
        </motion.div>
      </div>
    </main>
  );
};

export default Resume; 