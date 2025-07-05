import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ResumeHero = ({ heroData }) => {
  const [isWiggling, setIsWiggling] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-10 bg-gradient-to-r from-blue-900/95 to-purple-900/95 backdrop-blur-sm border-b border-blue-500/30"
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl"
            >
              {heroData.animatedIcon}
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-white font-orbitron">
                {heroData.name}
              </h1>
              <p className="text-blue-200 font-rajdhani">
                {heroData.title}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            animate={isWiggling ? { x: [-2, 2, -2, 2, 0] } : {}}
            onHoverStart={() => setIsWiggling(true)}
            onHoverEnd={() => setIsWiggling(false)}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => window.open(heroData.resumeUrl, '_blank')}
          >
            📄 Download Resume
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResumeHero; 