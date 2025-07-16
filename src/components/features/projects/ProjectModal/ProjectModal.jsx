import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Badge, Card, MarkdownRenderer } from "@/components/base";
import { projects, uiContent } from "@/data";
import { 
  generateProjectButtons, 
  getProjectImages, 
  formatImageCounter, 
  getProjectDescription 
} from "../../../../utils/projectUtils";
import './ProjectModal.css';
import VideoBackgroundEffect from "@/components/base/VideoBackgroundEffect/VideoBackgroundEffect";

// Utility function to extract YouTube video ID from various URL formats
const extractYouTubeVideoId = (url) => {
  if (!url) return null;
  
  // Handle youtu.be format
  if (url.includes('youtu.be/')) {
    const match = url.match(/youtu\.be\/([^?&]+)/);
    return match ? match[1] : null;
  }
  
  // Handle embed format (check this BEFORE general youtube.com format)
  if (url.includes('youtube.com/embed/')) {
    const match = url.match(/embed\/([^?&]+)/);
    return match ? match[1] : null;
  }
  
  // Handle youtube.com format (watch URLs)
  if (url.includes('youtube.com/')) {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
  }
  
  // If it's already just a video ID (11 characters, alphanumeric)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }
  
  return null;
};

// Utility function to generate YouTube thumbnail URL
const getYouTubeThumbnailUrl = (videoId, quality = 'mqdefault') => {
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

const ProjectModal = ({ project, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTouchActive, setIsTouchActive] = useState(false);

  // Reset image index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      // Scroll to first thumbnail when modal opens
      setTimeout(() => {
        scrollThumbnailIntoView(0);
      }, 100);
    }
  }, [isOpen]);



  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const images = getProjectImages(project);
  const actionButtons = generateProjectButtons(project);
  
  // Create a combined media array that includes both video and images
  const mediaItems = [];
  if (project?.video) {
    mediaItems.push({ type: 'video', src: project.video, title: project?.title || '' });
  }
  if (project) {
    images.forEach(image => {
      mediaItems.push({ type: 'image', src: image, title: project.title || '' });
    });
  }
  
  const currentMedia = mediaItems[currentImageIndex];

  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % mediaItems.length;
    setCurrentImageIndex(newIndex);
    scrollThumbnailIntoView(newIndex);
  };

  const prevImage = () => {
    const newIndex = (currentImageIndex - 1 + mediaItems.length) % mediaItems.length;
    setCurrentImageIndex(newIndex);
    scrollThumbnailIntoView(newIndex);
  };

  const selectThumbnail = (index) => {
    setCurrentImageIndex(index);
    scrollThumbnailIntoView(index);
  };

  const scrollThumbnailIntoView = (index) => {
    const thumbnailContainer = document.querySelector('.thumbnail-container');
    const thumbnailItems = document.querySelectorAll('.thumbnail-item');
    
    if (thumbnailContainer && thumbnailItems[index]) {
      const containerWidth = thumbnailContainer.offsetWidth;
      const itemWidth = thumbnailItems[index].offsetWidth;
      const itemLeft = thumbnailItems[index].offsetLeft;
      const containerScrollLeft = thumbnailContainer.scrollLeft;
      
      // Check if item is out of view (left or right)
      const isOutOfViewLeft = itemLeft < containerScrollLeft;
      const isOutOfViewRight = itemLeft + itemWidth > containerScrollLeft + containerWidth;
      
      if (isOutOfViewLeft || isOutOfViewRight) {
        // Calculate the scroll position to center the item
        const scrollTo = itemLeft - (containerWidth / 2) + (itemWidth / 2);
        
        thumbnailContainer.scrollTo({
          left: Math.max(0, scrollTo),
          behavior: 'smooth'
        });
      }
    }
  };



  // Generate metrics from project data
  const metrics = project?.metrics || [];

  // Generate supplementary links
  const supplementaryLinks = [
    { label: 'GitHub Repository', icon: '🔗', url: project?.github },
    { label: 'Documentation', icon: '📚', url: project?.docs },
    { label: 'Design Mockups', icon: '🎨', url: project?.design },
    { label: 'Video Trailer', icon: '🎬', url: project?.trailer }
  ].filter(link => link.url);

  // Check if sections have data
  const hasMetrics = metrics.length > 0;
  const hasSupplementaryLinks = supplementaryLinks.length > 0;
  const projectDescription = getProjectDescription(project);
  const hasOverview = project?.overview || project?.markdownPath || (projectDescription && projectDescription.trim() !== '');
  const hasRoles = project?.roles && project.roles.length > 0;
  const hasTechStack = project?.tech && project.tech.length > 0;
  const hasMedia = mediaItems.length > 0;

  return (
    <AnimatePresence mode="wait" onExitComplete={() => {}}>
      {isOpen && project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.5, 
            ease: "easeInOut",
            exit: { duration: 0.4, ease: "easeOut" }
          }}
          className="project-modal-overlay"
        >
          {/* Close Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              delay: 0.2,
              exit: { delay: 0, duration: 0.3 }
            }}
            className="project-modal-close-container"
          >
            <Button
              onClick={onClose}
              variant="outline"
              className="project-modal-close-button"
              whileTap={{ scale: 0.95 }}
            >
              {uiContent.ui.projectModal.closeButton}
            </Button>
          </motion.div>

          {/* Main Modal Layout */}
          <div className="project-modal-layout">
            {/* Left Column - Media Carousel */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ 
                delay: 0.2,
                duration: 0.4,
                exit: { delay: 0, duration: 0.3 }
              }}
              className="project-modal-media"
            >
              {/* Hero Viewer */}
              {hasMedia && (
                <div className="hero-viewer">
                  <div 
                    className={`hero-container ${isTouchActive ? 'touch-active' : ''}`}
                    onTouchStart={() => {
                      // Show controls on touch for all devices (mobile, tablet, desktop)
                      setIsTouchActive(true);
                    }}
                    onTouchEnd={() => {
                      // Auto-hide controls after 2 seconds to allow for button interactions
                      setTimeout(() => setIsTouchActive(false), 2000);
                    }}
                    onMouseEnter={() => {
                      // Hide touch state on mouse enter for all devices
                      setIsTouchActive(false);
                    }}
                    onMouseLeave={() => {
                      // Hide touch state on mouse leave for all devices
                      setIsTouchActive(false);
                    }}
                  >
                    {/* VideoBackgroundEffect temporarily hidden
                    {currentMedia?.type === 'video' && (
                      <VideoBackgroundEffect theme={project.videoBackgroundTheme || 'raindrops'} />
                    )}
                    */}
                    <AnimatePresence mode="wait">
                      {currentMedia?.type === 'video' ? (
                        <motion.div
                          key={`video-${currentImageIndex}`}
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.4 }}
                          className="project-modal-video-container"
                        >
                          <iframe
                            width="100%"
                            height="100%"
                            src={currentMedia.src}
                            title={currentMedia.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </motion.div>
                      ) : (
                        <motion.img
                          key={`image-${currentImageIndex}`}
                          src={currentMedia?.src}
                          alt={currentMedia?.title}
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.4 }}
                          className="hero-media"
                        />
                      )}
                    </AnimatePresence>
                    
                    {/* Overlay Controls Container */}
                    <div className="overlay-controls-container">
                      {/* Navigation Arrows */}
                      {mediaItems.length > 1 && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ delay: 0.5 }}
                            className="nav-arrow nav-left"
                          >
                            <Button
                              onClick={prevImage}
                              variant="outline"
                              className="nav-button"
                              whileHover={{ background: "rgba(0, 0, 0, 0.9)" }}
                            >
                              {uiContent.ui.projectModal.navigation.previous}
                            </Button>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            transition={{ delay: 0.5 }}
                            className="nav-arrow nav-right"
                          >
                            <Button
                              onClick={nextImage}
                              variant="outline"
                              className="nav-button"
                              whileHover={{ background: "rgba(0, 0, 0, 0.9)" }}
                            >
                              {uiContent.ui.projectModal.navigation.next}
                            </Button>
                          </motion.div>
                        </>
                      )}

                      {/* Media Counter */}
                      {mediaItems.length > 1 && (
                        <motion.div
                          initial={{ y: 20 }}
                          animate={{ y: 0 }}
                          exit={{ y: 20 }}
                          transition={{ delay: 0.6 }}
                          className="media-counter"
                        >
                          {formatImageCounter(currentImageIndex + 1, mediaItems.length)}
                        </motion.div>
                      )}


                    </div>
                  </div>
                </div>
              )}

              {/* Thumbnail Strip */}
              {mediaItems.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.7 }}
                  className="thumbnail-strip"
                >
                  <div className="thumbnail-container">
                    {mediaItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className={`thumbnail-item ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => selectThumbnail(index)}
                      >
                        {item.type === 'video' ? (
                          <>
                            <img
                              src={getYouTubeThumbnailUrl(extractYouTubeVideoId(item.src)) || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMTYwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTYwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik02MCA0NUw4MCA2MEw2MCA3NVY0NVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo='}
                              alt={`Video thumbnail ${index + 1}`}
                              className="thumbnail-image"
                              onError={(e) => {
                                // Fallback to a default video thumbnail if YouTube thumbnail fails
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMTYwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTYwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik02MCA0NUw4MCA2MEw2MCA3NVY0NVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=';
                              }}
                            />
                            <div className="thumbnail-video-indicator">
                              <div className="play-button">▶</div>
                            </div>
                          </>
                        ) : (
                          <img
                            src={item.src}
                            alt={`Image ${index + 1}`}
                            className="thumbnail-image"
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Project Overview */}
              {hasOverview && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.8 }}
                  className="project-overview-section"
                >
                  <div className="project-overview-content">
                    <h3 className="overview-title">
                      <span className="overview-icon">📋</span>
                      Overview
                    </h3>
                    {project.markdownPath ? (
                      <MarkdownRenderer 
                        markdownPath={project.markdownPath}
                        className="overview-markdown"
                      />
                    ) : (
                      <p className="overview-text">
                        {project.overview || projectDescription}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Right Column - Project Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ 
                delay: 0.3,
                duration: 0.4,
                exit: { delay: 0, duration: 0.3 }
              }}
              className="project-modal-details"
            >
              <Card className="details-card" padding="0" hover={false}>
                {/* Project Header */}
                <div className="project-header">
                  <motion.h1 
                    className="project-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {project.title}
                  </motion.h1>
                </div>

                {/* Details Sections Container for Landscape Layout */}
                <div className="details-sections-container">
                  {/* Roles */}
                  {hasRoles && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="detail-section landscape-section"
                    >
                      <h3 className="section-title">
                        <span className="section-icon">👨‍💻</span>
                        Roles
                      </h3>
                      <ul className="roles-list">
                        {project.roles.map((role, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            className="role-item"
                          >
                            <span className="role-icon">🎯</span>
                            <p className="role-text">{role}</p>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Tech Stack */}
                  {hasTechStack && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="detail-section landscape-section"
                    >
                      <h3 className="section-title">
                        <span className="section-icon">⚙️</span>
                        {uiContent.ui.projectModal.content.techStack}
                      </h3>
                      <div className="tech-grid">
                        {project.tech.map((tech, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                          >
                            <Badge size="small" className="tech-badge">
                              {tech}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>


                {/* Metrics & Outcome */}
                {hasMetrics && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="detail-section"
                  >
                    <h3 className="section-title">
                      <span className="section-icon">📊</span>
                      Metrics & Outcome
                    </h3>
                    <div className="metrics-grid">
                      {metrics.map((metric, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          className="metric-item"
                        >
                          <div className="metric-value">{metric.value}</div>
                          <div className="metric-label">{metric.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Call to Action */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="detail-section"
                >
                  <h3 className="section-title">
                    <span className="section-icon">🚀</span>
                    {uiContent.ui.projectModal.content.getStarted}
                  </h3>
                  
                  {actionButtons.length > 0 ? (
                    <div className="action-buttons">
                      {actionButtons.map((button, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.0 + index * 0.1 }}
                        >
                          <Button
                            onClick={() => window.open(button.url, "_blank")}
                            variant={button.variant}
                            className="action-button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="button-icon">{button.icon}</span>
                            {button.label}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.0 }}
                      className="no-links"
                    >
                      <div className="no-links-icon">
                        {uiContent.ui.projectModal.content.noLinks.icon}
                      </div>
                      <p>{uiContent.ui.projectModal.content.noLinks.text}</p>
                    </motion.div>
                  )}
                </motion.div>

                {/* Supplementary Links */}
                {hasSupplementaryLinks && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="supplementary-links"
                  >
                    <h4>Additional Resources</h4>
                    <div className="supplementary-links-list">
                      {supplementaryLinks.map((link, index) => (
                        <motion.a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="supplementary-link"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.1 + index * 0.1 }}
                        >
                          <span className="supplementary-link-icon">{link.icon}</span>
                          {link.label}
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal; 