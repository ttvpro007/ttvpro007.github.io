import React from "react";
import { Section, ImageContainer, IndicatorDots } from "./base";
import { profile, uiContent } from "../data";

const ShowAndTell = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (!profile || !profile.showAndTell) {
    return null;
  }

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
        <ImageContainer
          key={currentIndex}
          src={profile.showAndTell[currentIndex].image}
          alt={profile.showAndTell[currentIndex].title}
          height="200px"
          style={{
            marginBottom: '0.5rem',
          }}
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
      
      <IndicatorDots
        count={profile.showAndTell.length}
        currentIndex={currentIndex}
        onDotClick={setCurrentIndex}
        size={uiContent.config.showAndTell.indicatorSize}
      />
    </Section>
  );
};

export default ShowAndTell; 