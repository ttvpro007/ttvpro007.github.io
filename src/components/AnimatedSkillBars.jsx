import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import skillData from "../data/skillData.json";
import { Card, Section } from "./base";
import { animationComponents } from "./animations/SkillAnimations";

function SkillBar({ skill, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const AnimationComponent = animationComponents[skill.animation];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>{skill.icon}</span>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{skill.name}</h4>
          <span style={{ 
            marginLeft: 'auto', 
            fontSize: '0.9rem', 
            fontWeight: 600,
            color: skill.color 
          }}>
            {skill.level}%
          </span>
        </div>
        
        {AnimationComponent && (
          <AnimationComponent level={skill.level} color={skill.color} />
        )}
        
        <p style={{ 
          margin: '0.5rem 0 0 0', 
          fontSize: '0.9rem', 
          color: 'var(--text-secondary)',
          lineHeight: 1.4
        }}>
          {skill.description}
        </p>
      </Card>
    </motion.div>
  );
}

export default function AnimatedSkillBars() {
  return (
    <div style={{ width: '100%' }}>
      {Object.entries(skillData).map(([category, skills]) => (
        <Section key={category} title={category} centered={true}>
          {skills.map((skill, index) => (
            <SkillBar key={skill.name} skill={skill} index={index} />
          ))}
        </Section>
      ))}
    </div>
  );
} 