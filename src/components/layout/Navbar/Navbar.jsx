import React from "react";
import { Button } from "@/components/base";
import { navigation } from "@/data";
import "./Navbar.css";

/** `pages`: the enabled pages from layout.json ({ id, label }), in nav order. */
export default function Navbar({ pages, setPage, currentPage }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handlePageChange = (page) => {
    setPage(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <span className="navbar-brand">
          {navigation.brandName}
        </span>
        <div className="navbar-nav">
          {pages.map((page) => (
            <Button
              key={page.id}
              onClick={() => handlePageChange(page.id)}
              variant={currentPage === page.id ? "primary" : "outline"}
              size="small"
              className={`navbar-button ${currentPage === page.id ? 'navbar-button--active' : ''}`}
            >
              {page.label}
            </Button>
          ))}
        </div>
        
        {/* Mobile Menu Button */}
        <button
          type="button"
          className={`navbar-mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={handleMobileMenuToggle}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          <span className="navbar-mobile-menu-line"></span>
          <span className="navbar-mobile-menu-line"></span>
          <span className="navbar-mobile-menu-line"></span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`navbar-mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={handleMobileMenuToggle}
      >
        <div className="navbar-mobile-menu-content" onClick={(e) => e.stopPropagation()}>
          {pages.map((page) => (
            <Button
              key={page.id}
              onClick={() => handlePageChange(page.id)}
              variant={currentPage === page.id ? "primary" : "outline"}
              size="small"
              className={`navbar-button ${currentPage === page.id ? 'navbar-button--active' : ''}`}
            >
              {page.label}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
} 