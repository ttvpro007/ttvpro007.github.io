import React from "react";
import { motion } from "framer-motion";
import { Section, Button } from "./base";
import { profile, uiContent } from "../data";
import { 
  AnimationCategories, 
  getAnimation, 
  AnimationPresets 
} from "../utils/animations";

const ShowAndTell = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (!profile || !profile.showAndTell) {
    return null;
  }

  // Get animations from the centralized system
  const imageAnimation = getAnimation(AnimationCategories.ENTRY_EXIT, 'scaleFade');
  const buttonAnimation = getAnimation(AnimationCategories.BUTTON, 'press');

  return (
    <Section 
      title={uiContent.sections.showAndTell.title} 
      icon={uiContent.sections.showAndTell.icon}
      centered={true}
      style={{
        width: '100%',
        margin: '0 auto'
      }}
    >
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <motion.img
          key={currentIndex}
          src={profile.showAndTell[currentIndex].image}
          alt={profile.showAndTell[currentIndex].title}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: 'var(--border-radius)',
            marginBottom: '0.5rem',
          }}
          {...imageAnimation}
        />
        
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>
            {profile.showAndTell[currentIndex].title}
          </h4>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.8 }}>
            {profile.showAndTell[currentIndex].description}
          </p>
          <span style={{
            fontSize: '0.8rem',
            fontStyle: 'italic',
            color: 'var(--primary)',
            fontWeight: 'bold',
          }}>
            "{profile.showAndTell[currentIndex].caption}"
          </span>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
        {profile.showAndTell?.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: uiContent.config.showAndTell.indicatorSize,
              height: uiContent.config.showAndTell.indicatorSize,
              borderRadius: '50%',
              border: 'none',
              background: index === currentIndex ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
            }}
            {...buttonAnimation}
          />
        ))}
      </div>
    </Section>
  );
};

export default ShowAndTell; 