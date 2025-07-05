import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { techIconMap, linkLabels } from "../utils/constants";
import projectsContent from "../data/projectsContent.json";

export default function ProjectModal({ project, isOpen, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!project) return null;
  
  const images = project.images || [project.image];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              background: 'var(--card-bg)',
              borderRadius: 'var(--border-radius)',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                zIndex: 10,
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {projectsContent.projectModal.closeButton}
            </button>
            
            {/* Image Carousel */}
            <div style={{
              position: 'relative',
              height: '300px',
              overflow: 'hidden',
            }}>
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
                    }}
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                    }}
                  >
                    {projectsContent.projectModal.navigation.previous}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) => (prev + 1) % images.length);
                    }}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                    }}
                  >
                    {projectsContent.projectModal.navigation.next}
                  </button>
                </>
              )}
              
              {/* Image Indicators */}
              {images.length > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '0.5rem',
                }}>
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        border: 'none',
                        background: index === currentImageIndex ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Content */}
            <div style={{ padding: '2rem' }}>
              <h2 style={{
                margin: '0 0 1rem 0',
                color: 'var(--primary)',
                fontSize: '1.8rem',
              }}>
                {project.title}
              </h2>
              
              <p style={{
                margin: '0 0 1.5rem 0',
                color: 'var(--text)',
                lineHeight: '1.6',
                fontSize: '1rem',
              }}>
                {project.longDescription || project.description}
              </p>
              
              {/* Tech Stack */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{
                  margin: '0 0 0.75rem 0',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {projectsContent.projectModal.content.techStack}
                </h4>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}>
                  {project.tech?.map(iconKey => (
                    <div
                      key={iconKey}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'var(--bg-alt)',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {techIconMap[iconKey] && (
                        <img
                          src={techIconMap[iconKey]}
                          alt={iconKey}
                          style={{ width: 16, height: 16 }}
                        />
                      )}
                      {iconKey.charAt(0).toUpperCase() + iconKey.slice(1)}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Links */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
              }}>
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'var(--primary)',
                      color: 'var(--bg)',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    {projectsContent.projectModal.content.links.liveDemo}
                  </a>
                )}
                
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'var(--accent)',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {linkLabels[project.linkSource] || linkLabels.default}
                </a>
                
                {project.appStore && (
                  <a
                    href={project.appStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#007AFF',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    {projectsContent.projectModal.content.links.appStore}
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 