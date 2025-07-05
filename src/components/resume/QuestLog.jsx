import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QuestLog = ({ experience, education }) => {
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [activeTab, setActiveTab] = useState('experience');

  // Convert experience to quests
  const experienceQuests = experience.map((exp, index) => ({
    id: `exp-${index}`,
    title: exp.role,
    location: exp.company,
    duration: exp.dates,
    icon: exp.logo,
    status: 'completed',
    difficulty: getDifficulty(exp.role),
    xp: getQuestXP(exp.role),
    objectives: exp.achievements.map(achievement => ({
      text: achievement,
      completed: true
    })),
    rewards: exp.techStack.map(tech => ({
      name: tech,
      type: 'skill',
      icon: getTechIcon(tech)
    })),
    category: 'Professional'
  }));

  // Convert education to quests
  const educationQuests = education.map((edu, index) => ({
    id: `edu-${index}`,
    title: edu.degree,
    location: edu.school,
    duration: edu.years,
    icon: edu.logo,
    status: 'completed',
    difficulty: 'medium',
    xp: 300,
    objectives: [
      { text: `Graduated with ${edu.gpa} GPA`, completed: true },
      { text: `Completed ${edu.courses.length} courses`, completed: true },
      ...edu.projects.map(project => ({
        text: project,
        completed: true
      }))
    ],
    rewards: [
      { name: 'Knowledge', type: 'attribute', icon: '🧠' },
      { name: 'Degree', type: 'item', icon: '🎓' },
      { name: 'Skills', type: 'skill', icon: '⚙️' }
    ],
    category: 'Education'
  }));

  const allQuests = [...experienceQuests, ...educationQuests];

  const getDifficulty = (role) => {
    if (role.includes('Lead') || role.includes('Senior')) return 'hard';
    if (role.includes('Junior') || role.includes('Intern')) return 'easy';
    return 'medium';
  };

  const getQuestXP = (role) => {
    if (role.includes('Lead') || role.includes('Senior')) return 800;
    if (role.includes('Junior') || role.includes('Intern')) return 400;
    return 600;
  };

  const getTechIcon = (tech) => {
    const icons = {
      'Unity': '🎮',
      'C#': '💎',
      'Swift': '🍎',
      'React': '⚛️',
      'Node.js': '🟢',
      'MongoDB': '🍃',
      'AWS': '☁️',
      'Git': '📝',
      'Blender': '🎨',
      'Unreal Engine': '⚡',
      'C++': '⚙️',
      'Steam API': '🎯'
    };
    return icons[tech] || '🔧';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'from-green-400 to-green-600',
      medium: 'from-yellow-400 to-orange-600',
      hard: 'from-red-400 to-red-600'
    };
    return colors[difficulty] || colors.medium;
  };

  const getDifficultyText = (difficulty) => {
    const texts = {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard'
    };
    return texts[difficulty] || 'Medium';
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white rounded-3xl shadow-2xl p-8 border border-purple-500/30">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold font-orbitron mb-2 bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
          📝 Quest Log
        </h3>
        <p className="text-purple-200 font-rajdhani">Adventures completed and rewards earned</p>
      </div>

      {/* Quest Type Tabs */}
      <div className="flex justify-center mb-6">
        <div className="bg-slate-800/50 rounded-lg p-1 border border-purple-500/30">
          {[
            { id: 'experience', label: '💼 Professional Quests', icon: '💼' },
            { id: 'education', label: '🎓 Education Quests', icon: '🎓' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <AnimatePresence mode="wait">
          {(activeTab === 'experience' ? experienceQuests : educationQuests).map((quest, index) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setSelectedQuest(quest)}
              className="cursor-pointer bg-gradient-to-br from-slate-800/80 to-slate-700/80 rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {/* Quest Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{quest.icon}</div>
                  <div>
                    <h4 className="font-bold text-purple-300 font-orbitron">{quest.title}</h4>
                    <p className="text-sm text-purple-200">{quest.location}</p>
                    <p className="text-xs text-purple-300">{quest.duration}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getDifficultyColor(quest.difficulty)}`}>
                    {getDifficultyText(quest.difficulty)}
                  </div>
                  <div className="text-yellow-300 font-bold text-sm mt-1">+{quest.xp} XP</div>
                </div>
              </div>

              {/* Quest Preview */}
              <div className="space-y-2">
                <div className="text-sm text-purple-200">
                  <span className="font-bold">Objectives:</span> {quest.objectives.length} completed
                </div>
                <div className="text-sm text-purple-200">
                  <span className="font-bold">Rewards:</span> {quest.rewards.length} items earned
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-300 font-bold">COMPLETED</span>
                </div>
                <div className="text-xs text-purple-300">{quest.category}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Quest Details Modal */}
      <AnimatePresence>
        {selectedQuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedQuest(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-purple-500/30 shadow-2xl"
            >
              {/* Quest Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-5xl">{selectedQuest.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-purple-300 font-orbitron">{selectedQuest.title}</h3>
                    <p className="text-purple-200">{selectedQuest.location}</p>
                    <p className="text-purple-300">{selectedQuest.duration}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedQuest(null)}
                  className="text-purple-300 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Quest Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-purple-500/30">
                  <div className="text-yellow-300 font-bold text-lg">+{selectedQuest.xp}</div>
                  <div className="text-xs text-purple-200">Experience</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-purple-500/30">
                  <div className="text-green-300 font-bold text-lg">{selectedQuest.objectives.length}</div>
                  <div className="text-xs text-purple-200">Objectives</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-purple-500/30">
                  <div className="text-blue-300 font-bold text-lg">{selectedQuest.rewards.length}</div>
                  <div className="text-xs text-purple-200">Rewards</div>
                </div>
              </div>

              {/* Objectives */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-purple-300 mb-3">Objectives</h4>
                <div className="space-y-2">
                  {selectedQuest.objectives.map((objective, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg border border-green-500/30">
                      <div className="text-green-400">✓</div>
                      <span className="text-purple-200">{objective.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rewards */}
              <div>
                <h4 className="text-lg font-bold text-purple-300 mb-3">Rewards Earned</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedQuest.rewards.map((reward, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-slate-800/30 rounded-lg border border-yellow-500/30">
                      <span className="text-2xl">{reward.icon}</span>
                      <div>
                        <div className="text-sm font-bold text-yellow-300">{reward.name}</div>
                        <div className="text-xs text-purple-300">{reward.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestLog; 