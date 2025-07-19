import React from "react";
import { Icon } from "@/components/base";
import './HQ.css';

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
  const statusClass = `hq-status ${status.toLowerCase()}`;
  const statusDotClass = "hq-status-dot";
  const statusTextClass = "hq-status-text";

  return (
    <div className="hq-container" style={style}>
      {/* Header */}
      <div className="hq-header">
        <div className="hq-title-row">
          <Icon 
            emoji={icon}
            size="large"
            className="hq-icon"
          />
          <h3 className="hq-title">{title}</h3>
        </div>
        {/* Status Indicator */}
        <div className={statusClass}>
          <div className={statusDotClass} />
          <span className={statusTextClass}>{status}</span>
        </div>
      </div>
      {/* Location Info */}
      <div className="hq-location-info">
        <div className="hq-info-item">
          <span className="hq-info-icon">📍</span>
          <span className="hq-info-text">{location}</span>
        </div>
        <div className="hq-info-item">
          <span className="hq-info-icon">🎯</span>
          <span className="hq-info-text coordinates">{coordinates}</span>
        </div>
        <div className="hq-info-item">
          <span className="hq-info-icon">⏰</span>
          <span className="hq-info-text timezone">{timezone}</span>
        </div>
      </div>
      {/* Description */}
      <p className="hq-description">{description}</p>
      {/* Map Grid Pattern */}
      <div className="hq-map-grid" />
    </div>
  );
};

export default HQ; 