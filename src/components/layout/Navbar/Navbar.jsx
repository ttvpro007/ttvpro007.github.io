import React from "react";
import { Button } from "@/components/base";
import { navigation } from "@/data";
import "./Navbar.css";

export default function Navbar({ setPage, currentPage }) {
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
          {navigation.pages.map((page) => (
            <Button
              key={page}
              onClick={() => handlePageChange(page)}
              variant={currentPage === page ? "primary" : "outline"}
              size="small"
              className={`navbar-button ${currentPage === page ? 'navbar-button--active' : ''}`}
            >
              {page}
            </Button>
          ))}
        </div>
        
        {/* Mobile Menu Button */}
        <div 
          className={`navbar-mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={handleMobileMenuToggle}
        >
          <div className="navbar-mobile-menu-line"></div>
          <div className="navbar-mobile-menu-line"></div>
          <div className="navbar-mobile-menu-line"></div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`navbar-mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={handleMobileMenuToggle}
      >
        <div className="navbar-mobile-menu-content" onClick={(e) => e.stopPropagation()}>
          {navigation.pages.map((page) => (
            <Button
              key={page}
              onClick={() => handlePageChange(page)}
              variant={currentPage === page ? "primary" : "outline"}
              size="small"
              className={`navbar-button ${currentPage === page ? 'navbar-button--active' : ''}`}
            >
              {page}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
} 