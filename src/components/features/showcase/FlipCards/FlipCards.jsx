import React from "react";
import FlipCard from "../FlipCard/FlipCard";
import { Section } from "@/components/base";
import { profile } from "@/data";
import "../FlipCard/FlipCard.css";

export default function FlipCards() {
  if (!profile || !profile.flipCards) {
    return null;
  }

  return (
    <Section
      centered={true}
      className="flip-cards-section"
      style={{
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        padding: '0'
      }}
    >
      <div className="flip-cards-grid">
        {profile.flipCards?.map((card, index) => (
          <div
            key={index}
            className="flip-card-item"
          >
            <FlipCard card={card} index={index} />
          </div>
        ))}
      </div>
    </Section>
  );
} 