import React from "react";
import { ProjectCardBase } from "./base";
import "../styling/components/project-card.css";

const ProjectCard = ({ 
  project, 
  onClick, 
  size = 'medium',
  variant = 'default',
  entryStrategy = "scaleFade",
  hoverStrategy = "hover"
}) => {
  return (
    <ProjectCardBase
      project={project}
      onClick={onClick}
      size={size}
      variant={variant}
      entryStrategy={entryStrategy}
      hoverStrategy={hoverStrategy}
      showImage={true}
      showTech={true}
      showYear={true}
      showBadge={false}
      showActions={false}
    />
  );
};

export default ProjectCard; 