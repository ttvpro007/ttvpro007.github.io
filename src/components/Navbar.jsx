import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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
          <button
            key={page}
            onClick={() => setPage(page)}
            style={{
              background: currentPage === page ? "var(--primary)" : "transparent",
              color: currentPage === page ? "#fff" : "var(--text)",
              border: "none",
              padding: "0.5rem 1.2rem",
              borderRadius: "6px",
              fontWeight: 500,
              fontSize: "1rem",
              transition: "background 0.2s, color 0.2s",
              outline: "none"
            }}
            onMouseOver={e => { if (currentPage !== page) e.target.style.background = '#e0e6ed'; }}
            onMouseOut={e => { if (currentPage !== page) e.target.style.background = 'transparent'; }}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
          style={{
            background: 'none',
            border: 'none',
            marginLeft: '1.5rem',
            fontSize: '1.5rem',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            outline: 'none',
            boxShadow: 'none',
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ rotate: 0, opacity: 0 }}
              animate={{ rotate: 360, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {theme === 'dark' ? (
                // Moon icon
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
              ) : (
                // Sun icon
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95-1.41-1.41M6.34 6.34 4.93 4.93m12.02 0-1.41 1.41M6.34 17.66l-1.41 1.41"/></svg>
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </nav>
  );
} 