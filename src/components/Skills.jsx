import React from "react";
import { motion } from "framer-motion";
import SkillBar from "./SkillBar";
import { Section } from "./base";
import { profile, uiContent } from "../data";

const Skills = () => {
  if (!profile || !profile.skills || !profile.skills.categories) {
    return null;
  }
  
  return (
    <Section 
      title={uiContent.sections.skills.title} 
      icon={uiContent.sections.skills.icon}
      centered={true}
      style={{
        maxWidth: '800px',
        width: '100%',
        margin: '0 auto'
      }}
    >
      {Object.entries(profile.skills.categories).map(([categoryName, categoryData], categoryIndex) => (
        <div key={categoryIndex} style={{ marginBottom: '2rem' }}>
          <h3 style={{ 
            textAlign: 'center', 
            marginBottom: '1rem', 
            color: 'var(--primary)',
            fontSize: '1.2rem'
          }}>
            {categoryName}
          </h3>
          {categoryData.skills.map((skill, skillIndex) => (
            <SkillBar 
              key={skillIndex} 
              skill={skill} 
              index={skillIndex} 
            />
          ))}
        </div>
      ))}
    </Section>
  );
};

export default Skills; 