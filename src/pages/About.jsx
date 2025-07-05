import React from "react";
import { motion } from "framer-motion";
import InteractiveGrid from "../components/InteractiveGrid";
import AnimatedSkillBars from "../components/AnimatedSkillBars";
import aboutContent from "../data/aboutContent.json";

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
          maxWidth: 800,
          width: '100%',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>{aboutContent.title}</h2>
        <p style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
          {aboutContent.bio}
        </p>
        
        <InteractiveGrid />
        <AnimatedSkillBars />
      </motion.div>
    </section>
  );
} 