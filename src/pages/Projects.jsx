import React, { useState } from "react";
import { motion } from "framer-motion";
import projects from "../data/projects.json";

const cardStyle = {
  marginBottom: '2rem',
  background: 'var(--card-bg)',
  borderRadius: '8px',
  boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
  padding: '1.25rem 1rem',
  border: '1px solid #e0e6ed',
  color: 'var(--text)',
  transition: 'transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s cubic-bezier(.4,2,.6,1)'
};

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const linkLabels = {
  github: "View on GitHub",
  itchio: "Play on itch.io",
  youtube: "Watch on YouTube",
  default: "View Project"
};

const techIconMap = {
  react: '/src/assets/react.svg',
  vite: '/vite.svg',
  unity: '/tech-icons/unity.png',
  csharp: '/tech-icons/c-sharp-c-seeklogo.png',
  html5: '/tech-icons/html5-seeklogo.png',
  javascript: '/tech-icons/javascript-seeklogo.png',
  unreal: '/tech-icons/unreal.svg',
  cpp: '/tech-icons/c-seeklogo.png',
  codewars: '/kenney_cursor-pack/Vector/Basic/target_round_a.svg',
};

export default function Projects() {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '50vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{
          background: 'var(--card-bg)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--shadow)',
          padding: '2.5rem 2rem',
          maxWidth: 600,
          width: '100%',
        }}
      >
        <h2>Projects</h2>
        <motion.ul
          style={{ listStyle: 'none', padding: 0, margin: 0 }}
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project, idx) => {
            const [isHovered, setIsHovered] = useState(false);
            return (
              <motion.li
                key={idx}
                className="project-card"
                style={{
                  ...cardStyle,
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'none',
                }}
                variants={cardVariants}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Animated background image */}
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: project.image ? `url(${project.image})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    zIndex: 0,
                    transition: 'transform 0.6s cubic-bezier(.4,2,.6,1)',
                  }}
                  animate={{ scale: isHovered ? 1.125 : 1 }}
                />
                {/* Overlay for readability */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'var(--card-overlay)',
                  zIndex: 1,
                  pointerEvents: 'none',
                }} />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary)' }}>{project.title}</h3>
                  <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text)' }}>{project.description}</p>
                  <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text)' }}>
                    <strong>Tech:</strong>
                    <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 8 }}>
                      {project.techIcons?.map(iconKey =>
                        techIconMap[iconKey] ? (
                          <img
                            key={iconKey}
                            src={techIconMap[iconKey]}
                            alt={iconKey}
                            title={iconKey.charAt(0).toUpperCase() + iconKey.slice(1)}
                            style={{ width: 22, height: 22, marginLeft: 4, verticalAlign: 'middle', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.10))' }}
                          />
                        ) : null
                      )}
                    </span>
                  </p>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                    {linkLabels[project.linkSource] || linkLabels.default}
                  </a>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </motion.div>
    </section>
  );
} 