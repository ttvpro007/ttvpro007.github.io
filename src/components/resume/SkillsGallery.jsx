import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SkillsGallery = ({ skills }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-purple-600 font-orbitron flex items-center">
        ⚙️ Skills Gallery
      </h2>
      
      {/* Skills by Category */}
      <div className="space-y-10">
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <motion.div 
            key={category} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 font-orbitron border-b-2 border-purple-200 pb-2 inline-block">
                {category}
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categorySkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
                  onClick={() => setSelectedSkill(selectedSkill === skill.name ? null : skill.name)}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:border-purple-300 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl text-center group"
                >
                  <motion.div 
                    className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300"
                    animate={{ 
                      y: [0, -3, 0],
                      rotate: [0, 1, -1, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                  >
                    {skill.icon}
                  </motion.div>
                  <div className="text-sm font-bold text-gray-800 mb-4 text-center font-orbitron">{skill.name}</div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1.5, delay: index * 0.1 }}
                      className="h-3 rounded-full shadow-sm"
                      style={{ 
                        background: `linear-gradient(90deg, ${skill.color}80, ${skill.color})`,
                        boxShadow: `0 0 15px ${skill.color}40`
                      }}
                    />
                  </div>
                  <div className="text-sm text-gray-600 font-semibold">{skill.level}%</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-10 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-200 shadow-xl"
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-800 font-orbitron flex items-center justify-center">
              <span className="mr-3">🔍</span>
              Filter Projects by: {selectedSkill}
            </h3>
            <p className="text-gray-600 mb-6 text-center font-medium">Click to filter your projects page by this technology</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/projects?filter=' + selectedSkill}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="flex items-center justify-center">
                View Projects 
                <span className="ml-2 text-xl">→</span>
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillsGallery; 