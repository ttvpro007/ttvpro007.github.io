import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import skillData from "../data/skillData.json";

function BatteryGauge({ level, color }) {
  return (
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
}

function TypingCode({ level, color }) {
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
}

function SpinningHeadset({ level, color }) {
  return (
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
      <div style={{
        flex: 1,
        height: '8px',
        background: 'var(--bg)',
        borderRadius: '4px',
        border: '1px solid var(--border)',
        overflow: 'hidden'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            height: '100%',
            background: color,
            borderRadius: '4px'
          }}
        />
      </div>
    </div>
  );
}

function Waveform({ level, color }) {
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
}

function LaunchRocket({ level, color }) {
  return (
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
      <div style={{
        flex: 1,
        height: '8px',
        background: 'var(--bg)',
        borderRadius: '4px',
        border: '1px solid var(--border)',
        overflow: 'hidden'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${color}, #ff6b35)`,
            borderRadius: '4px'
          }}
        />
      </div>
    </div>
  );
}

function PulseThumbnails({ level, color }) {
  return (
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
      <div style={{
        flex: 1,
        height: '8px',
        background: 'var(--bg)',
        borderRadius: '4px',
        border: '1px solid var(--border)',
        overflow: 'hidden'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            height: '100%',
            background: color,
            borderRadius: '4px'
          }}
        />
      </div>
    </div>
  );
}

function SkillBar({ skill, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const renderAnimation = (skill) => {
    switch (skill.animation) {
      case "battery":
        return <BatteryGauge level={skill.level} color={skill.color} />;
      case "typing":
        return <TypingCode level={skill.level} color={skill.color} />;
      case "spinning":
        return <SpinningHeadset level={skill.level} color={skill.color} />;
      case "waveform":
        return <Waveform level={skill.level} color={skill.color} />;
      case "launch":
        return <LaunchRocket level={skill.level} color={skill.color} />;
      case "pulse":
        return <PulseThumbnails level={skill.level} color={skill.color} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{
        marginBottom: '1.5rem',
        padding: '1rem',
        background: 'var(--card-bg)',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>{skill.icon}</span>
        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{skill.name}</h4>
        <span style={{ 
          marginLeft: 'auto', 
          fontSize: '0.9rem', 
          fontWeight: 600,
          color: skill.color 
        }}>
          {skill.level}%
        </span>
      </div>
      
      {renderAnimation(skill)}
      
      <p style={{ 
        margin: '0.5rem 0 0 0', 
        fontSize: '0.9rem', 
        color: 'var(--text-secondary)',
        lineHeight: 1.4
      }}>
        {skill.description}
      </p>
    </motion.div>
  );
}

export default function AnimatedSkillBars() {
  return (
    <div style={{ width: '100%' }}>
      {Object.entries(skillData).map(([category, skills]) => (
        <div key={category} style={{ marginBottom: '3rem' }}>
          <h3 style={{ 
            color: 'var(--primary)', 
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {category}
          </h3>
          
          {skills.map((skill, index) => (
            <SkillBar key={skill.name} skill={skill} index={index} />
          ))}
        </div>
      ))}
    </div>
  );
} 