import React from "react";
import { motion } from "framer-motion";
import { Card } from "./base";
import { 
  AnimationCategories, 
  getAnimation, 
  AnimationPresets 
} from "../utils/animations";
import styles from "./FlipCard.module.css";

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
      className={styles.flipCardContainer}
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          aspectRatio: '1.4 / 1',
          minHeight: '160px',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
        {...flipAnimation}
      >
        {/* Front of card */}
        <Card
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          hover={true}
        >
          <div className={styles.flipCardFront}>
            <div className={styles.flipCardIcon}>{card.front.icon}</div>
            <h3 className={styles.flipCardTitle}>{card.front.title}</h3>
            <p className={styles.flipCardSubtitle}>{card.front.subtitle}</p>
          </div>
        </Card>

        {/* Back of card */}
        <motion.div
          className={styles.flipCardBack}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'var(--primary)',
            color: 'white',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--shadow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            textAlign: 'center',
          }}
        >
          <div className={styles.flipCardBackText}>{card.back.content}</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default FlipCard; 