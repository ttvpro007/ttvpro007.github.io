import React from "react";
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
          {projects.map((project, idx) => (
            <motion.li
              key={idx}
              className="project-card"
              style={cardStyle}
              variants={cardVariants}
              whileHover={{ scale: 1.03, boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = cardStyle.boxShadow;
              }}
            >
              <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary)' }}>{project.title}</h3>
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text)' }}>{project.description}</p>
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text)' }}><strong>Tech:</strong> {project.tech.join(", ")}</p>
              <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>View on GitHub</a>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
      <div style={{background:'#eee',padding:'1rem',marginTop:'2rem',textAlign:'center',borderRadius:'8px',maxWidth:400}}>
        <strong>Projects Page Placeholder</strong>
      </div>
    </section>
  );
} 