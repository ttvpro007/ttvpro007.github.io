import React from "react";
import FlipCard from "./FlipCard";
import { profile } from "../data";

const brickGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(140px, 1fr))', // smaller cards
  gap: '2rem 1.5rem',
  justifyContent: 'center',
  alignItems: 'start',
  maxWidth: '700px', // match body panel constraint
  width: '100%',
  margin: '0 auto',
  position: 'relative',
};

// Jagged pattern: 0rem, 1.5rem, 3rem, then repeat
const getJaggedMarginTop = (index) => {
  const pattern = [0, 1.5, 3];
  return `${pattern[index % 3]}rem`;
};

export default function FlipCards() {
  if (!profile || !profile.flipCards) {
    return null;
  }

  return (
    <div style={brickGridStyle}>
      {profile.flipCards?.map((card, index) => (
        <div
          key={index}
          style={{
            marginTop: getJaggedMarginTop(index),
            transition: 'margin-top 0.3s',
          }}
        >
          <FlipCard card={card} index={index} />
        </div>
      ))}
    </div>
  );
} 