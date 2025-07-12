import React from "react";
import { Section, ImageContainer, IndicatorDots } from "@/components/base";
import { profile, uiContent } from "@/data";
import './ShowAndTell.css';

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
      className="show-and-tell-container"
    >
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <ImageContainer
          key={currentIndex}
          src={profile.showAndTell[currentIndex].image}
          alt={profile.showAndTell[currentIndex].title}
          height="medium"
          className="show-and-tell-image"
        />
        <div className="show-and-tell-text">
          <h4 className="show-and-tell-title">
            {profile.showAndTell[currentIndex].title}
          </h4>
          <p className="show-and-tell-description">
            {profile.showAndTell[currentIndex].description}
          </p>
          <span className="show-and-tell-caption">
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