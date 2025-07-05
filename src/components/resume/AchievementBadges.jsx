import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AchievementBadges = ({ achievements, certifications, hobbies }) => {
  const [selectedBadge, setSelectedBadge] = useState(null);

  // Combine all achievements
  const allAchievements = [
    // Certifications as achievements
    ...certifications.map(cert => ({
      id: `cert-${cert.title}`,
      title: cert.title,
      icon: cert.logo,
      description: cert.description,
      rarity: 'epic',
      xp: 500,
      story: `Earned ${cert.title} certification with ${cert.score} score in ${cert.year}`,
      category: 'Certification'
    })),
    // Hobby achievements
    {
      id: 'hobby-3dprints',
      title: '3D Print Master',
      icon: '🖨️',
      description: 'Created 47+ 3D printed objects',
      rarity: 'rare',
      xp: 300,
      story: 'Printed 20+ miniatures and various functional parts in 2024',
      category: 'Hobby'
    },
    {
      id: 'hobby-keyboards',
      title: 'Custom Keyboard Artisan',
      icon: '⌨️',
      description: 'Built 8 custom mechanical keyboards',
      rarity: 'legendary',
      xp: 800,
      story: 'Designed and assembled custom keyboards with unique layouts and switches',
      category: 'Hobby'
    },
    {
      id: 'hobby-diy',
      title: 'DIY Master',
      icon: '🛠️',
      description: 'Completed 23+ DIY projects',
      rarity: 'rare',
      xp: 400,
      story: 'Built everything from furniture to electronics projects',
      category: 'Hobby'
    },
    // Professional achievements
    {
      id: 'pro-games',
      title: 'Game Developer',
      icon: '🎮',
      description: 'Shipped 15+ games',
      rarity: 'legendary',
      xp: 1000,
      story: 'Developed and published multiple games across different platforms',
      category: 'Professional'
    },
    {
      id: 'pro-ar',
      title: 'AR Pioneer',
      icon: '🥽',
      description: 'Built AR app for Apple Vision Pro',
      rarity: 'epic',
      xp: 600,
      story: 'Developed AR application with 10K+ downloads on Apple Vision Pro',
      category: 'Professional'
    },
    {
      id: 'pro-optimization',
      title: 'Performance Optimizer',
      icon: '⚡',
      description: '40% performance improvement',
      rarity: 'rare',
      xp: 350,
      story: 'Optimized game performance reducing load times by 40%',
      category: 'Professional'
    }
  ];

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'from-gray-400 to-gray-600',
      uncommon: 'from-green-400 to-green-600',
      rare: 'from-blue-400 to-blue-600',
      epic: 'from-purple-400 to-purple-600',
      legendary: 'from-yellow-400 to-orange-600'
    };
    return colors[rarity] || colors.common;
  };

  const getRarityGlow = (rarity) => {
    const glows = {
      common: 'shadow-gray-400/50',
      uncommon: 'shadow-green-400/50',
      rare: 'shadow-blue-400/50',
      epic: 'shadow-purple-400/50',
      legendary: 'shadow-yellow-400/50'
    };
    return glows[rarity] || glows.common;
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white rounded-3xl shadow-2xl p-8 border border-purple-500/30">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold font-orbitron mb-2 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
          🏆 Achievements & Badges
        </h3>
        <p className="text-purple-200 font-rajdhani">Recognition of excellence and expertise</p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {allAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.1, 
              y: -10,
              rotateY: 5
            }}
            onHoverStart={() => setSelectedBadge(achievement)}
            onHoverEnd={() => setSelectedBadge(null)}
            className={`relative cursor-pointer bg-gradient-to-br ${getRarityColor(achievement.rarity)} rounded-2xl p-6 border-2 border-white/20 hover:border-white/40 transition-all duration-300 shadow-lg hover:shadow-2xl ${getRarityGlow(achievement.rarity)}`}
          >
            {/* Badge Icon */}
            <div className="text-4xl mb-3 text-center">{achievement.icon}</div>
            
            {/* Badge Title */}
            <div className="text-sm font-bold text-center mb-2 font-orbitron">
              {achievement.title}
            </div>
            
            {/* XP Reward */}
            <div className="text-xs text-center font-bold text-yellow-300">
              +{achievement.xp} XP
            </div>

            {/* Rarity Indicator */}
            <div className="absolute top-2 right-2">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getRarityColor(achievement.rarity)} border border-white/50`} />
            </div>

            {/* Category Tag */}
            <div className="absolute bottom-2 left-2">
              <div className="text-xs bg-black/30 px-2 py-1 rounded-full">
                {achievement.category}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Badge Details */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
          >
            <div className="flex items-start space-x-4">
              <div className="text-4xl">{selectedBadge.icon}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-xl font-bold text-purple-300">{selectedBadge.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRarityColor(selectedBadge.rarity)}`}>
                    {selectedBadge.rarity.toUpperCase()}
                  </span>
                </div>
                <p className="text-purple-200 mb-3">{selectedBadge.description}</p>
                <div className="text-sm text-yellow-300 font-bold mb-2">
                  Reward: +{selectedBadge.xp} Experience Points
                </div>
                <div className="text-sm text-purple-100 italic">
                  "{selectedBadge.story}"
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Locked Achievements Preview */}
      <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-purple-500/30">
        <h4 className="text-lg font-bold text-purple-300 mb-3 flex items-center">
          <span className="mr-2">🔒</span>
          Future Goals
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { title: 'Unity Expert', icon: '🎮', progress: '75%' },
            { title: 'Unreal Master', icon: '⚡', progress: '60%' },
            { title: 'AI Specialist', icon: '🤖', progress: '40%' }
          ].map((goal, index) => (
            <motion.div
              key={goal.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg border border-purple-500/20"
            >
              <span className="text-2xl opacity-50">{goal.icon}</span>
              <div>
                <div className="text-sm font-bold text-purple-200">{goal.title}</div>
                <div className="text-xs text-purple-300">{goal.progress} Complete</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementBadges; 