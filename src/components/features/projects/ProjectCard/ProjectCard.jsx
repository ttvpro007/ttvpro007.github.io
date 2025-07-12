import React from "react";
import { ProjectCardBase } from "@/components/base";
import './ProjectCard.css';

const ProjectCard = ({ 
  project, 
  onClick, 
  size = 'medium',
  variant = 'default',
  entryStrategy = "scaleFade",
  hoverStrategy = "hover",
  enableHover = true
}) => {
  return (
    <ProjectCardBase
      project={project}
      onClick={onClick}
      size={size}
      variant={variant}
      entryStrategy={entryStrategy}
      hoverStrategy={hoverStrategy}
      enableHover={enableHover}
      showImage={true}
      showTech={true}
      showYear={true}
      showBadge={false}
      showActions={false}
    />
  );
};

export default ProjectCard; 