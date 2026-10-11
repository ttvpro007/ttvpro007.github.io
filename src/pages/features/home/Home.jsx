import React from "react";
import './Home.css';

/**
 * The home page's centred column. Its sections (Hero, Timeline, FlipCards, FunFacts,
 * ShowAndTell…) come from content/site/layout.json — see src/pages/sections.jsx.
 */
export function HomeFrame({ children }) {
  return (
    <section className="home-main-section">
      {children}
    </section>
  );
}
