import React from "react";
import { 
  AnimatedContainer, 
  ImageContainer, 
  TechStack, 
  YearBadge,
  Badge,
  Button
} from "../index";
import { AnimationCategories } from "@/utils/animations";
import "./ProjectCardBase.css";

/**
 * ProjectCardBase - Base component for project cards with hover toggle functionality
 * 
 * @param {Object} props
 * @param {Object} props.project - Project data object
 * @param {Function} props.onClick - Click handler function
 * @param {string} props.size - Card size: 'small', 'medium', 'large'
 * @param {string} props.variant - Card variant: 'default', 'featured', 'compact'
 * @param {string} props.entryStrategy - Entry animation strategy
 * @param {string} props.hoverStrategy - Hover animation strategy
 * @param {boolean} props.enableHover - Whether to enable hover interactions (default: true)
 * @param {boolean} props.showImage - Whether to show project image
 * @param {boolean} props.showTech - Whether to show tech stack
 * @param {boolean} props.showYear - Whether to show year badge
 * @param {boolean} props.showBadge - Whether to show featured badge
 * @param {boolean} props.showActions - Whether to show action buttons
 * @param {string} props.imageHeight - Custom image height
 * @param {Object} props.style - Additional styles
 * @param {Object} props.uiContent - UI content configuration
 */

const ProjectCardBase = ({ 
  project,
  onClick,
  size = 'medium',
  variant = 'default', // 'default', 'featured', 'compact'
  entryStrategy = "scaleFade",
  hoverStrategy = "hover",
  showImage = true,
  showTech = true,
  showYear = true,
  showBadge = false,
  showActions = false,
  imageHeight,
  style = {},
  uiContent = {},
  enableHover = true, // New prop to control hover interactions
  ...props 
}) => {
  const cardHeight = size === 'large' ? '380px' : size === 'medium' ? '300px' : '260px';
  const defaultImageHeight = size === 'large' ? "large" : size === 'small' ? "small" : "medium";
  const descriptionLines = size === 'small' ? 2 : size === 'large' ? 4 : 3;

  // Featured project specific styles
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';

  const handleViewDetails = () => {
    if (onClick) onClick(project);
  };

  const handleDemoClick = () => {
    if (project.demo) {
      window.open(project.demo, "_blank");
    }
  };

  // Build CSS classes
  const containerClasses = [
    'project-card-base',
    `project-card-${variant}`,
    `project-card-${size}`,
    !enableHover ? 'no-hover' : ''
  ].join(' ');

  // Determine hover strategy based on enableHover prop
  const finalHoverStrategy = enableHover ? hoverStrategy : "none";

  return (
    <AnimatedContainer
      entryStrategy={entryStrategy}
      hoverStrategy={finalHoverStrategy}
      category={AnimationCategories.CARD}
      onClick={isFeatured ? undefined : onClick}
      className={containerClasses}
      style={{
        minHeight: cardHeight,
        ...style
      }}
      {...props}
    >
      {/* Background Image with Gradient Overlay for Featured */}
      {isFeatured && project.image && (
        <div 
          className="featured-project-bg project-card-bg-image"
          style={{
            backgroundImage: `url(${project.image})`
          }}
        />
      )}

      {/* Content Overlay */}
      <div className="project-card-content-overlay">
        {/* Featured Badge */}
        {showBadge && isFeatured && uiContent?.ui?.featuredProject?.badge && (
          <div className="project-card-badge-container">
            <Badge>
              {uiContent.ui.featuredProject.badge}
            </Badge>
          </div>
        )}

        {/* Project Image for non-featured cards */}
        {showImage && project.image && !isFeatured && (
          <ImageContainer
            src={project.image}
            alt={project.title}
            height={imageHeight || defaultImageHeight}
            borderRadius="rounded-lg"
            className="project-card-image"
          />
        )}

        {/* Content Section */}
        <div className="project-card-content">
          {/* Title with Icon */}
          <div className="project-card-title-section">
            {(!isFeatured && variant !== 'default') && (
              <div className="project-card-title-dot" />
            )}
            <h3 className="project-card-title">
              {project.title}
            </h3>
          </div>

          {/* Description */}
          <p 
            className="project-card-description"
            style={{
              WebkitLineClamp: isFeatured ? 3 : descriptionLines
            }}
          >
            {isFeatured ? (project.longDescription || project.description) : project.description}
          </p>

          {/* Tech Stack */}
          {showTech && project.tech && (
            <TechStack 
              tech={project.tech}
              maxDisplay={4}
              style={{ marginBottom: "1rem" }}
            />
          )}

          {/* Action Buttons for Featured */}
          {showActions && isFeatured && (
            <div className="project-card-actions">
              <Button
                onClick={handleViewDetails}
                variant="primary"
                className="featured-project-button"
              >
                {uiContent?.ui?.featuredProject?.button || "View Details"}
              </Button>

              {project.demo && (
                <Button
                  onClick={handleDemoClick}
                  variant="outline"
                  className="featured-project-demo"
                >
                  🚀 Live Demo
                </Button>
              )}
            </div>
          )}

          {/* Year Badge */}
          {showYear && project.year && !isFeatured && (
            <div className="project-card-year-badge">
              <YearBadge 
                year={project.year}
                size={size}
              />
            </div>
          )}
        </div>
      </div>
    </AnimatedContainer>
  );
};

export default ProjectCardBase; 