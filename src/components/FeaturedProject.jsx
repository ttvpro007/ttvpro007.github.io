import React, { useState } from "react";
import { AnimatedContainer, Badge, Button, TechStack } from "./base";
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
      <AnimatedContainer
        entryStrategy="slideUp"
        style={{
          position: "relative",
          height: projects.config.layout.featuredHeight,
          borderRadius: "var(--border-radius)",
          overflow: "hidden",
          marginBottom: "2rem",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
          width: "100%",
          border: "3px solid var(--primary)",
          boxSizing: "border-box"
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
          justifyContent: "flex-start",
          padding: "2rem",
          boxSizing: "border-box",
          overflow: "auto",
          color: "white",
          width: "100%",
          paddingTop: "2.5rem", // extra top padding to ensure header is not cut off
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
            margin: 0,
            fontSize: "1.3rem",
            fontWeight: "bold",
            color: "var(--text)",
            textShadow: "0 1px 2px rgba(0,0,0,0.1)",
            lineHeight: "1.2"
          }}>
            {project.title}
          </h2>

          {/* Project Description */}
          <p style={{
            margin: "0.75rem 0 1.25rem 0",
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            lineHeight: "1.6",
            textShadow: "0 1px 1px rgba(0,0,0,0.05)",
            width: "100%"
          }}>
            {project.longDescription || project.description}
          </p>

          {/* Tech Stack */}
          <TechStack 
            tech={project.tech}
            maxDisplay={4}
            style={{ marginBottom: "1rem" }}
          />

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
      </AnimatedContainer>

      <ProjectModal
        project={project}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default FeaturedProject; 