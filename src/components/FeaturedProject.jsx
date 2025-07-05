import React from "react";
import { motion } from "framer-motion";
import { techIconMap } from "../utils/constants";
import projectsConfig from "../data/projectsConfig.json";
import projectsContent from "../data/projectsContent.json";
import { Badge, Button } from "./base";

export default function FeaturedProject({ project, onViewDetails }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      style={{
        position: 'relative',
        width: '100%',
        height: projectsConfig.layout.featuredHeight,
        borderRadius: 'var(--border-radius)',
        overflow: 'hidden',
        marginBottom: '3rem',
        boxShadow: 'var(--shadow)',
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${project.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(34,27,54,0.9) 0%, rgba(34,27,54,0.7) 50%, rgba(34,27,54,0.4) 100%)',
      }} />
      
      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '2rem',
        color: 'var(--text)',
      }}>
        {/* Featured Badge */}
        <Badge
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'var(--primary)',
            color: 'var(--bg)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          {projectsContent.featuredProject.badge}
        </Badge>
        
        <h2 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '1rem',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
          {project.title}
        </h2>
        
        <p style={{ 
          fontSize: '1.1rem', 
          marginBottom: '1.5rem',
          maxWidth: '600px',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}>
          {project.description}
        </p>
        
        {/* Tech Stack */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '0.5rem' }}>
          {project.tech?.map(iconKey =>
            techIconMap[iconKey] ? (
              <img
                key={iconKey}
                src={techIconMap[iconKey]}
                alt={iconKey}
                title={iconKey.charAt(0).toUpperCase() + iconKey.slice(1)}
                style={{ 
                  width: 28, 
                  height: 28, 
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  padding: '2px'
                }}
              />
            ) : null
          )}
        </div>
        
        <Button
          onClick={() => onViewDetails(project)}
          style={{
            alignSelf: 'flex-start',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
          }}
        >
          {projectsContent.featuredProject.button}
        </Button>
      </div>
    </motion.div>
  );
} 