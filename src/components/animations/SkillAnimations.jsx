import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProgressBar from "../base/ProgressBar";

// Battery Gauge Animation
export const BatteryGauge = ({ level, color }) => (
  <div style={{ position: 'relative', width: '100%', height: '40px' }}>
    <div style={{
      width: '100%',
      height: '100%',
      background: 'var(--bg)',
      borderRadius: '20px',
      border: '2px solid var(--border)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${level}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{
          height: '100%',
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
          borderRadius: '18px',
          position: 'relative'
        }}
      />
      <div style={{
        position: 'absolute',
        right: '8px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '4px',
        height: '20px',
        background: 'var(--border)',
        borderRadius: '2px'
      }} />
    </div>
  </div>
);

// Typing Code Animation
export const TypingCode = ({ level, color }) => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "code block".repeat(Math.floor(level / 10));
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    
    return () => clearInterval(timer);
  }, [fullText]);

  return (
    <div style={{
      background: 'var(--bg)',
      border: '2px solid var(--border)',
      borderRadius: '8px',
      padding: '12px',
      fontFamily: 'monospace',
      fontSize: '14px',
      color: color,
      minHeight: '40px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <span>{displayText}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        style={{ marginLeft: '4px' }}
      >
        |
      </motion.span>
    </div>
  );
};

// Spinning Headset Animation
export const SpinningHeadset = ({ level, color }) => (
  <div style={{ position: 'relative', width: '100%', height: '40px', display: 'flex', alignItems: 'center' }}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      style={{
        fontSize: '24px',
        marginRight: '12px',
        filter: `drop-shadow(0 0 8px ${color})`
      }}
    >
      🥽
    </motion.div>
    <ProgressBar 
      progress={level} 
      max={100} 
      height="8px" 
      color={color} 
      bgColor="var(--bg)"
      animated={true}
    />
  </div>
);

// Waveform Animation
export const Waveform = ({ level, color }) => {
  const bars = 20;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      height: '40px',
      width: '100%'
    }}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ height: 4 }}
          animate={{ 
            height: Math.random() * 30 + 4,
            background: color
          }}
          transition={{ 
            duration: 0.5 + Math.random() * 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.1
          }}
          style={{
            width: '3px',
            background: color,
            borderRadius: '2px',
            opacity: i < (level / 5) ? 1 : 0.3
          }}
        />
      ))}
    </div>
  );
};

// Launch Rocket Animation
export const LaunchRocket = ({ level, color }) => (
  <div style={{ position: 'relative', width: '100%', height: '40px', display: 'flex', alignItems: 'center' }}>
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-5, -15, -5] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{
        fontSize: '20px',
        marginRight: '12px',
        filter: `drop-shadow(0 0 6px ${color})`
      }}
    >
      🚀
    </motion.div>
    <ProgressBar 
      progress={level} 
      max={100} 
      height="8px" 
      color={`linear-gradient(90deg, ${color}, #ff6b35)`}
      bgColor="var(--bg)"
      animated={true}
    />
  </div>
);

// Pulse Thumbnails Animation
export const PulseThumbnails = ({ level, color }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    height: '40px',
    width: '100%'
  }}>
    {Array.from({ length: 3 }).map((_, i) => (
      <motion.div
        key={i}
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          delay: i * 0.3
        }}
        style={{
          width: '32px',
          height: '24px',
          background: color,
          borderRadius: '4px',
          border: '1px solid var(--border)',
          opacity: i < (level / 30) ? 1 : 0.3
        }}
      />
    ))}
    <ProgressBar 
      progress={level} 
      max={100} 
      height="8px" 
      color={color} 
      bgColor="var(--bg)"
      animated={true}
    />
  </div>
);

// Animation mapping
export const animationComponents = {
  battery: BatteryGauge,
  typing: TypingCode,
  spinning: SpinningHeadset,
  waveform: Waveform,
  launch: LaunchRocket,
  pulse: PulseThumbnails
}; 