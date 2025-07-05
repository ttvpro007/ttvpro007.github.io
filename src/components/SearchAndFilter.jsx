import React from "react";
import { motion } from "framer-motion";
import { Badge, Button, Section } from "./base";
import { projects } from "../data";

const SearchAndFilter = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  sortBy, 
  setSortBy,
  projects: projectItems 
}) => {
  // Get unique categories from projects
  const categories = ["all", ...new Set(projectItems.map(project => project.category))];

  return (
    <Section style={{ marginBottom: "2rem" }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "center"
      }}>
        {/* Search Bar */}
        <div style={{
          position: "relative",
          width: "100%",
          maxWidth: "500px"
        }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={projects.config.searchPlaceholder}
            style={{
              width: "100%",
              padding: "0.75rem 1rem 0.75rem 3rem",
              border: "2px solid var(--text-secondary)",
              borderRadius: "25px",
              background: "var(--card-bg)",
              color: "var(--text)",
              fontSize: "1rem",
              outline: "none",
              transition: "border-color 0.3s ease"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--primary)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--text-secondary)";
            }}
          />
          <div style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "1.2rem"
          }}>
            {projects.ui.searchAndFilter.searchIcon}
          </div>
        </div>

        {/* Category Filters */}
        <div style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          justifyContent: "center"
        }}>
          {categories.map((category) => (
            <Badge
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                cursor: "pointer",
                background: selectedCategory === category ? "var(--primary)" : "transparent",
                color: selectedCategory === category ? "var(--card-bg)" : "var(--text)",
                border: `2px solid ${selectedCategory === category ? "var(--primary)" : "var(--text-secondary)"}`,
                transition: "all 0.3s ease"
              }}
            >
              {projects.ui.searchAndFilter.categoryFilters.all}
            </Badge>
          ))}
        </div>

        {/* Sort Toggle */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {projects.ui.searchAndFilter.sortToggle.label}
          </span>
          <div style={{
            display: "flex",
            border: "2px solid var(--text-secondary)",
            borderRadius: "20px",
            overflow: "hidden"
          }}>
            {["recent", "tech"].map((option) => (
              <Button
                key={option}
                onClick={() => setSortBy(option)}
                variant={sortBy === option ? "primary" : "outline"}
                size="small"
                style={{
                  borderRadius: "0",
                  border: "none",
                  padding: "0.5rem 1rem",
                  fontSize: "0.9rem",
                  background: sortBy === option ? "var(--primary)" : "transparent",
                  color: sortBy === option ? "var(--card-bg)" : "var(--text)",
                  transition: "all 0.3s ease"
                }}
              >
                {projects.ui.searchAndFilter.sortToggle[option]}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default SearchAndFilter; 