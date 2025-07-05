import React from 'react';
import { motion } from 'framer-motion';

const QuickStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-2xl text-center group"
        >
          <motion.div 
            className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300"
            animate={{ 
              y: [0, -5, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              delay: index * 0.5
            }}
          >
            {stat.icon}
          </motion.div>
          <div className="text-sm text-gray-600 font-rajdhani mb-2 font-medium uppercase tracking-wide">
            {stat.label}
          </div>
          <div className="font-bold text-gray-800 font-orbitron text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {stat.value}
          </div>
          <motion.div
            className="mt-3 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: index * 0.2, duration: 1 }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats; 