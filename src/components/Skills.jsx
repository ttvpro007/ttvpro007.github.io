import React from "react";
import { motion } from "framer-motion";
import SkillBar from "./SkillBar";
import profile from '../data/profile.json';

const Skills = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      style={{
        background: 'var(--card-bg)',
        borderRadius: 'var(--border-radius)',
        padding: '2rem',
        boxShadow: 'var(--shadow)',
        maxWidth: '600px',
        width: '100%',
      }}
    >
      <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', textAlign: 'center' }}>Skills & Crafts</h3>
      {profile.skills.map((skill, index) => (
        <SkillBar key={index} skill={skill} index={index} />
      ))}
    </motion.div>
  );
};

export default Skills; 