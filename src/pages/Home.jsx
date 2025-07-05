import React from "react";
import { motion } from "framer-motion";
import Confetti from 'react-dom-confetti';
import profile from '../data/profile.json';
import FlipCards from '../components/FlipCards';
import Timeline from '../components/Timeline';
import FunFacts from '../components/FunFacts';
import Skills from '../components/Skills';
import ShowAndTell from '../components/ShowAndTell';

export default function Home() {
  const [bounce, setBounce] = React.useState(false);
  const [confetti, setConfetti] = React.useState(false);

  // Add loading state check
  if (!profile || !profile.personal) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        fontSize: '1.2rem',
        color: 'var(--text-secondary)'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <section style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '2rem 1rem',
      gap: '2rem'
    }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{
          background: 'var(--card-bg)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--shadow)',
          padding: '2.5rem 2rem',
          maxWidth: 540,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <motion.img
            src={profile.personal?.profilePic}
            alt={profile.personal?.name + " profile"}
            style={{ 
              borderRadius: '50%', 
              marginBottom: '1.5rem', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
              objectFit: 'cover', 
              border: '4px solid var(--primary)', 
              boxShadow: '0 0 16px var(--primary)' 
            }}
            width={160}
            height={160}
            animate={bounce ? { y: [0, -30, 0], scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.6, type: 'tween', ease: 'easeInOut' }}
            onClick={() => {
              setBounce(true);
              setConfetti(true);
              setTimeout(() => setBounce(false), 600);
              setTimeout(() => setConfetti(false), 700);
            }}
          />
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
            <Confetti active={confetti} config={{
              angle: 90,
              spread: 60,
              startVelocity: 35,
              elementCount: 50,
              dragFriction: 0.1,
              duration: 3000,
              stagger: 0,
              width: "10px",
              height: "10px",
              perspective: "500px",
              colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
            }} />
          </div>
        </div>
        
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>{profile.personal?.name}</h1>
        <p style={{ fontSize: '1.2rem', fontStyle: 'italic', margin: '0.5rem 0 1.5rem 0', textAlign: 'center', maxWidth: 400 }}>
          {profile.personal?.tagline}
        </p>
        
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
          {profile.socialLinks?.map(link => (
            <a
              key={link.type}
              href={link.url}
              target={link.type !== 'email' ? '_blank' : undefined}
              rel={link.type !== 'email' ? 'noopener noreferrer' : undefined}
              style={{ textDecoration: 'none', color: link.color }}
            >
              {link.icon === 'email-svg' ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#eee"/><path d="M4 8V16C4 17.1046 4.89543 18 6 18H18C19.1046 18 20 17.1046 20 16V8C20 6.89543 19.1046 6 18 6H6C4.89543 6 4 6.89543 4 8Z" stroke="#d44638" strokeWidth="2"/><path d="M4 8L12 13L20 8" stroke="#d44638" strokeWidth="2"/></svg>
              ) : (
                <img src={link.icon} alt={link.type} width={32} height={32} />
              )}
            </a>
          ))}
        </div>
      </motion.div>

      {/* Flip Cards Section */}
      <FlipCards />

      {/* Timeline Section */}
      <Timeline />

      {/* Fun Facts Section */}
      <FunFacts />

      {/* Skills Section */}
      <Skills />

      {/* Show and Tell Section */}
      <ShowAndTell />
    </section>
  );
} 