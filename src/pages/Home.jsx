import React from "react";
import { motion } from "framer-motion";
import homeSections from "../data/homeSections.json";

const HIGHLIGHT_WORDS = [
  "2D Visualization",
  "3D Visualization",
  "AR Simulation",
  "VR Simulation",
  "Unity Engine",
  "C# Development",
  "C++ OOP",
  "Swift (Vision Pro)",
  "Reusable Tooling",
  "Feature Implementation",
  "Audio Signal Processing",
  "Max 8",
  "Clipchamp",
  "CapCut",
  "Demo Video Editing"
];

function highlightWords(text) {
  let result = text;
  HIGHLIGHT_WORDS.forEach(word => {
    const regex = new RegExp(`(${word.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    result = result.replace(regex, '<span class="highlighted-keyword">$1</span>');
  });
  return result;
}

export default function Home() {
  const [bounce, setBounce] = React.useState(false);

  return (
    <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
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
        <motion.img
          src={"/portfolio-profile-pic.png"}
          alt="Vi Tiet profile"
          style={{ borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', objectFit: 'cover', border: '4px solid var(--primary)', boxShadow: '0 0 16px var(--primary)' }}
          width={160}
          height={160}
          animate={bounce ? { y: [0, -30, 0], scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.5 }}
          onClick={() => {
            setBounce(true);
            setTimeout(() => setBounce(false), 600);
          }}
        />
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Vi Tiet</h1>
        <p style={{ fontSize: '1.2rem', fontStyle: 'italic', margin: '0.5rem 0 1.5rem 0', textAlign: 'center', maxWidth: 400 }}>
          I dream in code and wake up ready to bring those dreams to life.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
          <a href="https://github.com/ttvpro007" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#333' }}>
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" width={32} height={32} />
          </a>
          <a href="https://www.linkedin.com/in/vitiet-programmer" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#0077b5' }}>
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn" width={32} height={32} />
          </a>
          <a href="mailto:vitiet.programmer@gmail.com" style={{ textDecoration: 'none', color: '#d44638' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="4" fill="#eee"/><path d="M4 8V16C4 17.1046 4.89543 18 6 18H18C19.1046 18 20 17.1046 20 16V8C20 6.89543 19.1046 6 18 6H6C4.89543 6 4 6.89543 4 8Z" stroke="#d44638" strokeWidth="2"/><path d="M4 8L12 13L20 8" stroke="#d44638" strokeWidth="2"/></svg>
          </a>
        </div>
        {homeSections.map((section, idx) => (
          <div key={section.title} style={{ width: '100%', marginBottom: idx === homeSections.length - 1 ? 0 : '2rem' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem', marginTop: idx === 0 ? 0 : '1.5rem' }}>{section.title}</h3>
            <ul style={{ marginLeft: 0, paddingLeft: '1.2rem', fontSize: '1rem', listStyle: 'none' }}>
              {section.items.map((item, i) => (
                <li key={i} style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: 8, fontSize: '1.1em' }}>⚡</span>
                  <span dangerouslySetInnerHTML={{ __html: highlightWords(item.replace(/^⚡\s*/, '')) }} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.div>
      <div style={{background:'#eee',padding:'1rem',marginTop:'2rem',textAlign:'center',borderRadius:'8px',maxWidth:400}}>
        <strong>Home Page Placeholder</strong>
      </div>
    </section>
  );
} 