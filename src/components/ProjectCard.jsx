import React from "react";
import { motion } from "framer-motion";
import { Card, Badge } from "./base";
import { projects } from "../data";

const ProjectCard = ({ project, onClick, size = 'medium' }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <Card
        hover={true}
        style={{
          height: "100%",
          minHeight: size === 'large' ? '380px' : size === 'medium' ? '300px' : '260px',
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          background: "linear-gradient(135deg, var(--card-bg) 0%, rgba(252, 148, 96, 0.05) 100%)",
          border: "2px solid var(--border)",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(252, 148, 96, 0.1)"
        }}
      >


        {/* Project Image Container */}
        <div style={{
          height: size === 'large' ? "65%" : size === 'small' ? "55%" : "60%",
          position: "relative",
          overflow: "hidden",
          borderRadius: "16px",
          margin: "16px"
        }}>
          <img
            src={project.image}
            alt={project.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "16px"
            }}
          />
          
          {/* Image Overlay Gradient */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: "linear-gradient(transparent, rgba(0, 0, 0, 0.7))",
            pointerEvents: "none",
            borderRadius: "0 0 16px 16px"
          }} />
        </div>

        {/* Content Section */}
        <div style={{
          flex: 1,
          padding: size === 'small' ? "1rem" : "1.5rem",
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
            marginBottom: size === 'small' ? "0.5rem" : "0.75rem"
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
              fontSize: size === 'large' ? "1.4rem" : size === 'small' ? "1.1rem" : "1.3rem",
              fontWeight: "bold",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
              lineHeight: "1.2"
            }}>
              {project.title}
            </h3>
          </div>

          {/* Description */}
          <p style={{
            color: "var(--text-secondary)",
            margin: "0 0 1rem 0",
            lineHeight: "1.6",
            fontSize: size === 'small' ? "0.8rem" : "0.9rem",
            flex: 1,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: size === 'small' ? 2 : size === 'large' ? 4 : 3,
            WebkitBoxOrient: "vertical",
            textShadow: "0 1px 1px rgba(0, 0, 0, 0.05)"
          }}>
            {project.description}
          </p>

          {/* Tech Stack with Enhanced Styling */}
          <div style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: size === 'small' ? "0.75rem" : "1rem",
            flexWrap: "wrap"
          }}>
            {project.tech.slice(0, size === 'small' ? 2 : size === 'large' ? 4 : 3).map((tech, index) => (
              <Badge 
                key={index} 
                size="small"
                style={{
                  background: "rgba(252, 148, 96, 0.1)",
                  border: "1px solid rgba(252, 148, 96, 0.3)",
                  color: "var(--primary)",
                  fontWeight: "600",
                  fontSize: size === 'small' ? "0.7rem" : "0.8rem"
                }}
              >
                {tech}
              </Badge>
            ))}
            {project.tech.length > (size === 'small' ? 2 : size === 'large' ? 4 : 3) && (
              <Badge 
                size="small"
                style={{
                  background: "rgba(252, 148, 96, 0.1)",
                  border: "1px solid rgba(252, 148, 96, 0.3)",
                  color: "var(--primary)",
                  fontWeight: "600",
                  fontSize: size === 'small' ? "0.7rem" : "0.8rem"
                }}
              >
                +{project.tech.length - (size === 'small' ? 2 : size === 'large' ? 4 : 3)}
              </Badge>
            )}
          </div>

          {/* Year Badge */}
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "auto",
            paddingTop: "0.75rem"
          }}>
            <div style={{
              background: "var(--primary)",
              color: "white",
              padding: size === 'small' ? "0.2rem 0.4rem" : "0.25rem 0.5rem",
              borderRadius: "16px",
              fontSize: size === 'small' ? "0.65rem" : "0.75rem",
              fontWeight: "bold",
              border: "2px solid var(--primary)",
              boxShadow: "0 2px 8px rgba(252, 148, 96, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2)"
            }}>
              {project.year}
            </div>
          </div>
        </div>


      </Card>
    </motion.div>
  );
};

export default ProjectCard; 