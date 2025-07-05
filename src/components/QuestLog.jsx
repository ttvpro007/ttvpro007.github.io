import React from "react";
import { motion } from "framer-motion";
import { Card, Badge, Icon, Section } from "./base";
import { questLog, uiContent } from "../data";

function QuestCard({ quest }) {
  return (
    <Card hover={true} style={{ height: 'auto' }}>
      {/* Quest header */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <Icon 
          emoji={quest.icon} 
          size="medium" 
          circular={true}
          style={{ background: "var(--primary)" }}
        />
        <div>
          <h4 style={{ color: "var(--text)", margin: "0 0 0.25rem 0" }}>
            {quest.title}
          </h4>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {quest.year}
          </div>
        </div>
      </div>
      
      {/* Quest description */}
      <p style={{ color: "var(--text-secondary)", marginBottom: "1rem", lineHeight: "1.5" }}>
        {quest.description}
      </p>
      
      {/* Tech stack */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {quest.tech.map((tech, index) => (
          <Badge key={index} size="small">
            {tech}
          </Badge>
        ))}
      </div>
      
      {/* Reward */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        color: "var(--primary)",
        fontSize: "0.9rem",
        fontWeight: "bold"
      }}>
        <span>{questLog.config.rewardIcon}</span>
        <span>+{quest.xp} XP</span>
      </div>
    </Card>
  );
}

function QuestLog({ projects }) {
  const quests = projects.map(project => ({
    title: project.title,
    description: project.description,
    year: project.year,
    tech: project.tech,
    icon: questLog.config.questIcon,
    xp: Math.floor(Math.random() * (questLog.config.xpRange.max - questLog.config.xpRange.min + 1)) + questLog.config.xpRange.min
  }));

  return (
    <Section 
      title={uiContent.sections.questLog.title} 
      icon={uiContent.sections.questLog.icon} 
      centered={true}
    >
      <div style={{
        display: "grid",
        gridTemplateColumns: questLog.gridConfig.columns,
        gap: questLog.gridConfig.gap
      }}>
        {quests.map((quest, index) => (
          <QuestCard key={index} quest={quest} />
        ))}
      </div>
    </Section>
  );
}

export default QuestLog; 