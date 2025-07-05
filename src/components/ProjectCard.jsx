import React, { useState } from "react";
import { motion } from "framer-motion";
import { techIconMap, categoryColors } from "../utils/constants";
import projectsConfig from "../data/projectsConfig.json";
import projectsContent from "../data/projectsContent.json";
import { Card, Badge, Button } from "./base";

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
        overflow: 'hidden',
        cursor: 'pointer',
        height: projectsConfig.layout.cardHeight,
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(project)}
    >
      <Card hover={false} style={{ height: '100%', padding: 0 }}>
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
          <Badge
            style={{
              position: 'absolute',
              top: '0.75rem',
              left: '0.75rem',
              background: categoryColors[project.category] || 'var(--primary)',
              color: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            {project.category}
          </Badge>
          
          {/* Year Badge */}
          <Badge
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              border: 'none'
            }}
          >
            {project.year}
          </Badge>
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
          <Button
            variant="secondary"
            size="small"
            style={{ alignSelf: 'flex-start' }}
          >
            {projectsContent.projectCard.viewDetails}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
} 