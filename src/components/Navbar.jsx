import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Icon } from "./base";
import { navigation } from "../data";

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
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        background: "var(--card-bg)",
        borderBottom: "1px solid #e0e6ed",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.75rem 2rem",
        fontSize: "1.1rem"
      }}
    >
      <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: "1.3rem", letterSpacing: "1px" }}>
        {navigation.brandName}
      </span>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: 'center' }}>
        {navigation.pages.map((page) => (
          <Button
            key={page}
            onClick={() => setPage(page)}
            variant={currentPage === page ? "primary" : "outline"}
            size="small"
            style={{
              fontWeight: 500,
              fontSize: "1rem",
            }}
          >
            {page}
          </Button>
        ))}
        <Button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          variant="outline"
          size="small"
          style={{
            marginLeft: '1.5rem',
            padding: '0.5rem',
            minWidth: 'auto',
            width: '40px',
            height: '40px'
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ rotate: 0, opacity: 0 }}
              animate={{ rotate: 360, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'flex', alignItems: 'center' }}
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