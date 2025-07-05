import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EducationTimeline = ({ education }) => {
  const [selectedEducation, setSelectedEducation] = useState(null);

  return (
    <div className="space-y-8">
      {education.map((edu, index) => (
        <motion.div
          key={edu.id}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.2 }}
          className="relative"
        >
          <div className="flex items-start space-x-6">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl cursor-pointer shadow-lg border-2 border-white"
              onClick={() => setSelectedEducation(selectedEducation === edu.id ? null : edu.id)}
            >
              {edu.logo}
            </motion.div>
            <div className="flex-1">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:border-blue-300 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 mb-1 font-orbitron">{edu.school}</h3>
                    <p className="text-gray-600 font-semibold text-lg">{edu.degree}</p>
                    <p className="text-sm text-gray-500 font-medium">{edu.years}</p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="text-2xl cursor-pointer text-blue-600"
                    onClick={() => setSelectedEducation(selectedEducation === edu.id ? null : edu.id)}
                  >
                    {selectedEducation === edu.id ? '−' : '+'}
                  </motion.div>
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                    GPA: {edu.gpa}
                  </span>
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                    {edu.honors}
                  </span>
                </div>
                
                <AnimatePresence>
                  {selectedEducation === edu.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200"
                    >
                      <h4 className="font-bold mb-4 text-gray-800 text-lg flex items-center">
                        <span className="mr-2">📚</span>
                        Key Courses
                      </h4>
                      <ul className="space-y-3 mb-6">
                        {edu.courses.map((course, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start space-x-3"
                          >
                            <span className="text-blue-500 mt-1 text-lg">•</span>
                            <span className="text-gray-700 font-medium">{course}</span>
                          </motion.li>
                        ))}
                      </ul>
                      <h4 className="font-bold mb-4 text-gray-800 text-lg flex items-center">
                        <span className="mr-2">🚀</span>
                        Notable Projects
                      </h4>
                      <ul className="space-y-3">
                        {edu.projects.map((project, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start space-x-3"
                          >
                            <span className="text-green-500 mt-1 text-lg">•</span>
                            <span className="text-gray-700 font-medium">{project}</span>
                          </motion.li>
                        ))}
                      </ul>
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

export default EducationTimeline; 