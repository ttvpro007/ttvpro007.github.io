import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Section } from "@/components/base";
import { profile, uiContent } from "@/data";
import { 
  AnimationCategories, 
  getAnimation, 
  AnimationPresets 
} from "@/utils/animations";
import './FunFacts.css';

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
      className="fun-facts-section"
      onHoverStart={() => setIsVisible(true)}
      onHoverEnd={() => setIsVisible(false)}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={currentFact}
          {...textAnimation}
          className="fun-facts-text"
        >
          {profile.funFacts[currentFact]}
        </motion.p>
      </AnimatePresence>
    </Section>
  );
};

export default FunFacts; 