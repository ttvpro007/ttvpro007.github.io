import React from 'react';
import { motion } from 'framer-motion';

const CharacterProfile = ({ heroData, level, currentXP, maxXP }) => {
  const xpPercentage = (currentXP / maxXP) * 100;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white rounded-3xl shadow-2xl p-8 border border-purple-500/30">
      <div className="flex items-center space-x-6">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-4xl shadow-lg border-4 border-purple-300">
            {heroData.animatedIcon}
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-yellow-900 shadow-lg border-2 border-yellow-200">
            {level}
          </div>
        </motion.div>

        {/* Character Info */}
        <div className="flex-1">
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-bold font-orbitron mb-2 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent"
          >
            {heroData.name}
          </motion.h1>
          <motion.p
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-purple-200 font-rajdhani text-lg mb-4"
          >
            {heroData.title}
          </motion.p>
          
          {/* XP Bar */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '100%', opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span className="text-purple-200">Experience Points</span>
              <span className="text-yellow-300 font-bold">{currentXP} / {maxXP} XP</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 border border-purple-500/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ duration: 1.5, delay: 0.6 }}
                className="h-3 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 shadow-lg"
                style={{
                  boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)'
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-right space-y-2"
        >
          <div className="bg-slate-800/50 rounded-lg p-3 border border-purple-500/30">
            <div className="text-2xl font-bold text-purple-300">{level}</div>
            <div className="text-xs text-purple-200">Level</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-purple-500/30">
            <div className="text-lg font-bold text-green-300">🎯</div>
            <div className="text-xs text-green-200">Active</div>
          </div>
        </motion.div>
      </div>

      {/* Location & Contact */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-6 flex items-center justify-between text-sm text-purple-200"
      >
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <span className="mr-2">📍</span>
            {heroData.location}
          </span>
          <span className="flex items-center">
            <span className="mr-2">📧</span>
            {heroData.email}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-lg font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          📄 Download CV
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CharacterProfile; 