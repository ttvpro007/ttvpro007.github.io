import React from "react";
import { Hero, FlipCards, Timeline, FunFacts, ShowAndTell } from '@/components/features/showcase';
import './Home.css';

export default function Home() {

  return (
    <main>
      <div className="body-panel">
        <section className="home-main-section">
          {/* Hero Section */}
          <Hero 
            profilePicSize="medium" 
            showSocialLinks={true} 
          />

          {/* Timeline Section */}
          <Timeline />

          {/* Flip Cards Section */}
          <FlipCards />

          {/* Fun Facts Section */}
          <FunFacts />

          {/* Show and Tell Section */}
          <ShowAndTell />

        </section>
      </div>
    </main>
  );
} 