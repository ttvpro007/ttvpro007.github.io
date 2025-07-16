import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "@/components/features/projects/ProjectCard";
import FeaturedProject from "@/components/features/projects/FeaturedProject";
import SearchAndFilter from "@/components/features/projects/SearchAndFilter";
import ProjectModal from "@/components/features/projects/ProjectModal";
import StatsCard from "@/components/features/projects/StatsCard";
import { projects, uiContent } from "@/data";
import { ProgressBar, Section } from "@/components/base";
import "./Projects.css";

const Projects = ({ isTransitioning = false }) => {
  const [filteredProjects, setFilteredProjects] = useState(projects.items);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let filtered = projects.items;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tech.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Sort projects
    if (sortBy === "recent") {
      filtered.sort((a, b) => b.year - a.year);
    } else if (sortBy === "tech") {
      filtered.sort((a, b) => a.tech[0].localeCompare(b.tech[0]));
    }

    setFilteredProjects(filtered);
  }, [searchTerm, selectedCategory, sortBy]);

  const featuredProject = projects.items.find(project => project.featured);
  const nonFeaturedProjects = filteredProjects.filter(project => !project.featured);

  // Determine card size based on available space and content
  const getProjectSize = (index) => {
    // Use a simple pattern but let CSS Grid handle the actual sizing
    const pattern = ['small', 'small','large']
    return pattern[index % pattern.length];
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // Prepare stats data
  const getTechUsageData = () => {
    const techUsage = {};
    projects.items.forEach(project => {
      project.tech.forEach(tech => {
        techUsage[tech] = (techUsage[tech] || 0) + 1;
      });
    });
    return Object.entries(techUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const getYearlyBreakdownData = () => {
    const yearlyBreakdown = {};
    projects.items.forEach(project => {
      yearlyBreakdown[project.year] = (yearlyBreakdown[project.year] || 0) + 1;
    });
    return Object.entries(yearlyBreakdown)
      .sort(([a], [b]) => parseInt(b) - parseInt(a));
  };

  return (
    <main>
      <div className="body-panel">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="projects-main-container"
        >

          {/* Featured Project Section */}
          {featuredProject && (
            <Section
              padding="0"
              marginBottom="2rem"
              className="projects-featured-section"
              style={{ border: 'none', background: 'none' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 0.3, 
                  duration: 0.6, 
                  ease: [0.25, 0.46, 0.45, 0.94] 
                }}
                className="projects-featured-container"
              >
                <FeaturedProject project={featuredProject} enableHover={false} />
              </motion.div>
            </Section>
          )}

          {/* Compact Stats Section */}
                      <Section
              padding="0"
              marginBottom="0"
              className="projects-stats-section"
              style={{ border: 'none', background: 'none', boxShadow: 'none' }}
            >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.4, 
                duration: 0.5, 
                ease: [0.25, 0.46, 0.45, 0.94] 
              }}
              className="projects-stats-container"
            >
              <div className="projects-compact-stats-grid">
                <StatsCard
                  title="Most Used Tech"
                  icon="🛠️"
                  data={getTechUsageData()}
                  animationDelay={0.5}
                  animationDirection="left"
                  className="projects-compact-stats-card-left"
                />
                <StatsCard
                  title="Projects by Year"
                  icon="📅"
                  data={getYearlyBreakdownData()}
                  animationDelay={0.5}
                  animationDirection="right"
                  className="projects-compact-stats-card-right"
                />
              </div>
            </motion.div>
          </Section>

          {/* Floating Search and Filter */}
          <SearchAndFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            projects={projects.items}
            animationStrategy="slideFade"
            isTransitioning={isTransitioning}
          />

          {/* Masonry-Style Projects Grid */}
          <Section
            padding="0"
            marginBottom="0"
            className="projects-grid-section"
            style={{ border: 'none', background: 'none', boxShadow: 'none' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.5, 
                duration: 0.6, 
                ease: [0.25, 0.46, 0.45, 0.94] 
              }}
              className="projects-grid-container"
            >
              <div className="projects-masonry-grid">
                <AnimatePresence>
                  {nonFeaturedProjects.map((project, index) => {
                    const size = getProjectSize(index);
                    
                    return (
                      <motion.div
                        key={project.title}
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.95 }}
                        transition={{ 
                          delay: 0.6 + (0.05 * index),
                          duration: 0.5,
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        className="projects-card-wrapper"
                        style={{
                          transform: `rotate(${Math.sin(index) * 2}deg)`,
                          gridColumn: size === 'large' ? 'span 2' : 'span 1'
                        }}
                      >
                        <div className={`projects-card-container ${size}`}>
                          <ProjectCard 
                            project={project} 
                            size={size}
                            onClick={() => handleProjectClick(project)}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* No Results - Centered with Style */}
              {filteredProjects.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: 0.7, 
                    duration: 0.5, 
                    ease: [0.25, 0.46, 0.45, 0.94] 
                  }}
                  className="projects-no-results"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="projects-no-results-icon"
                  >
                    {uiContent.ui.noResults.icon}
                  </motion.div>
                  <h3 className="projects-no-results-title">
                    {uiContent.ui.noResults.title}
                  </h3>
                  <p className="projects-no-results-description">
                    {uiContent.ui.noResults.description}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </Section>
        </motion.div>

        {/* Full-Screen Modal */}
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </main>
  );
};

export default Projects; 