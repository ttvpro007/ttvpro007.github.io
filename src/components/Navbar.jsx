import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Icon } from "./base";
import { navigation } from "../data";
import "../styling/components/navbar.css";

function getInitialTheme() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(navigation.themeConfig.storageKey) || navigation.themeConfig.defaultTheme;
  }
  return navigation.themeConfig.defaultTheme;
}

export default function Navbar({ setPage, currentPage }) {
  const [theme, setTheme] = React.useState(getInitialTheme);

  React.useEffect(() => {
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem(navigation.themeConfig.storageKey, theme);
  }, [theme]);

  return (
    <nav className="navbar">
      <span className="navbar-brand">
        {navigation.brandName}
      </span>
      <div className="navbar-nav">
        {navigation.pages.map((page) => (
          <Button
            key={page}
            onClick={() => setPage(page)}
            variant={currentPage === page ? "primary" : "outline"}
            size="small"
            className="navbar-button"
          >
            {page}
          </Button>
        ))}
        <Button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          variant="outline"
          size="small"
          className="navbar-theme-button"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ rotate: 0, opacity: 0 }}
              animate={{ rotate: 360, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="navbar-theme-icon"
            >
              {theme === 'dark' ? (
                // Moon icon
                <svg 
                  width={navigation.icons.moon.width} 
                  height={navigation.icons.moon.height} 
                  viewBox={navigation.icons.moon.viewBox} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d={navigation.icons.moon.path}/>
                </svg>
              ) : (
                // Sun icon
                <svg 
                  width={navigation.icons.sun.width} 
                  height={navigation.icons.sun.height} 
                  viewBox={navigation.icons.sun.viewBox} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle 
                    cx={navigation.icons.sun.circle.cx} 
                    cy={navigation.icons.sun.circle.cy} 
                    r={navigation.icons.sun.circle.r}
                  />
                  {navigation.icons.sun.paths.map((path, index) => (
                    <path key={index} d={path}/>
                  ))}
                </svg>
              )}
            </motion.div>
          </AnimatePresence>
        </Button>
      </div>
    </nav>
  );
} 