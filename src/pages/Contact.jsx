import React from "react";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <main>
      <div className="body-panel">
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              background: 'var(--card-bg)',
              borderRadius: 'var(--border-radius)',
              boxShadow: 'var(--shadow)',
              border: '2px solid var(--primary)',
              padding: '2.5rem 2rem',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <h2>Contact</h2>
            <p>Feel free to reach out! Add your email or social links here.</p>
            <a href="mailto:vitiet.programmer@gmail.com" style={{
              display: 'inline-block',
              marginTop: '1rem',
              padding: '0.5rem 1.2rem',
              background: 'var(--primary)',
              color: '#fff',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 500,
              boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
              transition: 'background 0.2s',
            }}
            className="body-text"
            >vitiet.programmer@gmail.com</a>
          </motion.div>
          <div style={{background:'#eee',padding:'1rem',marginTop:'2rem',textAlign:'center',borderRadius:'8px',maxWidth:400}}>
            <strong>Contact Page Placeholder</strong>
          </div>
        </section>
      </div>
    </main>
  );
} 