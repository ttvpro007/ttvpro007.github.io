import React from "react";
import { 
  AnimatedContainer, 
  ImageContainer, 
  TechStack, 
  YearBadge 
} from "./index";
import { AnimationCategories } from "../../utils/animations";

const ProjectCardBase = ({ 
  project,
  onClick,
  size = 'medium',
  entryStrategy = "scaleFade",
  hoverStrategy = "hover",
  showImage = true,
  showTech = true,
  showYear = true,
  imageHeight,
  style = {},
  ...props 
}) => {
  const cardHeight = size === 'large' ? '380px' : size === 'medium' ? '300px' : '260px';
  const defaultImageHeight = size === 'large' ? "65%" : size === 'small' ? "55%" : "60%";
  const padding = size === 'small' ? "0.5rem" : "0.75rem";
  const descriptionLines = size === 'small' ? 2 : size === 'large' ? 4 : 3;

  return (
    <AnimatedContainer
      entryStrategy={entryStrategy}
      hoverStrategy={hoverStrategy}
      category={AnimationCategories.CARD}
      onClick={onClick}
      style={{
        height: "100%",
        minHeight: cardHeight,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        background: "var(--card-bg)",
        border: "2px solid var(--primary)",
        borderRadius: "var(--border-radius)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(252, 148, 96, 0.1)",
        padding: 0,
        ...style
      }}
      {...props}
    >
      {/* Project Image */}
      {showImage && project.image && (
        <ImageContainer
          src={project.image}
          alt={project.title}
          height={imageHeight || defaultImageHeight}
          borderRadius="16px"
          style={{
            margin: "4px"
          }}
        />
      )}

      {/* Content Section */}
      <div style={{
        flex: 1,
        padding,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        zIndex: 2,
        minHeight: 0
      }}>
        {/* Title with Icon */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "0.75rem"
        }}>
          <div style={{
            width: size === 'small' ? "6px" : "8px",
            height: size === 'small' ? "6px" : "8px",
            background: "var(--primary)",
            borderRadius: "50%",
            boxShadow: "0 0 10px var(--primary)"
          }} />
          <h3 style={{
            color: "var(--text)",
            margin: 0,
            fontSize: "1.3rem",
            fontWeight: "bold",
            textShadow: "0 1px 2px rgba(0,0,0,0.1)",
            lineHeight: "1.2"
          }}>
            {project.title}
          </h3>
        </div>

        {/* Description */}
        <p style={{
          color: "var(--text-secondary)",
          margin: "0.75rem 0 1.25rem 0",
          fontSize: "0.9rem",
          lineHeight: "1.6",
          textShadow: "0 1px 1px rgba(0,0,0,0.05)",
          flex: 1,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: descriptionLines,
          WebkitBoxOrient: "vertical"
        }}>
          {project.description}
        </p>

        {/* Tech Stack */}
        {showTech && project.tech && (
          <TechStack 
            tech={project.tech}
            maxDisplay={4}
            style={{ marginBottom: "1rem" }}
          />
        )}

        {/* Year Badge */}
        {showYear && project.year && (
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "auto",
            paddingTop: "0.75rem"
          }}>
            <YearBadge 
              year={project.year}
              size={size}
            />
          </div>
        )}
      </div>
    </AnimatedContainer>
  );
};

export default ProjectCardBase; 