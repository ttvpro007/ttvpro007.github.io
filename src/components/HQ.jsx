import React from "react";
import { Card, Icon } from "./base";

const HQ = ({ 
  title = "Headquarters",
  location = "Digital Realm",
  coordinates = "0x0, 0y0",
  timezone = "UTC+0",
  status = "Online",
  description = "My digital command center where I craft games and code adventures.",
  icon = "🏰",
  style = {},
  ...props 
}) => {

  const statusColors = {
    online: { color: '#4ade80', bg: 'rgba(74, 222, 128, 0.1)' },
    offline: { color: '#f87171', bg: 'rgba(248, 113, 113, 0.1)' },
    away: { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' },
    busy: { color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.1)' }
  };

  const statusStyle = statusColors[status.toLowerCase()] || statusColors.online;

  return (
    <Card 
      hover={false}
      style={{
        padding: '1.5rem',
        textAlign: 'center',
        background: 'var(--card-bg)',
        border: '2px solid var(--primary)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >


      {/* Header */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Icon 
          emoji={icon}
          size="large"
          style={{
            marginBottom: '1rem',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
          }}
        />
        
        <h3 style={{
          color: 'var(--text)',
          margin: '0 0 0.5rem 0',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
          lineHeight: '1.2'
        }}>
          {title}
        </h3>

        {/* Status Indicator */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.25rem 0.75rem',
          borderRadius: '12px',
          background: statusStyle.bg,
          border: `1px solid ${statusStyle.color}`,
          marginBottom: '1rem'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: statusStyle.color,
            boxShadow: `0 0 8px ${statusStyle.color}`
          }} />
          <span style={{
            color: statusStyle.color,
            fontSize: '0.8rem',
            fontWeight: '600',
            textTransform: 'uppercase'
          }}>
            {status}
          </span>
        </div>
      </div>

      {/* Location Info */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        marginBottom: '1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          background: 'rgba(252, 148, 96, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(252, 148, 96, 0.3)'
        }}>
          <span style={{ fontSize: '1.1rem' }}>📍</span>
          <span style={{
            color: 'var(--text)',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            {location}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          background: 'rgba(252, 148, 96, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(252, 148, 96, 0.3)'
        }}>
          <span style={{ fontSize: '1.1rem' }}>🎯</span>
          <span style={{
            color: 'var(--text-secondary)',
            fontSize: '0.8rem',
            fontFamily: 'monospace'
          }}>
            {coordinates}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          background: 'rgba(252, 148, 96, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(252, 148, 96, 0.3)'
        }}>
          <span style={{ fontSize: '1.1rem' }}>⏰</span>
          <span style={{
            color: 'var(--text-secondary)',
            fontSize: '0.8rem'
          }}>
            {timezone}
          </span>
        </div>
      </div>

      {/* Description */}
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        margin: '0.75rem 0 0 0',
        lineHeight: '1.6',
        textShadow: '0 1px 1px rgba(0,0,0,0.05)',
        position: 'relative',
        zIndex: 1
      }}>
        {description}
      </p>

      {/* Map Grid Pattern */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
        background: `
          linear-gradient(rgba(252, 148, 96, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(252, 148, 96, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        opacity: 0.3,
        pointerEvents: 'none'
      }} />
    </Card>
  );
};

export default HQ; 