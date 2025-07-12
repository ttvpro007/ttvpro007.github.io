// Video background animation strategies for VideoBackgroundEffect

export function getVideoBgStrategy(theme) {
  switch (theme) {
    case 'raindrops':
      return raindropsStrategy;
    // Add more cases for other themes
    case 'pulsingParticlesGlass':
      return pulsingParticlesGlassStrategy;
    default:
      return null;
  }
}

function raindropsStrategy(canvas) {
  const ctx = canvas.getContext("2d");
  let animationFrameId;
  const width = canvas.width;
  const height = canvas.height;
  const drops = Array.from({ length: 40 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 2 + 1,
    speed: Math.random() * 2 + 1,
  }));

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = 0.5;
    drops.forEach(drop => {
      ctx.beginPath();
      ctx.arc(drop.x, drop.y, drop.r, 0, 2 * Math.PI);
      ctx.fillStyle = "#aeeaff";
      ctx.fill();
      drop.y += drop.speed;
      if (drop.y > height) {
        drop.y = -5;
        drop.x = Math.random() * width;
      }
    });
    animationFrameId = requestAnimationFrame(draw);
  }

  draw();
  return () => cancelAnimationFrame(animationFrameId);
}

function pulsingParticlesGlassStrategy(canvas) {
  const ctx = canvas.getContext("2d");
  let animationFrameId;
  
  // Get the actual display size of the canvas
  const rect = canvas.getBoundingClientRect();
  const displayWidth = rect.width;
  const displayHeight = rect.height;
  
  // Use the smaller dimension to create a square canvas area
  const squareSize = Math.min(displayWidth, displayHeight);
  
  // Set canvas resolution to match display size
  canvas.width = displayWidth;
  canvas.height = displayHeight;
  
  // Calculate offset to center the square area
  const offsetX = (displayWidth - squareSize) / 2;
  const offsetY = (displayHeight - squareSize) / 2;
  
  const PARTICLE_COUNT = 30;
  const COLORS = [
    '#ff6f91', '#ff9671', '#ffc75f', '#f9f871', '#42caff', '#845ec2', '#0081cf', '#00c9a7', '#b39cd0', '#f6e6b4'
  ];
  const particles = Array.from({ length: PARTICLE_COUNT }, () => {
    const baseRadius = Math.random() * 12 + 8;
    // Set a pulsing range for each particle
    const pulseMin = baseRadius * 0.85;
    const pulseMax = baseRadius * 1.15;
    return {
      x: Math.random() * squareSize + offsetX,
      y: Math.random() * squareSize + offsetY,
      baseRadius,
      radius: baseRadius,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulseSpeed: Math.random() * 0.03 + 0.01,
      pulsePhase: Math.random() * Math.PI * 2,
      hoverSpeedX: (Math.random() - 0.5) * 0.2,
      hoverSpeedY: (Math.random() - 0.5) * 0.2,
      pulseMin,
      pulseMax
    };
  });

  function drawGlass() {
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.filter = 'blur(8px)';
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(0, 0, displayWidth, displayHeight);
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, displayWidth, displayHeight);
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, displayWidth, displayHeight);
    // Draw particles
    particles.forEach(p => {
      // Pulsing with min/max range
      const pulse = (Math.sin(performance.now() * p.pulseSpeed + p.pulsePhase) + 1) / 2; // 0 to 1
      p.radius = p.pulseMin + (p.pulseMax - p.pulseMin) * pulse;
      // Hovering
      p.x += p.hoverSpeedX;
      p.y += p.hoverSpeedY;
      // Bounce off edges within the square area
      if (p.x < offsetX + p.radius || p.x > offsetX + squareSize - p.radius) p.hoverSpeedX *= -1;
      if (p.y < offsetY + p.radius || p.y > offsetY + squareSize - p.radius) p.hoverSpeedY *= -1;
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.restore();
    });
    // Draw blurred glass overlay
    drawGlass();
    animationFrameId = requestAnimationFrame(draw);
  }

  draw();
  return () => cancelAnimationFrame(animationFrameId);
} 