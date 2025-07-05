import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Icon } from "./base";

const pages = ["Home", "About", "Projects", "Resume", "Contact"];

function getInitialTheme() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme') || 'dark';
  }
  return 'dark';
}

export default function Navbar({ setPage, currentPage }) {
  const [theme, setTheme] = React.useState(getInitialTheme);

  React.useEffect(() => {
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
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
        Vi Tiet
      </span>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: 'center' }}>
        {pages.map((page) => (
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
              ) : (
                // Sun icon
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95-1.41-1.41M6.34 6.34 4.93 4.93m12.02 0-1.41 1.41M6.34 17.66l-1.41 1.41"/></svg>
              )}
            </motion.div>
          </AnimatePresence>
        </Button>
      </div>
    </nav>
  );
} 