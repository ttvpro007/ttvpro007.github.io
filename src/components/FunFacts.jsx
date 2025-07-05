import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Section } from "./base";
import { profile, uiContent } from "../data";

const FunFacts = () => {
  const [currentFact, setCurrentFact] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);

  if (!profile || !profile.funFacts) {
    return null;
  }

  React.useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCurrentFact((prev) => (prev + 1) % profile.funFacts.length);
      }, uiContent.config.funFacts.rotationInterval);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <Section 
      title={uiContent.sections.funFacts.title} 
      icon={uiContent.sections.funFacts.icon}
      centered={true}
      style={{
        maxWidth: '500px',
        width: '100%',
        margin: '0 auto'
      }}
      onHoverStart={() => setIsVisible(true)}
      onHoverEnd={() => setIsVisible(false)}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={currentFact}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.4,
            fontStyle: 'italic',
            textAlign: 'center'
          }}
        >
          {profile.funFacts[currentFact]}
        </motion.p>
      </AnimatePresence>
    </Section>
  );
};

export default FunFacts; 