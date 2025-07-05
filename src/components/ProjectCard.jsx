import React, { useState } from "react";
import { motion } from "framer-motion";
import { techIconMap, categoryColors } from "../utils/constants";
import projectsConfig from "../data/projectsConfig.json";
import projectsContent from "../data/projectsContent.json";

export default function ProjectCard({ project, onViewDetails }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        position: 'relative',
        background: 'var(--card-bg)',
        borderRadius: 'var(--border-radius)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow)',
        transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
        cursor: 'pointer',
        height: projectsConfig.layout.cardHeight,
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(project)}
    >
      {/* Image Container */}
      <div style={{
        position: 'relative',
        height: '180px',
        overflow: 'hidden',
      }}>
        <motion.img
          src={project.image}
          alt={project.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
        
        {/* Category Badge */}
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          left: '0.75rem',
          background: categoryColors[project.category] || 'var(--primary)',
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}>
          {project.category}
        </div>
        
        {/* Year Badge */}
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '0.25rem 0.5rem',
          borderRadius: '8px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
        }}>
          {project.year}
        </div>
      </div>
      
      {/* Content */}
      <div style={{
        padding: '1rem',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h3 style={{
          margin: '0 0 0.5rem 0',
          fontSize: '1.1rem',
          color: 'var(--primary)',
          fontWeight: 'bold',
        }}>
          {project.title}
        </h3>
        
        <p style={{
          margin: '0 0 1rem 0',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.4',
          flex: 1,
        }}>
          {project.description}
        </p>
        
        {/* Tech Icons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.75rem',
        }}>
          {project.tech?.map(iconKey =>
            techIconMap[iconKey] ? (
              <img
                key={iconKey}
                src={techIconMap[iconKey]}
                alt={iconKey}
                title={iconKey.charAt(0).toUpperCase() + iconKey.slice(1)}
                style={{
                  width: 20,
                  height: 20,
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                }}
              />
            ) : null
          )}
        </div>
        
        {/* View Details Button */}
        <motion.button
          style={{
            background: 'transparent',
            color: 'var(--primary)',
            border: '1px solid var(--primary)',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            alignSelf: 'flex-start',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {projectsContent.projectCard.viewDetails}
        </motion.button>
      </div>
    </motion.div>
  );
} 