import React from "react";
import { motion } from "framer-motion";

const SkillBar = ({ skill, index }) => {
  const [isInView, setIsInView] = React.useState(false);

  const getSkillTheme = (theme) => {
    switch (theme) {
      case 'filament':
        return {
          background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4)',
          icon: '🖨️',
        };
      case 'switch':
        return {
          background: 'linear-gradient(90deg, #a8e6cf, #dcedc1)',
          icon: '⌨️',
        };
      case 'shavings':
        return {
          background: 'linear-gradient(90deg, #8b4513, #d2691e)',
          icon: '🪵',
        };
      case 'rocket':
        return {
          background: 'linear-gradient(90deg, #667eea, #764ba2)',
          icon: '🚀',
        };
      default:
        return {
          background: 'var(--primary)',
          icon: skill.icon,
        };
    }
  };

  const theme = getSkillTheme(skill.theme);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onViewportEnter={() => setIsInView(true)}
      onViewportLeave={() => setIsInView(false)}
      style={{
        marginBottom: '1.5rem',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>{theme.icon}</span>
        <span style={{ fontWeight: 'bold', marginRight: 'auto' }}>{skill.name}</span>
        <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>{skill.percentage}%</span>
      </div>
      
      <div style={{
        width: '100%',
        height: '12px',
        background: 'var(--card-bg)',
        borderRadius: '6px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <motion.div
          style={{
            height: '100%',
            background: theme.background,
            borderRadius: '6px',
            position: 'relative',
          }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.percentage}%` } : { width: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </div>
      
      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', opacity: 0.8, fontStyle: 'italic' }}>
        {skill.description}
      </p>
    </motion.div>
  );
};

export default SkillBar; 