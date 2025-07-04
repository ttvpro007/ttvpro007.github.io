import React from "react";
import projects from "../data/projects.json";

export default function Projects() {
  return (
    <section>
      <h2>Projects</h2>
      <ul>
        {projects.map((project, idx) => (
          <li key={idx} style={{ marginBottom: "1.5rem" }}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p><strong>Tech:</strong> {project.tech.join(", ")}</p>
            <a href={project.link} target="_blank" rel="noopener noreferrer">View on GitHub</a>
          </li>
        ))}
      </ul>
    </section>
  );
} 