import React from "react";
import { motion } from "framer-motion";
import { Icon, Section } from "@/components/base";
import { profile, uiContent } from "@/data";
import { 
  AnimationCategories, 
  getAnimation, 
  AnimationPresets 
} from "@/utils/animations";
import './Timeline.css';

const Timeline = () => {
  if (!profile || !profile.journey) {
    return null;
  }
  
  // Get animations from the centralized system
  const containerAnimation = getAnimation(AnimationCategories.ENTRY_EXIT, 'slideUp');
  const itemAnimation = getAnimation(AnimationCategories.STAGGERED, 'scaleIn');
  const hoverAnimation = getAnimation(AnimationCategories.HOVER, 'scale');
  
  return (
    <Section 
      title={uiContent.sections.timeline.title} 
      icon={uiContent.sections.timeline.icon} 
      centered={true}
    >
      <motion.div
        {...containerAnimation}
        transition={{ 
          ...containerAnimation.transition,
          delay: 0.3 
        }}
        className="timeline-container"
      >
        {/* Timeline line */}
        <div className="timeline-line" />

        {profile.journey?.map((item, index) => (
          <motion.div
            key={index}
            className="timeline-item"
            {...itemAnimation}
            {...hoverAnimation}
            transition={{ 
              ...itemAnimation.transition,
              delay: 0.5 + index * 0.2 
            }}
          >
            <motion.div
              className="timeline-icon-container"
              animate={item.animation === 'sparkle' ? uiContent.animations.timeline.sparkle : 
                      item.animation === 'rocket' ? uiContent.animations.timeline.rocket : 
                      uiContent.animations.timeline.default}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Icon 
                emoji={item.icon}
                size="large"
                circular={true}
                className="timeline-icon"
              />
            </motion.div>
            <div className="timeline-content">
              <h4 className="timeline-title">{item.title}</h4>
              <p className="timeline-year">{item.year}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};

export default Timeline; 