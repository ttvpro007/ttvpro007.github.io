import React from "react";
import { motion } from "framer-motion";
import SkillBar from "./SkillBar";
import profile from '../data/profile.json';
import { Section } from "./base";

const Skills = () => {
  return (
    <Section 
      title="Skills & Crafts" 
      icon="⚡"
      centered={true}
      style={{
        maxWidth: '600px',
        width: '100%',
        margin: '0 auto'
      }}
    >
      {profile.skills.map((skill, index) => (
        <SkillBar key={index} skill={skill} index={index} />
      ))}
    </Section>
  );
};

export default Skills; 