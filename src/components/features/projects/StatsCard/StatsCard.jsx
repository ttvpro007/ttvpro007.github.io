import React from "react";
import { motion } from "framer-motion";
import { ProgressBar } from "@/components/base";
import "./StatsCard.css";

const StatsCard = ({ 
  title, 
  icon, 
  data, 
  animationDelay = 0.5,
  animationDirection = "left", // "left" or "right"
  className = ""
}) => {
  const gradients = [
    'linear-gradient(90deg, #ff6b6b, #4ecdc4)',
    'linear-gradient(90deg, #a8e6cf, #dcedc1)',
    'linear-gradient(90deg, #8b4513, #d2691e)',
    'linear-gradient(90deg, #667eea, #764ba2)',
    'linear-gradient(90deg, #FC9460, #A92F5F)',
    'linear-gradient(90deg, #64A47F, #EEB64B)',
    'linear-gradient(90deg, #E54264, #442261)'
  ];

  const getMaxValue = () => {
    return Math.max(...data.map(([, count]) => count));
  };

  const getAnimationDirection = () => {
    return animationDirection === "right" ? 20 : -20;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: getAnimationDirection() }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        delay: animationDelay, 
        duration: 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      className={`projects-compact-stats-card ${className}`}
    >
      <h3 className="projects-compact-stats-title body-text">
        {icon} {title}
      </h3>
      <div className="projects-compact-stats-items">
        {data.map(([label, count], index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: getAnimationDirection() }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: animationDelay + 0.1 + index * 0.1,
              duration: 0.3
            }}
            className="projects-compact-stats-item"
          >
            <div className="projects-compact-stats-label">
              {label}
            </div>
            <div className="projects-compact-stats-progress">
              <ProgressBar
                progress={count}
                max={getMaxValue()}
                height="8px"
                color={gradients[index % gradients.length]}
                bgColor="transparent"
                animated={true}
              />
            </div>
            <div className="projects-compact-stats-count">
              {count}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StatsCard; 