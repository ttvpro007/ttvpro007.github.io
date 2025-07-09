import React from "react";
import { ProjectCardBase } from "./base";
import { projects } from "../data";

const ProjectCard = ({ 
  project, 
  onClick, 
  size = 'medium',
  entryStrategy = "scaleFade",
  hoverStrategy = "hover"
}) => {
  return (
    <ProjectCardBase
      project={project}
      onClick={onClick}
      size={size}
      entryStrategy={entryStrategy}
      hoverStrategy={hoverStrategy}
    />
  );
};

export default ProjectCard; 