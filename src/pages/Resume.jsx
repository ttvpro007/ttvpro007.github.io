import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import resumeData from '../data/resume.json';
import {
  CharacterProfile,
  SkillTree,
  AchievementBadges,
  QuestLog,
  LevelUpAnimation,
  FooterCTA
} from '../components/resume';

const Resume = () => {
  const [activeSection, setActiveSection] = useState('character');
  const [currentLevel, setCurrentLevel] = useState(5);
  const [currentXP, setCurrentXP] = useState(3200);
  const [maxXP, setMaxXP] = useState(5000);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [visitedSections, setVisitedSections] = useState(new Set());
  
  const sectionsRef = useRef({});

  const sections = [
    { id: 'character', label: 'Character', icon: '👤' },
    { id: 'skills', label: 'Skill Tree', icon: '🌳' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'quests', label: 'Quest Log', icon: '📝' }
  ];

  // Calculate XP and level based on experience and achievements
  useEffect(() => {
    const totalXP = resumeData.experience.length * 600 + 
                   resumeData.education.length * 300 + 
                   resumeData.certifications.length * 500 +
                   Object.values(resumeData.hobbies).reduce((sum, hobby) => sum + hobby.count * 10, 0);
    
    setCurrentXP(Math.min(totalXP, maxXP));
    setCurrentLevel(Math.floor(totalXP / 1000) + 5);
  }, [maxXP]);

  // Handle section visibility for level up triggers
  const handleSectionVisible = (sectionId) => {
    if (!visitedSections.has(sectionId)) {
      setVisitedSections(prev => new Set([...prev, sectionId]));
      
      // Trigger level up for certain sections
      if (['skills', 'achievements', 'quests'].includes(sectionId)) {
        setShowLevelUp(true);
      }
    }
  };

  // Fallback in case data is not available
  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold font-orbitron mb-4">Loading Character Sheet...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Level Up Animation */}
      <LevelUpAnimation 
        trigger={showLevelUp} 
        onComplete={() => setShowLevelUp(false)}
      />

      {/* Navigation Tabs */}
      <div className="sticky top-20 z-10 bg-slate-900/90 backdrop-blur-md border-b border-purple-500/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform -translate-y-1'
                    : 'text-purple-200 hover:text-white hover:bg-slate-800/50 hover:shadow-md border border-purple-500/30'
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="font-rajdhani font-semibold">{section.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeSection === 'character' && (
            <motion.div
              key="character"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              ref={(el) => {
                sectionsRef.current.character = el;
                if (el) handleSectionVisible('character');
              }}
              className="space-y-8"
            >
              {/* Character Profile */}
              <CharacterProfile 
                heroData={resumeData.hero}
                level={currentLevel}
                currentXP={currentXP}
                maxXP={maxXP}
              />

              {/* Quick Stats Overview */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 rounded-3xl shadow-xl p-8 border border-purple-500/30"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white font-orbitron mb-2 flex items-center justify-center">
                    <span className="mr-3">📊</span>
                    Character Stats
                  </h2>
                  <p className="text-purple-200 font-rajdhani">Your professional attributes</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {resumeData.quickStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -8 }}
                      className="bg-gradient-to-br from-slate-700/80 to-slate-600/80 rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 shadow-lg hover:shadow-2xl"
                    >
                      <div className="text-3xl mb-3 text-center">{stat.icon}</div>
                      <div className="text-sm font-bold text-white mb-3 text-center font-orbitron">{stat.label}</div>
                      <div className="text-xs text-purple-200 text-center font-semibold">{stat.value}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeSection === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              ref={(el) => {
                sectionsRef.current.skills = el;
                if (el) handleSectionVisible('skills');
              }}
            >
              <SkillTree 
                skills={resumeData.skills}
                onSkillClick={(skill) => console.log('Skill clicked:', skill)}
              />
            </motion.div>
          )}

          {activeSection === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              ref={(el) => {
                sectionsRef.current.achievements = el;
                if (el) handleSectionVisible('achievements');
              }}
            >
              <AchievementBadges 
                achievements={[]}
                certifications={resumeData.certifications}
                hobbies={resumeData.hobbies}
              />
            </motion.div>
          )}

          {activeSection === 'quests' && (
            <motion.div
              key="quests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              ref={(el) => {
                sectionsRef.current.quests = el;
                if (el) handleSectionVisible('quests');
              }}
            >
              <QuestLog 
                experience={resumeData.experience}
                education={resumeData.education}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer CTA */}
      <FooterCTA contactData={resumeData.contact} />
    </div>
  );
};

export default Resume; 