import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SkillTree = ({ skills, onSkillClick }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredSkill, setHoveredSkill] = useState(null);

  // Group skills by category
  const skillCategories = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categories = ['all', ...Object.keys(skillCategories)];
  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : skillCategories[selectedCategory] || [];

  const getCategoryColor = (category) => {
    const colors = {
      'Game Development': 'from-green-500 to-emerald-500',
      'Mobile Development': 'from-blue-500 to-cyan-500',
      'Programming': 'from-purple-500 to-violet-500',
      'Audio Processing': 'from-yellow-500 to-orange-500',
      '3D Modeling': 'from-red-500 to-pink-500',
      'Web Development': 'from-indigo-500 to-blue-500',
      'Backend Development': 'from-teal-500 to-green-500',
      'Version Control': 'from-gray-500 to-slate-500',
      'Cloud Services': 'from-orange-500 to-red-500',
      'Database': 'from-emerald-500 to-teal-500',
      'DevOps': 'from-cyan-500 to-blue-500'
    };
    return colors[category] || 'from-gray-500 to-slate-500';
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white rounded-3xl shadow-2xl p-8 border border-purple-500/30">
      {/* Category Filter */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold font-orbitron mb-4 text-center bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
          🌳 Skill Tree
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-slate-800/50 text-purple-200 hover:bg-slate-700/50 border border-purple-500/30'
              }`}
            >
              {category === 'all' ? '🌐 All Skills' : `${getCategoryIcon(category)} ${category}`}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Skill Tree Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="wait">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                boxShadow: `0 0 20px ${skill.color}40`
              }}
              onHoverStart={() => setHoveredSkill(skill)}
              onHoverEnd={() => setHoveredSkill(null)}
              onClick={() => onSkillClick && onSkillClick(skill)}
              className={`relative cursor-pointer bg-gradient-to-br ${getCategoryColor(skill.category)} rounded-2xl p-6 border-2 border-white/20 hover:border-white/40 transition-all duration-300 shadow-lg hover:shadow-2xl`}
            >
              {/* Skill Icon */}
              <div className="text-4xl mb-3 text-center">{skill.icon}</div>
              
              {/* Skill Name */}
              <div className="text-sm font-bold text-center mb-3 font-orbitron">
                {skill.name}
              </div>
              
              {/* Level Bar */}
              <div className="w-full bg-black/30 rounded-full h-2 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-2 rounded-full bg-white/80 shadow-sm"
                  style={{
                    boxShadow: `0 0 8px ${skill.color}60`
                  }}
                />
              </div>
              
              {/* Level Text */}
              <div className="text-xs text-center font-bold">
                Level {Math.floor(skill.level / 10) + 1}
              </div>

              {/* Unlock Effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredSkill?.name === skill.name ? 1 : 0 }}
                className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Skill Details Tooltip */}
      <AnimatePresence>
        {hoveredSkill && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 p-4 bg-slate-800/80 backdrop-blur-sm rounded-xl border border-purple-500/30"
          >
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">{hoveredSkill.icon}</span>
              <div>
                <h4 className="font-bold text-purple-300">{hoveredSkill.name}</h4>
                <p className="text-sm text-purple-200">{hoveredSkill.category}</p>
              </div>
            </div>
            <div className="text-sm text-purple-100">
              Mastery Level: {hoveredSkill.level}% - {getMasteryDescription(hoveredSkill.level)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const getCategoryIcon = (category) => {
  const icons = {
    'Game Development': '🎮',
    'Mobile Development': '📱',
    'Programming': '⚙️',
    'Audio Processing': '🎵',
    '3D Modeling': '🎨',
    'Web Development': '🌐',
    'Backend Development': '🖥️',
    'Version Control': '📝',
    'Cloud Services': '☁️',
    'Database': '🗄️',
    'DevOps': '🐳'
  };
  return icons[category] || '🔧';
};

const getMasteryDescription = (level) => {
  if (level >= 90) return 'Master';
  if (level >= 80) return 'Expert';
  if (level >= 70) return 'Advanced';
  if (level >= 60) return 'Intermediate';
  if (level >= 50) return 'Beginner+';
  return 'Novice';
};

export default SkillTree; 