import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Badge, Card, MarkdownRenderer } from "@/components/base";
import { uiContent } from "@/data";
import {
  generateProjectButtons,
  getGalleryMedia,
  getPlayableMedia,
  formatImageCounter,
  getProjectDescription
} from "@/utils/projectUtils";
import { MEDIA_TYPES } from "@/lib/content/mediaTypes";
import { MediaView, MediaThumb } from "../media/renderers";
import './ProjectModal.css';
import VideoBackgroundEffect from "@/components/base/VideoBackgroundEffect/VideoBackgroundEffect";

const ProjectModal = ({ project, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTouchActive, setIsTouchActive] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // New state for tab management

  // Reset image index and tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setActiveTab('overview'); // Always start with overview tab
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

  const actionButtons = generateProjectButtons(project);

  // Gallery media (images, videos, embeds) feed the carousel; playable builds get their own tabs
  const mediaItems = getGalleryMedia(project);
  const playables = getPlayableMedia(project);
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
  const hasOverview = project?.overview || (projectDescription && projectDescription.trim() !== '');
  const hasRoles = project?.roles && project.roles.length > 0;
  const hasTechStack = project?.tech && project.tech.length > 0;
  const hasMedia = mediaItems.length > 0;
  
  // Playable builds (Unity WebGL, …) each get a tab next to Overview
  const showTabs = playables.length > 0;

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
                      <motion.div
                        key={`media-${currentImageIndex}`}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                        className={`project-modal-video-container media-${currentMedia?.type}`}
                      >
                        <MediaView item={currentMedia} title={project.title} />
                      </motion.div>
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
                        <MediaThumb item={item} index={index} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tab System for Overview and Web Build */}
              {showTabs ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.8 }}
                  className="project-tabs-section"
                >
                  {/* Tab Navigation */}
                  <div className="tabs-navigation">
                    <button
                      className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('overview')}
                    >
                      <span className="tab-icon">📋</span>
                      Overview
                    </button>
                    {playables.map((item, i) => (
                      <button
                        key={i}
                        className={`tab-button ${activeTab === `play-${i}` ? 'active' : ''}`}
                        onClick={() => setActiveTab(`play-${i}`)}
                      >
                        <span className="tab-icon">{MEDIA_TYPES[item.type].icon}</span>
                        {item.title || MEDIA_TYPES[item.type].tabLabel}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="tab-content">
                    <AnimatePresence mode="wait">
                      {activeTab === 'overview' && (
                        <motion.div
                          key="overview"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="tab-panel"
                        >
                          <div className="project-overview-content">
                            <h3 className="overview-title">
                              <span className="overview-icon">📋</span>
                              Overview
                            </h3>
                            {project.overview ? (
                              <MarkdownRenderer
                                content={project.overview}
                                className="overview-markdown"
                              />
                            ) : (
                              <p className="overview-text">
                                {projectDescription}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {playables.map((item, i) => activeTab === `play-${i}` && (
                        <motion.div
                          key={`play-${i}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="tab-panel"
                        >
                          <MediaView item={item} title={project.title} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                /* Fallback to original overview section when no tabs */
                hasOverview && (
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
                      {project.overview ? (
                        <MarkdownRenderer
                          content={project.overview}
                          className="overview-markdown"
                        />
                      ) : (
                        <p className="overview-text">
                          {projectDescription}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )
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