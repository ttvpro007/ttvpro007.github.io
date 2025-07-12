import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge, Button } from "@/components/base";
import { projects, uiContent } from "@/data";
import { 
  AnimationCategories, 
  getAnimation, 
  getAvailableStrategies,
  AnimationPresets 
} from "@/utils/animations";
import './SearchAndFilter.css';

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
            className="search-filter-container"
          >
            <AnimatePresence mode="wait">
              {!isExpanded ? (
                // Collapsed State
                <motion.div
                  key="collapsed"
                  {...entryAnimation}
                  className="search-filter-collapsed"
                  onClick={() => setIsExpanded(true)}
                  {...hoverAnimation}
                >
                  <div className="search-filter-collapsed-icon">
                    🔍
                  </div>
                </motion.div>
              ) : (
                // Expanded State
                <motion.div
                  key="expanded"
                  {...entryAnimation}
                  className="search-filter-expanded"
                >
                  {/* Header with Close Button */}
                  <div className="search-filter-header">
                    <span className="search-filter-title">
                      Search & Filter
                    </span>
                    <motion.button
                      onClick={() => setIsExpanded(false)}
                      className="search-filter-close-button"
                      whileHover={{ scale: 1.1, background: "#fc946033" }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ✕
                    </motion.button>
                  </div>

                  {/* Search Input */}
                  <div className="search-filter-input-container">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                      placeholder="Search projects..."
                      className="search-filter-input"
                    />
                    <div className="search-filter-input-icon">
                      🔍
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="search-filter-section">
                    <span className="search-filter-section-title">
                      Category
                    </span>
                    <div className="search-filter-categories">
                      {categories.map((category) => (
                        <Badge
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          animated={true}
                          className={`search-filter-category-badge ${selectedCategory === category ? 'active' : ''}`}
                        >
                          {category === "all" ? "All" : category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div className="search-filter-section">
                    <span className="search-filter-section-title">
                      Sort
                    </span>
                    <div className="search-filter-sort-container">
                      {["recent", "tech"].map((option) => (
                        <Button
                          key={option}
                          onClick={() => setSortBy(option)}
                          variant={sortBy === option ? "primary" : "outline"}
                          size="small"
                          className={`search-filter-sort-button ${sortBy === option ? 'active' : ''}`}
                        >
                          {uiContent.ui.searchAndFilter.sortToggle[option]}
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
                        className="search-filter-summary"
                      >
                        <motion.div 
                          initial={{ y: -5, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -5, opacity: 0 }}
                          transition={{ 
                            duration: 0.05,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }}
                          className="search-filter-summary-content"
                        >
                          {searchTerm && (
                            <motion.span 
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.05, duration: 0.15 }}
                              className="search-filter-summary-item"
                            >
                              🔍 "{searchTerm}"
                            </motion.span>
                          )}
                          {selectedCategory !== "all" && (
                            <motion.span 
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1, duration: 0.15 }}
                              className="search-filter-summary-item"
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