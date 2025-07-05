import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Badge, Icon } from "./base";
import { projects } from "../data";
import { 
  generateProjectButtons, 
  getProjectImages, 
  formatImageCounter, 
  getProjectDescription 
} from "../utils/projectUtils";

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
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(10px)",
            zIndex: 9999,
            overflow: "auto"
          }}
          onClick={onClose}
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
            style={{
              position: "fixed",
              top: "2rem",
              right: "2rem",
              zIndex: 10010
            }}
          >
            <Button
              onClick={onClose}
              variant="outline"
              style={{
                padding: "1rem",
                minWidth: "auto",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
                border: "2px solid var(--border)",
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "var(--text)"
              }}
              whileHover={{ 
                scale: 1.1,
                background: "rgba(255, 255, 255, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {projects.ui.projectModal.closeButton}
            </Button>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ 
              delay: 0.1,
              duration: 0.4,
              exit: { delay: 0, duration: 0.3 }
            }}
            style={{
              maxWidth: projects.ui.projectModal.layout.maxWidth,
              margin: "0 auto",
              padding: "2rem",
              paddingTop: "6rem"
            }}
          >
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ 
                delay: 0.3,
                exit: { delay: 0, duration: 0.3 }
              }}
              style={{
                textAlign: "center",
                marginBottom: "3rem"
              }}
            >
              <h1 style={{
                fontSize: "3.5rem",
                fontWeight: "bold",
                color: "var(--text)",
                marginBottom: "1rem",
                background: "linear-gradient(45deg, var(--primary), #FC9460)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                {project.title}
              </h1>
              <p style={{
                fontSize: "1.3rem",
                color: "var(--text-secondary)",
                maxWidth: "800px",
                margin: "0 auto",
                lineHeight: "1.6"
              }}>
                {getProjectDescription(project)}
              </p>
            </motion.div>

            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                delay: 0.4,
                exit: { delay: 0, duration: 0.3 }
              }}
              style={{
                position: "relative",
                height: projects.ui.projectModal.imageGallery.height,
                borderRadius: "20px",
                overflow: "hidden",
                marginBottom: "3rem",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)"
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={currentImage}
                  alt={project.title}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </AnimatePresence>
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ 
                      delay: 0.5,
                      exit: { delay: 0, duration: 0.3 }
                    }}
                  >
                    <Button
                      onClick={prevImage}
                      variant="outline"
                      style={{
                        position: "absolute",
                        left: "2rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        padding: "1rem",
                        minWidth: "auto",
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        border: "none",
                        backdropFilter: "blur(20px)",
                        fontSize: "1.5rem"
                      }}
                      whileHover={{ scale: 1.1, background: "rgba(0, 0, 0, 0.9)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {projects.ui.projectModal.navigation.previous}
                    </Button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ 
                      delay: 0.5,
                      exit: { delay: 0, duration: 0.3 }
                    }}
                  >
                    <Button
                      onClick={nextImage}
                      variant="outline"
                      style={{
                        position: "absolute",
                        right: "2rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        padding: "1rem",
                        minWidth: "auto",
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        border: "none",
                        backdropFilter: "blur(20px)",
                        fontSize: "1.5rem"
                      }}
                      whileHover={{ scale: 1.1, background: "rgba(0, 0, 0, 0.9)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {projects.ui.projectModal.navigation.next}
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
                  transition={{ 
                    delay: 0.6,
                    exit: { delay: 0, duration: 0.3 }
                  }}
                  style={{
                    position: "absolute",
                    bottom: "2rem",
                    right: "2rem",
                    background: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "25px",
                    fontSize: "1rem",
                    backdropFilter: "blur(20px)",
                    fontWeight: "600"
                  }}
                >
                  {formatImageCounter(currentImageIndex + 1, images.length)}
                </motion.div>
              )}
            </motion.div>

            {/* Project Details */}
            <div style={{
              display: "grid",
              gridTemplateColumns: projects.ui.projectModal.layout.gridColumns,
              gap: projects.ui.projectModal.layout.gap,
              alignItems: "start"
            }}>
              {/* Tech Stack */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ 
                  delay: 0.6,
                  exit: { delay: 0, duration: 0.3 }
                }}
              >
                <h2 style={{
                  color: "var(--text)",
                  marginBottom: "1.5rem",
                  fontSize: "2rem",
                  fontWeight: "bold"
                }}>
                  {projects.ui.projectModal.content.techStack}
                </h2>
                <div style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap"
                }}>
                  {project.tech.map((tech, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ 
                        delay: 0.7 + index * 0.1,
                        exit: { delay: 0, duration: 0.2 }
                      }}
                    >
                      <Badge size="small" style={{
                        fontSize: "1rem",
                        padding: "0.75rem 1.5rem",
                        background: "var(--primary)",
                        color: "var(--card-bg)"
                      }}>
                        {tech}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ 
                  delay: 0.7,
                  exit: { delay: 0, duration: 0.3 }
                }}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "20px",
                  padding: "2rem",
                  border: "1px solid var(--border)",
                  backdropFilter: "blur(10px)"
                }}
              >
                <h3 style={{
                  color: "var(--text)",
                  marginBottom: "1.5rem",
                  fontSize: "1.5rem",
                  fontWeight: "bold"
                }}>
                  {projects.ui.projectModal.content.getStarted}
                </h3>
                
                {actionButtons.length > 0 ? (
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem"
                  }}>
                    {actionButtons.map((button, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ 
                          delay: 0.8 + index * 0.1,
                          exit: { delay: 0, duration: 0.2 }
                        }}
                      >
                        <Button
                          onClick={() => window.open(button.url, "_blank")}
                          variant={button.variant}
                          style={{
                            width: "100%",
                            padding: "1rem 1.5rem",
                            fontSize: "1.1rem",
                            fontWeight: "600",
                            borderRadius: "12px"
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span style={{ marginRight: "0.5rem" }}>{button.icon}</span>
                          {button.label}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      delay: 0.8,
                      exit: { delay: 0, duration: 0.3 }
                    }}
                    style={{
                      textAlign: "center",
                      color: "var(--text-secondary)",
                      padding: "2rem"
                    }}
                  >
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                      {projects.ui.projectModal.content.noLinks.icon}
                    </div>
                    <p>{projects.ui.projectModal.content.noLinks.text}</p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal; 