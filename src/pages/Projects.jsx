import React, { useState } from "react";
import { motion } from "framer-motion";
import projects from "../data/projects.json";
import projectsConfig from "../data/projectsConfig.json";
import projectsContent from "../data/projectsContent.json";
import FeaturedProject from "../components/FeaturedProject";
import SearchAndFilter from "../components/SearchAndFilter";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import StatsWidget from "../components/StatsWidget";

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = searchTerm === '' || 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tech?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === null || project.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return b.year - a.year;
      } else {
        return a.tech?.join('').localeCompare(b.tech?.join('') || '');
      }
    });
  
  const featuredProject = projects.find(p => p.featured);
  const regularProjects = filteredProjects.filter(p => !p.featured);
  
  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };
  
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
        transition={{ 
          duration: projectsConfig.animations.pageEnter.duration, 
          ease: projectsConfig.animations.pageEnter.ease 
        }}
        style={{
          width: '100%',
          maxWidth: projectsConfig.layout.maxWidth,
        }}
      >
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          fontSize: '2.5rem',
        }}>
          {projectsConfig.pageTitle}
        </h1>
        
        {/* Featured Project */}
        {featuredProject && (
          <FeaturedProject 
            project={featuredProject} 
            onViewDetails={handleViewDetails}
          />
        )}
        
        {/* Search and Filter */}
        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        
        {/* Stats Widget */}
        <StatsWidget projects={projects} />
        
        {/* Projects Grid */}
        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${projectsConfig.gridSettings.minCardWidth}, 1fr))`,
            gap: projectsConfig.gridSettings.gap,
            width: '100%',
          }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: projectsConfig.animations.cardStagger.delay
              }
            }
          }}
          initial="hidden"
          animate="visible"
        >
          {regularProjects.map((project, idx) => (
            <ProjectCard
              key={`${project.title}-${idx}`}
              project={project}
              onViewDetails={handleViewDetails}
            />
          ))}
        </motion.div>
        
        {/* No Results */}
        {regularProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--text-secondary)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              {projectsContent.noResults.icon}
            </div>
            <h3>{projectsContent.noResults.title}</h3>
            <p>{projectsContent.noResults.description}</p>
          </motion.div>
        )}
      </motion.div>
      
      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
} 