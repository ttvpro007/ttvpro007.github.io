import React from "react";
import { motion } from "framer-motion";

export default function About() {
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
          maxWidth: 480,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <h2>About Me</h2>
        <p>This is a short bio. Update this section with your background, skills, and interests.</p>
      </motion.div>
      <div style={{background:'#eee',padding:'1rem',marginTop:'2rem',textAlign:'center',borderRadius:'8px',maxWidth:400}}>
        <strong>About Page Placeholder</strong>
      </div>
    </section>
  );
} 