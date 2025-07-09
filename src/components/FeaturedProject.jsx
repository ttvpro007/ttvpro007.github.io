import React, { useState } from "react";
import { Card, Badge, Button, TechStack } from "./base";
import ProjectModal from "./ProjectModal";
import { projects } from "../data";
import '../styling/components/featured-project.css';

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
      <Card
        className="featured-project-container"
        hover={false}
        style={{
          '--project-bg-image': `url(${project.image})`
        }}
      >
        {/* Background Image with Gradient Overlay */}
        <div className="featured-project-bg" />

        {/* Content Overlay */}
        <div className="featured-project-overlay">
          {/* Featured Badge */}
          <div className="featured-project-badge">
            <Badge>
              {projects.ui.featuredProject.badge}
            </Badge>
          </div>

          {/* Project Title */}
          <h2 className="featured-project-title">
            {project.title}
          </h2>

          {/* Project Description */}
          <p className="featured-project-description">
            {project.longDescription || project.description}
          </p>

          {/* Tech Stack */}
          <div className="featured-project-techstack">
            <TechStack 
              tech={project.tech}
              maxDisplay={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="featured-project-actions">
            <Button
              onClick={handleViewDetails}
              variant="primary"
              className="featured-project-button"
            >
              {projects.ui.featuredProject.button}
            </Button>

            {project.demo && (
              <Button
                onClick={() => window.open(project.demo, "_blank")}
                variant="outline"
                className="featured-project-demo"
              >
                🚀 Live Demo
              </Button>
            )}
          </div>
        </div>
      </Card>

      <ProjectModal
        project={project}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default FeaturedProject; 