import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Section } from "./base";
import { profile, uiContent } from "../data";
import { 
  AnimationCategories, 
  getAnimation, 
  AnimationPresets 
} from "../utils/animations";

const FunFacts = () => {
  const [currentFact, setCurrentFact] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);

  if (!profile || !profile.funFacts) {
    return null;
  }

  // Get animations from the centralized system
  const textAnimation = getAnimation(AnimationCategories.SHOW_HIDE, 'slideUp');

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
        width: '100%',
        margin: '0 auto'
      }}
      onHoverStart={() => setIsVisible(true)}
      onHoverEnd={() => setIsVisible(false)}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={currentFact}
          {...textAnimation}
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