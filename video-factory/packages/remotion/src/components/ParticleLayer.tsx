import React, { useRef, useEffect } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export const ParticleLayer: React.FC<{
  color?: string;
  count?: number;
  speed?: number;
}> = ({ color = 'rgba(139, 92, 246, 0.45)', count = 40, speed = 0.5 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;

    for (let i = 0; i < count; i++) {
      // Deterministic particle generation based on index seed
      const seedX = Math.sin(i * 123.456) * 0.5 + 0.5;
      const seedY = Math.cos(i * 789.101) * 0.5 + 0.5;
      
      const startX = seedX * width;
      const startY = seedY * height;

      // Drift particle offset over time
      const dx = Math.sin(t * speed + i) * 60;
      const dy = -t * 40 * speed; // rise upwards slowly

      const px = (startX + dx + width) % width;
      const py = (startY + dy + height) % height;
      const size = 3 + (i % 6);

      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [frame, width, height, color, count, speed, fps, t]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}
    />
  );
};
