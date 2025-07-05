import React from "react";
import { motion } from "framer-motion";
import CharacterProfile from "../components/CharacterProfile";
import SkillTree from "../components/SkillTree";
import Achievements from "../components/Achievements";
import QuestLog from "../components/QuestLog";
import profile from "../data/profileResume.json";
import projects from "../data/projectsResume.json";

export default function Resume() {
  return (
    <section style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      minHeight: '50vh',
      maxWidth: '100%',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: '1200px',
        }}
      >
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          fontSize: '2.5rem',
        }}>
          🎮 Character Sheet
        </h1>
        <CharacterProfile profile={profile} />
        <SkillTree skills={profile.skills} />
        <Achievements />
        <QuestLog projects={projects} />
      </motion.div>
    </section>
  );
} 