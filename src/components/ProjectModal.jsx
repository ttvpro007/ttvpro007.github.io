import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Badge, Card } from "./base";
import { projects, uiContent } from "../data";
import { 
  generateProjectButtons, 
  getProjectImages, 
  formatImageCounter, 
  getProjectDescription 
} from "../utils/projectUtils";
import "../styling/components/project-modal.css";

const ProjectModal = ({ project, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset image index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
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
  const currentImage = images[currentImageIndex];
  const actionButtons = generateProjectButtons(project);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

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
            {/* Left Sidebar - Project Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ 
                delay: 0.1,
                duration: 0.4,
                exit: { delay: 0, duration: 0.3 }
              }}
              className="project-modal-sidebar"
            >
              <Card className="project-info-card" padding="2rem" hover={false}>
                {/* Project Header */}
                <div className="project-header">
                  <motion.h1 
                    className="project-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {project.title}
                  </motion.h1>
                  <motion.p 
                    className="project-description"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {getProjectDescription(project)}
                  </motion.p>
                </div>

                {/* Tech Stack */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="tech-section"
                >
                  <h3 className="section-title">
                    {uiContent.ui.projectModal.content.techStack}
                  </h3>
                  <div className="tech-grid">
                    {project.tech.map((tech, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <Badge size="small" className="tech-badge">
                          {tech}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="actions-section"
                >
                  <h3 className="section-title">
                    {uiContent.ui.projectModal.content.getStarted}
                  </h3>
                  
                  {actionButtons.length > 0 ? (
                    <div className="action-buttons">
                      {actionButtons.map((button, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
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
                      transition={{ delay: 0.8 }}
                      className="no-links"
                    >
                      <div className="no-links-icon">
                        {uiContent.ui.projectModal.content.noLinks.icon}
                      </div>
                      <p>{uiContent.ui.projectModal.content.noLinks.text}</p>
                    </motion.div>
                  )}
                </motion.div>
              </Card>
            </motion.div>

            {/* Right Content - Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ 
                delay: 0.2,
                duration: 0.4,
                exit: { delay: 0, duration: 0.3 }
              }}
              className="project-modal-content"
            >
              <Card className="gallery-card" padding="0" hover={false}>
                <div className="gallery-container">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={currentImage}
                      alt={project.title}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className="gallery-image"
                    />
                  </AnimatePresence>
                  
                  {/* Navigation Arrows */}
                  {images.length > 1 && (
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

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ delay: 0.6 }}
                      className="image-counter"
                    >
                      {formatImageCounter(currentImageIndex + 1, images.length)}
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal; 