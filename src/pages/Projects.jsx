import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "../components/ProjectCard";
import FeaturedProject from "../components/FeaturedProject";
import SearchAndFilter from "../components/SearchAndFilter";
import ProjectModal from "../components/ProjectModal";
import { projects } from "../data";
import { ProgressBar } from "../components/base";

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
    const pattern = ['small', 'medium', 'large'];
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

  // Colorful gradients for progress bars
  const gradients = [
    'linear-gradient(90deg, #ff6b6b, #4ecdc4)',
    'linear-gradient(90deg, #a8e6cf, #dcedc1)',
    'linear-gradient(90deg, #8b4513, #d2691e)',
    'linear-gradient(90deg, #667eea, #764ba2)',
    'linear-gradient(90deg, #FC9460, #A92F5F)',
    'linear-gradient(90deg, #64A47F, #EEB64B)',
    'linear-gradient(90deg, #E54264, #442261)'
  ];

  return (
    <main>
      <div className="body-panel">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: "relative",
            minHeight: "100vh",
            overflow: "hidden"
          }}
        >
          {/* Floating Background Elements */}
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: -1
          }}>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: "absolute",
                  width: Math.random() * 200 + 50,
                  height: Math.random() * 200 + 50,
                  background: `radial-gradient(circle, var(--primary) 0%, transparent 70%)`,
                  opacity: 0.03,
                  borderRadius: "50%",
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, 20, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20 + Math.random() * 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </div>

          {/* Featured Project - Centered with Offset */}
          {featuredProject && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: 0.3, 
                duration: 0.6, 
                ease: [0.25, 0.46, 0.45, 0.94] 
              }}
              style={{
                width: "100%",
                margin: "0 auto 3rem auto",
                transform: "rotate(-1deg)"
              }}
            >
              <FeaturedProject project={featuredProject} />
            </motion.div>
          )}

          {/* Compact Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.4, 
              duration: 0.5, 
              ease: [0.25, 0.46, 0.45, 0.94] 
            }}
            style={{
              width: "100%",
              margin: "0 auto 3rem auto"
            }}
          >
            <div 
              className="compact-stats-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2rem",
                alignItems: "start"
              }}
            >
              {/* Most Used Tech */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 0.5, 
                  duration: 0.5, 
                  ease: [0.25, 0.46, 0.45, 0.94] 
                }}
                className="compact-stats-card"
                style={{
                  background: "var(--card-bg)",
                  borderRadius: "var(--border-radius)",
                  padding: "1.5rem",
                  border: "2px solid var(--primary)",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
                  transform: "rotate(-0.5deg"
                }}
              >
                <h3 
                  className="compact-stats-title body-text"
                  style={{ 
                    color: "var(--text)", 
                    marginBottom: "1rem",
                    fontWeight: "bold",
                    textAlign: "center"
                  }}
                >
                  🛠️ Most Used Tech
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {(() => {
                    const techUsage = {};
                    projects.items.forEach(project => {
                      project.tech.forEach(tech => {
                        techUsage[tech] = (techUsage[tech] || 0) + 1;
                      });
                    });
                    const sortedTech = Object.entries(techUsage)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5);
                    
                    return sortedTech.map(([tech, count], index) => (
                      <motion.div
                        key={tech}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: 0.6 + index * 0.1,
                          duration: 0.3
                        }}
                        className="compact-stats-item"
                        style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
                      >
                        <div style={{ 
                          minWidth: "60px",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                          color: "var(--text)"
                        }}>
                          {tech}
                        </div>
                        <div style={{ flex: 1 }}>
                          <ProgressBar
                            progress={count}
                            max={Math.max(...sortedTech.map(([,c]) => c))}
                            height="8px"
                            color={gradients[index % gradients.length]}
                            bgColor="var(--border)"
                            animated={true}
                          />
                        </div>
                        <div style={{ 
                          minWidth: "25px",
                          textAlign: "right",
                          fontSize: "0.85rem",
                          color: "var(--primary)",
                          fontWeight: "bold"
                        }}>
                          {count}
                        </div>
                      </motion.div>
                    ));
                  })()}
                </div>
              </motion.div>

              {/* Projects by Year */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 0.5, 
                  duration: 0.5, 
                  ease: [0.25, 0.46, 0.45, 0.94] 
                }}
                className="compact-stats-card"
                style={{
                  background: "var(--card-bg)",
                  borderRadius: "var(--border-radius)",
                  padding: "1.5rem",
                  border: "2px solid var(--primary)",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
                  transform: "rotate(0.5deg)"
                }}
              >
                <h3 
                  className="compact-stats-title body-text"
                  style={{ 
                    color: "var(--text)", 
                    marginBottom: "1rem",
                    fontWeight: "bold",
                    textAlign: "center"
                  }}
                >
                  📅 Projects by Year
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {(() => {
                    const yearlyBreakdown = {};
                    projects.items.forEach(project => {
                      yearlyBreakdown[project.year] = (yearlyBreakdown[project.year] || 0) + 1;
                    });
                    const sortedYears = Object.entries(yearlyBreakdown)
                      .sort(([a], [b]) => parseInt(b) - parseInt(a));
                    
                    return sortedYears.map(([year, count], index) => (
                      <motion.div
                        key={year}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: 0.6 + index * 0.1,
                          duration: 0.3
                        }}
                        className="compact-stats-item"
                        style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
                      >
                        <div style={{ 
                          minWidth: "60px",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                          color: "var(--text)"
                        }}>
                          {year}
                        </div>
                        <div style={{ flex: 1 }}>
                          <ProgressBar
                            progress={count}
                            max={Math.max(...sortedYears.map(([,c]) => c))}
                            height="8px"
                            color={gradients[index % gradients.length]}
                            bgColor="var(--border)"
                            animated={true}
                          />
                        </div>
                        <div style={{ 
                          minWidth: "25px",
                          textAlign: "right",
                          fontSize: "0.85rem",
                          color: "var(--primary)",
                          fontWeight: "bold"
                        }}>
                          {count}
                        </div>
                      </motion.div>
                    ));
                  })()}
                </div>
              </motion.div>
            </div>
          </motion.div>

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
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.5, 
              duration: 0.6, 
              ease: [0.25, 0.46, 0.45, 0.94] 
            }}
            style={{
              margin: "0 auto",
              paddingBottom: "4rem",
              width: "100%"
            }}
          >
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem",
              gridAutoRows: "auto",
              gridAutoFlow: "dense",
              alignItems: "start",
              justifyContent: "center",
              justifyItems: "center",
            }}>
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
                      whileHover={{ 
                        y: -8,
                        scale: 1.02,
                        transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
                      }}
                      style={{
                        transform: `rotate(${Math.sin(index) * 2}deg)`,
                        position: "relative",
                        zIndex: 1,
                        // Make large cards span 2 columns without affecting grid flow
                        gridColumn: size === 'large' ? 'span 2' : 'span 1'
                      }}
                    >
                      <div style={{
                        minHeight: size === 'large' ? '400px' : size === 'medium' ? '320px' : '280px',
                        transition: "all 0.3s ease",
                        position: "relative",
                        zIndex: 2,
                        width: "100%",
                        display: "flex",
                        flexDirection: "column"
                      }}>
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
                style={{
                  textAlign: "center",
                  padding: "6rem 2rem",
                  background: "var(--card-bg)",
                  borderRadius: "var(--border-radius)",
                  border: "2px solid var(--primary)",
                  margin: "2rem 0",
                  transform: "rotate(-0.5deg)"
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: "5rem", marginBottom: "1rem" }}
                >
                  {projects.ui.noResults.icon}
                </motion.div>
                <h3 style={{ 
                  marginBottom: "0.5rem", 
                  color: "var(--text)",
                  fontSize: "1.5rem"
                }}>
                  {projects.ui.noResults.title}
                </h3>
                <p style={{ color: "var(--text-secondary)" }}>
                  {projects.ui.noResults.description}
                </p>
              </motion.div>
            )}
          </motion.div>



          {/* Responsive Design */}
          <style>{`
            @media (max-width: 1024px) {
              .floating-stats {
                display: none !important;
              }
              .masonry-grid {
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
              }
            }
            @media (max-width: 768px) {
              h1 {
                font-size: 2.5rem !important;
              }
              .hero-section {
                padding: 2rem 1rem 4rem 1rem !important;
              }
              .masonry-grid {
                grid-template-columns: 1fr !important;
                gap: 1.5rem !important;
              }
              .compact-stats-grid {
                grid-template-columns: 1fr !important;
                gap: 1.5rem !important;
              }
              .compact-stats-card {
                padding: 1rem !important;
              }
              .compact-stats-title {
                font-size: 1rem !important;
              }
              .compact-stats-item {
                font-size: 0.8rem !important;
              }
            }
          `}</style>
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