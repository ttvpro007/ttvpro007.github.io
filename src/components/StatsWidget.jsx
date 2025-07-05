import React from "react";
import { motion } from "framer-motion";
import projectsConfig from "../data/projectsConfig.json";
import projectsContent from "../data/projectsContent.json";
import { Section, ProgressBar } from "./base";

export default function StatsWidget({ projects }) {
  const techStats = projects.reduce((acc, project) => {
    project.tech?.forEach(tech => {
      acc[tech] = (acc[tech] || 0) + 1;
    });
    return acc;
  }, {});
  
  const yearStats = projects.reduce((acc, project) => {
    acc[project.year] = (acc[project.year] || 0) + 1;
    return acc;
  }, {});
  
  return (
    <Section 
      title={projectsContent.statsWidget.title}
      style={{ marginBottom: '2rem' }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
      }}>
        {/* Tech Stats */}
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {projectsContent.statsWidget.sections.techUsage.title}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Object.entries(techStats)
              .sort(([,a], [,b]) => b - a)
              .slice(0, projectsConfig.stats.maxTechDisplay)
              .map(([tech, count]) => (
                <div key={tech} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: projectsConfig.stats.barWidth,
                    height: projectsConfig.stats.barHeight,
                    background: 'var(--border)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                    <ProgressBar 
                      progress={count} 
                      max={Math.max(...Object.values(techStats))} 
                      height={projectsConfig.stats.barHeight}
                      animated={false}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                    {tech.toUpperCase()} ({count})
                  </span>
                </div>
              ))}
          </div>
        </div>
        
        {/* Year Stats */}
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {projectsContent.statsWidget.sections.yearlyBreakdown.title}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Object.entries(yearStats)
              .sort(([a], [b]) => b - a)
              .map(([year, count]) => (
                <div key={year} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: projectsConfig.stats.barWidth,
                    height: projectsConfig.stats.barHeight,
                    background: 'var(--border)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                    <ProgressBar 
                      progress={count} 
                      max={Math.max(...Object.values(yearStats))} 
                      height={projectsConfig.stats.barHeight}
                      color="var(--accent)"
                      animated={false}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                    {year} ({count})
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Section>
  );
} 