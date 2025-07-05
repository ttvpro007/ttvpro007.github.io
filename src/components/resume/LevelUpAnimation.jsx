import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LevelUpAnimation = ({ trigger, onComplete }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [level, setLevel] = useState(5);

  useEffect(() => {
    if (trigger) {
      setShowAnimation(true);
      setLevel(prev => prev + 1);
      
      // Hide animation after completion
      const timer = setTimeout(() => {
        setShowAnimation(false);
        onComplete && onComplete();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          {/* Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-indigo-900/80 backdrop-blur-sm"
          />

          {/* Level Up Card */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20,
              duration: 0.8 
            }}
            className="relative bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-3xl p-8 shadow-2xl border-4 border-yellow-300"
          >
            {/* Sparkle Effects */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: i * 0.1 }}
                className="absolute w-4 h-4 bg-yellow-200 rounded-full"
                style={{
                  left: `${20 + (i * 10)}%`,
                  top: `${10 + (i * 5)}%`,
                  animation: 'pulse 1s infinite'
                }}
              />
            ))}

            {/* Main Content */}
            <div className="text-center text-white relative z-10">
              {/* Level Up Icon */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-6xl mb-4"
              >
                ⭐
              </motion.div>

              {/* Level Up Text */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-4xl font-bold font-orbitron mb-2"
              >
                LEVEL UP!
              </motion.h2>

              {/* New Level */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
                className="text-6xl font-bold mb-4 bg-white text-orange-600 rounded-full w-24 h-24 flex items-center justify-center mx-auto shadow-lg"
              >
                {level}
              </motion.div>

              {/* Congratulations Text */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-xl font-rajdhani"
              >
                Congratulations! You've reached level {level}!
              </motion.p>

              {/* XP Gained */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="mt-4 text-lg font-bold"
              >
                +500 Experience Points Gained!
              </motion.div>
            </div>

            {/* Floating Particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                initial={{ 
                  opacity: 0, 
                  y: 0, 
                  x: 0,
                  scale: 0 
                }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  y: -100, 
                  x: (i % 2 === 0 ? 50 : -50),
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="absolute w-2 h-2 bg-yellow-200 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  bottom: '0%'
                }}
              />
            ))}
          </motion.div>

          {/* Sound Effect Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm font-rajdhani"
          >
            🔊 Level Up Sound Effect
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpAnimation; 