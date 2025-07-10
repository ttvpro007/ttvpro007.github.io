import React from "react";
import { motion } from "framer-motion";
import { Card, ProgressBar } from "../components/base";
import { profile, projects } from "../data";
import "../styling/pages/resume.css";

const Resume = () => {
  // Use consolidated project data
  const resumeProjects = projects.items
    .filter(p => p.showOnResume)
    .sort((a, b) => (a.resumeOrder || 0) - (b.resumeOrder || 0));

  return (
    <main>
      <div className="body-panel">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="resume-main-container"
        >
          {/* Profile Section */}
          <Card className="resume-profile-card" hover={false}>
            <div className="resume-profile-content">
              <img
                src={profile.personal.profilePic}
                alt={profile.personal.name}
                className="resume-profile-pic"
              />
              <h2 className="header-2 resume-profile-name">
                {profile.personal.name}
              </h2>
              <p className="body-text resume-profile-tagline">
                {profile.personal.tagline}
              </p>
            </div>
          </Card>

          {/* Skills Section (all categories, concise version) */}
          <Card className="resume-skills-card" hover={false}>
            <h3 className="header-3 resume-skills-title">Skills</h3>
            {profile.skills && profile.skills.categories && Object.entries(profile.skills.categories).map(([categoryName, categoryData], categoryIndex) => (
              <div key={categoryIndex} className="resume-skills-category">
                <h4 className="resume-skills-category-title">{categoryName}</h4>
                {categoryData.skills.map((skill, skillIndex) => {
                  // Concise skill bar: no description, smaller bar, tighter spacing
                  const percent = skill.level || skill.percentage;
                  return (
                    <div key={skillIndex} className="resume-skill-item">
                      <div className="resume-skill-header">
                        <span className="resume-skill-icon">{skill.icon}</span>
                        <span className="resume-skill-name">{skill.name}</span>
                        <span className="resume-skill-percentage">{percent}%</span>
                      </div>
                      <div className="resume-skill-progress">
                        <ProgressBar
                          progress={percent}
                          max={100}
                          height="7px"
                          color={skill.color || (skill.theme === 'filament' ? 'linear-gradient(90deg, #ff6b6b, #4ecdc4)' : skill.theme === 'switch' ? 'linear-gradient(90deg, #a8e6cf, #dcedc1)' : skill.theme === 'shavings' ? 'linear-gradient(90deg, #8b4513, #d2691e)' : skill.theme === 'rocket' ? 'linear-gradient(90deg, #667eea, #764ba2)' : 'var(--primary)')}
                          bgColor="#222"
                          glow={true}
                          animatedGradient={skill.theme === 'filament' || skill.theme === 'switch' || skill.theme === 'shavings' || skill.theme === 'rocket'}
                          animated={true}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </Card>

          {/* Education Section */}
          <Card className="resume-education-card" hover={false}>
            <h3 className="header-3 resume-education-title">Education</h3>
            <div className="resume-education-list">
              {profile.education && profile.education.map((edu, index) => (
                <div key={index} className="resume-education-item">
                  <div className="resume-education-header">
                    <span className="resume-education-icon">{edu.icon}</span>
                    <div className="resume-education-info">
                      <h4 className="resume-education-degree">{edu.degree}</h4>
                      <p className="resume-education-institution">{edu.institution}</p>
                      <span className="small-text resume-education-year">{edu.year}</span>
                    </div>
                  </div>
                  <p className="body-text resume-education-description">
                    {edu.description}
                  </p>
                  {edu.relevantCourses && (
                    <div className="resume-education-courses">
                      <span className="xsmall-text resume-courses-label">Relevant Courses:</span>
                      <div className="resume-courses-list">
                        {edu.relevantCourses.map((course, courseIndex) => (
                          <span
                            key={courseIndex}
                            className="xsmall-text resume-course-tag"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Projects Section */}
          <Card className="resume-projects-card" hover={false}>
            <h3 className="header-3 resume-projects-title">Projects</h3>
            <div className="resume-projects-list">
              {resumeProjects.map((project, index) => (
                <div key={index} className="resume-project-item">
                  <div className="resume-project-header">
                    <h4 className="resume-project-title">{project.title}</h4>
                    <span className="small-text resume-project-year">{project.year}</span>
                  </div>
                  <p className="body-text resume-project-description">
                    {project.longDescription}
                  </p>
                  <div className="resume-project-tech">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="xsmall-text resume-tech-tag"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  );
};

export default Resume; 