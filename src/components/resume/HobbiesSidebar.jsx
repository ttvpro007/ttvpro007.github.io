import React from 'react';
import { motion } from 'framer-motion';

const HobbiesSidebar = ({ hobbies }) => {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {Object.entries(hobbies).map(([key, hobby], index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: index * 0.2, duration: 0.5 }}
          whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 hover:border-indigo-300 transition-all duration-300 shadow-lg hover:shadow-2xl text-center group"
        >
          <motion.div 
            className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300"
            animate={{ 
              y: [0, -5, 0],
              rotate: [0, 3, -3, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              delay: index * 0.3
            }}
          >
            {hobby.icon}
          </motion.div>
          <motion.div 
            className="text-4xl font-bold text-indigo-600 mb-4 font-orbitron"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.5, type: "spring", stiffness: 200 }}
          >
            {hobby.count}
          </motion.div>
          <div className="text-gray-700 font-rajdhani font-semibold text-lg uppercase tracking-wide">
            {hobby.label}
          </div>
          <motion.div
            className="mt-6 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: index * 0.7, duration: 1 }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default HobbiesSidebar; 