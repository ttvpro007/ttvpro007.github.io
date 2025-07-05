import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "../components/ProjectCard";
import FeaturedProject from "../components/FeaturedProject";
import SearchAndFilter from "../components/SearchAndFilter";
import StatsWidget from "../components/StatsWidget";
import ProjectModal from "../components/ProjectModal";
import { projects } from "../data";

const Projects = () => {
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
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

        {/* Hero Section with Diagonal Design */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            position: "relative",
            padding: "4rem 2rem 6rem 2rem",
            background: "linear-gradient(135deg, var(--card-bg) 0%, transparent 100%)",
            clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
            marginBottom: "2rem"
          }}
        >
          <div style={{
            maxWidth: "1200px",
            margin: "0 auto",
            textAlign: "center"
          }}>
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                fontSize: "4rem",
                fontWeight: "900",
                background: "linear-gradient(45deg, var(--primary), #FC9460, #A92F5F)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "1rem",
                textShadow: "0 0 30px rgba(252, 148, 96, 0.3)"
              }}
            >
              {projects.config.pageTitle}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                fontSize: "1.3rem",
                color: "var(--text-secondary)",
                maxWidth: "600px",
                margin: "0 auto 2rem auto",
                lineHeight: "1.6"
              }}
            >
              Dive into my digital playground where code meets creativity
            </motion.p>
          </div>
        </motion.div>



        {/* Featured Project - Centered with Offset */}
        {featuredProject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0 }}
            style={{
              maxWidth: "1000px",
              margin: "0 auto 4rem auto",
              padding: "0 2rem",
              transform: "rotate(-1deg)"
            }}
          >
            <FeaturedProject project={featuredProject} />
          </motion.div>
        )}

        {/* Floating Search and Filter */}
        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          projects={projects.items}
          animationStrategy="scaleFade" // Test different strategies: "scaleFade", "slideFade", "bouncePop", "flipRotate"
        />

        {/* Floating Stats Cards */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
          style={{
            position: "fixed",
            top: "200px",
            right: "2rem",
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}
        >
          <motion.div
            style={{
              background: "var(--card-bg)",
              borderRadius: "15px",
              padding: "1rem",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(10px)",
              transform: "rotate(2deg)"
            }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div style={{ fontSize: "1.5rem", textAlign: "center" }}>📊</div>
            <div style={{ fontSize: "0.8rem", textAlign: "center", fontWeight: "bold" }}>
              {filteredProjects.length} Projects
            </div>
          </motion.div>
          
          <motion.div
            style={{
              background: "var(--card-bg)",
              borderRadius: "15px",
              padding: "1rem",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(10px)",
              transform: "rotate(-1deg)"
            }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div style={{ fontSize: "1.5rem", textAlign: "center" }}>🎯</div>
            <div style={{ fontSize: "0.8rem", textAlign: "center", fontWeight: "bold" }}>
              {new Set(filteredProjects.flatMap(p => p.tech)).size} Tech
            </div>
          </motion.div>
        </motion.div>

        {/* Masonry-Style Projects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 2rem 4rem 2rem"
          }}
        >
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
            gridAutoRows: "auto",
            gridAutoFlow: "dense",
            alignItems: "start"
          }}>
            <AnimatePresence>
              {nonFeaturedProjects.map((project, index) => {
                const size = getProjectSize(index);
                
                return (
                  <motion.div
                    key={project.title}
                    initial={{ opacity: 0, y: 50, rotate: -5 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    exit={{ opacity: 0, y: -50, rotate: 5 }}
                    transition={{ 
                      delay: 0.1 * index,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      y: -10,
                      rotate: 1,
                      transition: { type: "spring", stiffness: 300 }
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
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                textAlign: "center",
                padding: "6rem 2rem",
                background: "var(--card-bg)",
                borderRadius: "30px",
                border: "2px dashed var(--border)",
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

        {/* Full Stats Section at Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0 }}
          style={{
            background: "linear-gradient(135deg, var(--card-bg) 0%, transparent 100%)",
            padding: "4rem 2rem",
            marginTop: "4rem",
            clipPath: "polygon(0 15%, 100% 0, 100% 100%, 0 85%)"
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <StatsWidget projects={projects.items} />
          </div>
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
          }
        `}</style>
      </motion.div>

      {/* Full-Screen Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default Projects; 