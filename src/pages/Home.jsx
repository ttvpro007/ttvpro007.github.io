import React from "react";
import { motion } from "framer-motion";
import homeSections from "../data/homeSections.json";
import Confetti from 'react-dom-confetti';
import profile from '../data/profile.json';

function highlightWords(text, highlights) {
  let result = text;
  highlights.forEach(word => {
    const regex = new RegExp(`(${word.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    result = result.replace(regex, '<span class="highlighted-keyword">$1</span>');
  });
  return result;
}

export default function Home() {
  const [bounce, setBounce] = React.useState(false);
  const [confetti, setConfetti] = React.useState(false);

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
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <motion.img
            src={profile.profilePic}
            alt={profile.name + " profile"}
            style={{ borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', objectFit: 'cover', border: '4px solid var(--primary)', boxShadow: '0 0 16px var(--primary)' }}
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
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>{profile.name}</h1>
        <p style={{ fontSize: '1.2rem', fontStyle: 'italic', margin: '0.5rem 0 1.5rem 0', textAlign: 'center', maxWidth: 400 }}>
          {profile.tagline}
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
          {profile.socialLinks.map(link => (
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
        {homeSections.map((section, idx) => (
          <div key={section.title} style={{ width: '100%', marginBottom: idx === homeSections.length - 1 ? 0 : '2rem' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem', marginTop: idx === 0 ? 0 : '1.5rem' }}>{section.title}</h3>
            <ul style={{ marginLeft: 0, paddingLeft: '1.2rem', fontSize: '1rem', listStyle: 'none' }}>
              {section.items.map((item, i) => (
                <li key={i} style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: 8, fontSize: '1.1em' }}>⚡</span>
                  <span dangerouslySetInnerHTML={{ __html: highlightWords(item.replace(/^⚡\s*/, ''), section.highlights || []) }} />
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