import React from "react";
import { motion } from "framer-motion";
import { 
  AnimationCategories, 
  getAnimation, 
  AnimationPresets 
} from "../utils/animations";
import "../styling/components/flip-card.css";

const FlipCard = ({ card, index, entryStrategy = "entry" }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  // Get animations from the centralized system
  const entryAnimation = getAnimation(AnimationCategories.FLIP_CARD, entryStrategy);
  const flipAnimation = getAnimation(AnimationCategories.FLIP_CARD, isHovered ? 'flip' : 'unflip');

  return (
    <motion.div
      {...entryAnimation}
      transition={{ 
        ...entryAnimation.transition,
        delay: index * 0.1 
      }}
      className="flip-card-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="flip-card-inner"
        {...flipAnimation}
      >
        {/* Front of card */}
        <div className="flip-card-front">
          <div className="flip-card-icon">{card.front.icon}</div>
          <h3 className="flip-card-title">{card.front.title}</h3>
          <p className="flip-card-subtitle">{card.front.subtitle}</p>
        </div>

        {/* Back of card */}
        <div className="flip-card-back">
          <div className="flip-card-back-text">{card.back.content}</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FlipCard; 