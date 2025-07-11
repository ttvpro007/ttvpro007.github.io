import React, { useRef, useEffect } from "react";
import { getVideoBgStrategy } from "./videoBgStrategies";
import "./video-background-effect.css";

export default function VideoBackgroundEffect({ theme = "raindrops" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const strategy = getVideoBgStrategy(theme);
    let cleanup = null;
    if (strategy && canvasRef.current) {
      cleanup = strategy(canvasRef.current);
    }
    return () => {
      if (cleanup) cleanup();
    };
  }, [theme]);

  return (
    <div className="video-bg-effect-container">
      <canvas
        ref={canvasRef}
        width={400}
        height={225}
        className={`video-bg-canvas ${theme}`}
      />
      <div className="video-bg-glass" />
    </div>
  );
} 