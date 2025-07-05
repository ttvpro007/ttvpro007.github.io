import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge, Button } from "./base";
import ProjectModal from "./ProjectModal";
import { projects } from "../data";

const FeaturedProject = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "relative",
          height: projects.config.layout.featuredHeight,
          borderRadius: "var(--border-radius)",
          overflow: "hidden",
          marginBottom: "2rem",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
        }}
      >
        {/* Background Image */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%), url(${project.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }} />

        {/* Content Overlay */}
        <div style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "2rem",
          color: "white"
        }}>
          {/* Featured Badge */}
          <div style={{ marginBottom: "1rem" }}>
            <Badge
              style={{
                background: "var(--primary)",
                color: "var(--card-bg)",
                fontWeight: "bold",
                fontSize: "0.9rem",
                padding: "0.5rem 1rem"
              }}
            >
              {projects.ui.featuredProject.badge}
            </Badge>
          </div>

          {/* Project Title */}
          <h2 style={{
            margin: "0 0 1rem 0",
            fontSize: "2.5rem",
            fontWeight: "bold",
            textShadow: "0 2px 4px rgba(0,0,0,0.5)"
          }}>
            {project.title}
          </h2>

          {/* Project Description */}
          <p style={{
            margin: "0 0 1.5rem 0",
            fontSize: "1.1rem",
            lineHeight: "1.6",
            maxWidth: "600px",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)"
          }}>
            {project.longDescription || project.description}
          </p>

          {/* Tech Stack */}
          <div style={{
            display: "flex",
            gap: "0.75rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap"
          }}>
            {project.tech.map((tech, index) => (
              <Badge
                key={index}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  fontSize: "0.9rem",
                  padding: "0.5rem 1rem"
                }}
              >
                {tech}
              </Badge>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap"
          }}>
            <Button
              onClick={handleViewDetails}
              variant="primary"
              style={{
                background: "var(--primary)",
                color: "var(--card-bg)",
                border: "none",
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                fontWeight: "bold"
              }}
            >
              {projects.ui.featuredProject.button}
            </Button>

            {project.demo && (
              <Button
                onClick={() => window.open(project.demo, "_blank")}
                variant="outline"
                style={{
                  background: "transparent",
                  color: "white",
                  border: "2px solid white",
                  padding: "0.75rem 1.5rem",
                  fontSize: "1rem"
                }}
              >
                🚀 Live Demo
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      <ProjectModal
        project={project}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default FeaturedProject; 