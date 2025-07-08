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
  animationStrategy = "slideFade",
  isPageVisible = true,
  isTransitioning = false
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentAnimationStrategy, setCurrentAnimationStrategy] = useState(animationStrategy);
  const [isVisible, setIsVisible] = useState(false);
  const componentRef = useRef(null);
  
  // Get unique categories from projects
  const categories = ["all", ...new Set(projectItems.map(project => project.category))];
  
  // Get available animation strategies for entry/exit
  const availableStrategies = getAvailableStrategies(AnimationCategories.ENTRY_EXIT);
  
  // Get current animations
  const entryAnimation = getAnimation(AnimationCategories.ENTRY_EXIT, currentAnimationStrategy);
  const expandAnimation = getAnimation(AnimationCategories.EXPAND_COLLAPSE, 'smooth');
  const hoverAnimation = getAnimation(AnimationCategories.HOVER, 'lift');

  // Handle click outside to close and update bounds
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

  // Show component after page animation completes
  useEffect(() => {
    if (isPageVisible && !isTransitioning) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500); // Match the page animation delay

      return () => clearTimeout(timer);
    } else if (isTransitioning) {
      // When transitioning, hide immediately to trigger exit animation
      setIsVisible(false);
    } else {
      // Add a small delay before hiding to allow exit animation
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isPageVisible, isTransitioning]);





  return (
    <>
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            ref={componentRef}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{
              duration: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            style={{
              position: "fixed",
              top: "200px",
              left: "2rem",
              zIndex: 1000,
              pointerEvents: "auto",
              transformOrigin: "left center"
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



                  {/* Active Filters Summary */}
                  <AnimatePresence>
                    {(searchTerm || selectedCategory !== "all") && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ 
                          duration: 0.25,
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        style={{
                          padding: "0.75rem",
                          background: "rgba(252, 148, 96, 0.05)",
                          borderRadius: "8px",
                          border: "1px solid rgba(252, 148, 96, 0.2)",
                          transformOrigin: "top"
                        }}
                      >
                        <motion.div 
                          initial={{ y: -5, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -5, opacity: 0 }}
                          transition={{ 
                            duration: 0.05,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.3rem",
                            fontSize: "0.8rem"
                          }}
                        >
                          {searchTerm && (
                            <motion.span 
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.05, duration: 0.15 }}
                              style={{ color: "#ffffff", fontWeight: "500" }}
                            >
                              🔍 "{searchTerm}"
                            </motion.span>
                          )}
                          {selectedCategory !== "all" && (
                            <motion.span 
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1, duration: 0.15 }}
                              style={{ color: "#ffffff", fontWeight: "500" }}
                            >
                              📁 {selectedCategory}
                            </motion.span>
                          )}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SearchAndFilter; 