import React from "react";
import { motion } from "framer-motion";
import FlipCard from "./FlipCard";
import { Section } from "./base";
import { profile, uiContent } from "../data";

const FlipCards = () => {
  return (
    <Section 
      title={uiContent.sections.flipCards.title} 
      icon={uiContent.sections.flipCards.icon} 
      centered={true}
    >
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto'
      }}>
        {profile.flipCards.map((card, index) => (
          <FlipCard key={index} card={card} index={index} />
        ))}
      </div>
    </Section>
  );
};

export default FlipCards; 