import React from "react";
import { motion } from "framer-motion";
import projects from "../data/projects.json";
import projectsConfig from "../data/projectsConfig.json";
import projectsContent from "../data/projectsContent.json";
import { Badge, Button, Section } from "./base";

export default function SearchAndFilter({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  sortBy, 
  setSortBy 
}) {
  const categories = [...new Set(projects.map(p => p.category))];
  
  return (
    <Section style={{ marginBottom: '2rem' }}>
      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder={projectsConfig.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem 1rem 1rem 3rem',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--border)',
            background: 'var(--card-bg)',
            color: 'var(--text)',
            fontSize: '1rem',
            outline: 'none',
            transition: 'all 0.2s ease',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--primary)';
            e.target.style.boxShadow = '0 0 0 2px rgba(238,182,75,0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border)';
            e.target.style.boxShadow = 'none';
          }}
        />
        <span style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-secondary)',
          fontSize: '1.2rem',
        }}>
          {projectsContent.searchAndFilter.searchIcon}
        </span>
      </div>
      
      {/* Filters Row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center',
      }}>
        {/* Category Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', flex: 1 }}>
          <Badge
            onClick={() => setSelectedCategory(null)}
            style={{
              cursor: 'pointer',
              background: selectedCategory === null ? 'var(--primary)' : 'transparent',
              color: selectedCategory === null ? 'var(--bg)' : 'var(--text)',
              border: '1px solid var(--border)',
            }}
          >
            {projectsContent.searchAndFilter.categoryFilters.all}
          </Badge>
          {categories.map(category => (
            <Badge
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                cursor: 'pointer',
                background: selectedCategory === category ? '#4A90E2' : 'transparent',
                color: selectedCategory === category ? 'white' : 'var(--text)',
                border: '1px solid var(--border)',
              }}
            >
              {category}
            </Badge>
          ))}
        </div>
        
        {/* Sort Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          background: 'var(--card-bg)',
          borderRadius: '8px',
          border: '1px solid var(--border)',
        }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {projectsContent.searchAndFilter.sortToggle.label}
          </span>
          <Button
            onClick={() => setSortBy(sortBy === 'recent' ? 'tech' : 'recent')}
            size="small"
            style={{
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
            }}
          >
            {projectsContent.searchAndFilter.sortToggle[sortBy]}
          </Button>
        </div>
      </div>
    </Section>
  );
} 