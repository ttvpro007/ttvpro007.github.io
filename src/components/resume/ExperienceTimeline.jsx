import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ExperienceTimeline = ({ experience }) => {
  const [selectedExperience, setSelectedExperience] = useState(null);

  return (
    <div className="space-y-8">
      {experience.map((exp, index) => (
        <motion.div
          key={exp.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.2 }}
          className="relative"
        >
          <div className="flex items-start space-x-6">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl cursor-pointer shadow-lg border-2 border-white"
              onClick={() => setSelectedExperience(selectedExperience === exp.id ? null : exp.id)}
            >
              {exp.logo}
            </motion.div>
            <div className="flex-1">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:border-green-300 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 mb-1 font-orbitron">{exp.company}</h3>
                    <p className="text-gray-600 font-semibold text-lg">{exp.role}</p>
                    <p className="text-sm text-gray-500 font-medium">{exp.location} • {exp.dates}</p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="text-2xl cursor-pointer text-green-600"
                    onClick={() => setSelectedExperience(selectedExperience === exp.id ? null : exp.id)}
                  >
                    {selectedExperience === exp.id ? '−' : '+'}
                  </motion.div>
                </div>
                
                <AnimatePresence>
                  {selectedExperience === exp.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200"
                    >
                      <h4 className="font-bold mb-4 text-gray-800 text-lg flex items-center">
                        <span className="mr-2">🎯</span>
                        Key Achievements
                      </h4>
                      <ul className="space-y-3 mb-6">
                        {exp.achievements.map((achievement, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start space-x-3"
                          >
                            <span className="text-green-500 mt-1 text-lg">•</span>
                            <span className="text-gray-700 font-medium">{achievement}</span>
                          </motion.li>
                        ))}
                      </ul>
                      <h4 className="font-bold mb-4 text-gray-800 text-lg flex items-center">
                        <span className="mr-2">🛠️</span>
                        Tech Stack
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {exp.techStack.map((tech, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ExperienceTimeline; 