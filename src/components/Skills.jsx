import React from "react";
import { motion } from "framer-motion";
import SkillBar from "./SkillBar";
import { Section } from "./base";
import { profile, uiContent } from "../data";

const Skills = () => {
  return (
    <Section 
      title={uiContent.sections.skills.title} 
      icon={uiContent.sections.skills.icon}
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