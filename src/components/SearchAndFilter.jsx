import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge, Button } from "./base";
import { projects } from "../data";
import { 
  AnimationCategories, 
  getAnimation, 
  getAvailableStrategies,
  AnimationPresets 
} from "../utils/animations";

const SearchAndFilter = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  sortBy, 
  setSortBy,
  projects: projectItems,
  animationStrategy = "scaleFade"
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentAnimationStrategy, setCurrentAnimationStrategy] = useState(animationStrategy);
  const componentRef = useRef(null);
  
  // Get unique categories from projects
  const categories = ["all", ...new Set(projectItems.map(project => project.category))];
  
  // Get available animation strategies for entry/exit
  const availableStrategies = getAvailableStrategies(AnimationCategories.ENTRY_EXIT);
  
  // Get current animations
  const entryAnimation = getAnimation(AnimationCategories.ENTRY_EXIT, currentAnimationStrategy);
  const expandAnimation = getAnimation(AnimationCategories.EXPAND_COLLAPSE, 'smooth');
  const hoverAnimation = getAnimation(AnimationCategories.HOVER, 'lift');

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // Handle search focus
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setIsExpanded(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  // Function to cycle through animation strategies
  const cycleAnimationStrategy = () => {
    const currentIndex = availableStrategies.indexOf(currentAnimationStrategy);
    const nextIndex = (currentIndex + 1) % availableStrategies.length;
    setCurrentAnimationStrategy(availableStrategies[nextIndex]);
  };

  return (
    <motion.div
      ref={componentRef}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "fixed",
        top: "200px",
        left: "2rem",
        zIndex: 1000,
        pointerEvents: "auto"
      }}
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // Collapsed State
          <motion.div
            key="collapsed"
            {...entryAnimation}
            style={{
              background: "linear-gradient(135deg, #1a1a1a 0%, rgba(252, 148, 96, 0.05) 100%)",
              border: "2px solid #333",
              borderRadius: "20px",
              padding: "0.5rem",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(252, 148, 96, 0.1)",
              backdropFilter: "blur(10px)",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
            onClick={() => setIsExpanded(true)}
            {...hoverAnimation}
          >
            <div style={{
              fontSize: "1.5rem",
              color: "#FC9460",
              filter: "drop-shadow(0 2px 4px rgba(252, 148, 96, 0.3))"
            }}>
              🔍
            </div>
          </motion.div>
        ) : (
          // Expanded State
          <motion.div
            key="expanded"
            {...entryAnimation}
            style={{
              background: "linear-gradient(135deg, #1a1a1a 0%, rgba(252, 148, 96, 0.05) 100%)",
              border: "2px solid #333",
              borderRadius: "20px",
              padding: "1.5rem",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(252, 148, 96, 0.1)",
              backdropFilter: "blur(10px)",
              width: "320px",
              display: "flex",
              flexDirection: "column",
              gap: "1rem"
            }}
          >
            {/* Header with Close Button */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem"
            }}>
              <span style={{
                color: "#ffffff",
                fontSize: "0.9rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Search & Filter
              </span>
              <motion.button
                onClick={() => setIsExpanded(false)}
                style={{
                  width: "28px",
                  height: "28px",
                  background: "rgba(252, 148, 96, 0.1)",
                  border: "1px solid rgba(252, 148, 96, 0.3)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#FC9460",
                  padding: 0,
                  margin: 0
                }}
                whileHover={{ scale: 1.1, background: "rgba(252, 148, 96, 0.2)" }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            </div>

            {/* Search Input */}
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                placeholder="Search projects..."
                style={{
                  width: "100%",
                  padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                  border: `2px solid ${isSearchFocused ? "#FC9460" : "#333"}`,
                  borderRadius: "12px",
                  background: "#1a1a1a",
                  color: "#ffffff",
                  fontSize: "0.9rem",
                  outline: "none",
                  transition: "all 0.2s ease",
                  boxShadow: isSearchFocused 
                    ? "0 0 0 3px rgba(252, 148, 96, 0.1)" 
                    : "0 2px 4px rgba(0, 0, 0, 0.1)"
                }}
              />
              <div style={{
                position: "absolute",
                left: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "1rem",
                color: "#FC9460"
              }}>
                🔍
              </div>
            </div>

            {/* Category Filter */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <span style={{
                color: "#cccccc",
                fontSize: "0.8rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Category
              </span>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem"
              }}>
                {categories.map((category) => (
                  <Badge
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    animated={true}
                    style={{
                      cursor: "pointer",
                      background: selectedCategory === category 
                        ? "#FC9460" 
                        : "rgba(252, 148, 96, 0.1)",
                      color: selectedCategory === category ? "white" : "#FC9460",
                      border: `1px solid ${selectedCategory === category ? "#FC9460" : "rgba(252, 148, 96, 0.3)"}`,
                      borderRadius: "8px",
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      transition: "all 0.2s ease",
                      textTransform: "capitalize",
                      boxShadow: selectedCategory === category 
                        ? "0 2px 8px rgba(252, 148, 96, 0.4)" 
                        : "0 1px 3px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    {category === "all" ? "All" : category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <span style={{
                color: "#cccccc",
                fontSize: "0.8rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Sort
              </span>
              <div style={{
                display: "flex",
                background: "#1a1a1a",
                borderRadius: "8px",
                padding: "0.25rem",
                border: "1px solid #333"
              }}>
                {["recent", "tech"].map((option) => (
                  <Button
                    key={option}
                    onClick={() => setSortBy(option)}
                    variant={sortBy === option ? "primary" : "outline"}
                    size="small"
                    style={{
                      flex: 1,
                      borderRadius: sortBy === option ? "6px" : "0",
                      margin: "0",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      border: sortBy === option ? "none" : "1px solid transparent"
                    }}
                  >
                    {projects.ui.searchAndFilter.sortToggle[option]}
                  </Button>
                ))}
              </div>
            </div>

            {/* Animation Test Button */}
            <motion.button
              onClick={cycleAnimationStrategy}
              style={{
                padding: "0.5rem",
                background: "rgba(252, 148, 96, 0.1)",
                border: "1px solid rgba(252, 148, 96, 0.3)",
                borderRadius: "8px",
                color: "#FC9460",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
              whileHover={{ scale: 1.05, background: "rgba(252, 148, 96, 0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              🎬 {currentAnimationStrategy}
            </motion.button>

            {/* Active Filters Summary */}
            {(searchTerm || selectedCategory !== "all") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                style={{
                  padding: "0.75rem",
                  background: "rgba(252, 148, 96, 0.05)",
                  borderRadius: "8px",
                  border: "1px solid rgba(252, 148, 96, 0.2)"
                }}
              >
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.3rem",
                  fontSize: "0.8rem"
                }}>
                  {searchTerm && (
                    <span style={{ color: "#ffffff", fontWeight: "500" }}>
                      🔍 "{searchTerm}"
                    </span>
                  )}
                  {selectedCategory !== "all" && (
                    <span style={{ color: "#ffffff", fontWeight: "500" }}>
                      📁 {selectedCategory}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchAndFilter; 