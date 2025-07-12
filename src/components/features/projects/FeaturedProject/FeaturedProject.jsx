import React, { useState } from "react";
import { ProjectCardBase } from "@/components/base";
import ProjectModal from "../ProjectModal/ProjectModal";
import { uiContent } from "@/data";
import './FeaturedProject.css';

const FeaturedProject = ({ project, enableHover = true }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <ProjectCardBase
        project={project}
        variant="featured"
        size="large"
        enableHover={enableHover}
        showImage={false}
        showYear={false}
        showBadge={true}
        showActions={true}
        uiContent={uiContent}
        onClick={handleViewDetails}
        className="featured-project-container"
        style={{
          '--project-bg-image': `url(${project.image})`
        }}
      />

      <ProjectModal
        project={project}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default FeaturedProject; 