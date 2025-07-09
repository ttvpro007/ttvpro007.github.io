import React from "react";
import { motion } from "framer-motion";
import { ProgressBar, Icon } from "./base";
import { 
  AnimationCategories, 
  getAnimation, 
  AnimationPresets 
} from "../utils/animations";
import "../styling/components/skill-bar.css";

const SkillBar = ({ skill, index, entryStrategy = "slideFade" }) => {
  const [isInView, setIsInView] = React.useState(false);

  // Get animations from the centralized system
  const entryAnimation = getAnimation(AnimationCategories.ENTRY_EXIT, entryStrategy);

  const getSkillTheme = (theme, skill) => {
    // If skill has a color property, use it
    if (skill.color) {
      return {
        background: skill.color,
        icon: skill.icon,
      };
    }
    
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

  const theme = getSkillTheme(skill.theme, skill);

  return (
    <motion.div
      {...entryAnimation}
      transition={{ 
        ...entryAnimation.transition,
        delay: index * 0.1 
      }}
      onViewportEnter={() => setIsInView(true)}
      onViewportLeave={() => setIsInView(false)}
      className="skill-bar"
    >
      <div className="skill-bar-header">
        <Icon emoji={theme.icon} size="small" className="skill-bar-icon" />
        <span className="skill-bar-name">{skill.name}</span>
        <span className="skill-bar-level">{skill.level || skill.percentage}%</span>
      </div>
      
      <ProgressBar 
        progress={skill.level || skill.percentage} 
        max={100} 
        height="12px"
        color={theme.background}
        bgColor="var(--card-bg)"
        animated={isInView}
      />
      
      <p className="skill-bar-description">
        {skill.description}
      </p>
    </motion.div>
  );
};

export default SkillBar; 