import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export const SimulationScene: React.FC<{
  title: string;
  eyebrow: string;
  theme: string;
}> = ({ title, eyebrow, theme }) => {
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

    const cx = width / 2;
    const cy = height / 2;

    const collisionTime = 3.0; // Collision happens at 3.0 seconds

    if (t < collisionTime) {
      // 1. Pre-collision: stars speed towards the center
      const progress = t / collisionTime; // 0 to 1
      const offset = (1 - progress) * 500; // start 500px away

      // Star A
      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.arc(cx - offset, cy, 24, 0, Math.PI * 2);
      ctx.fill();

      // Star B
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(cx + offset, cy, 24, 0, Math.PI * 2);
      ctx.fill();

      // Gravitational attraction fields (circles deforming)
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx - offset, cy, 60 + Math.sin(t * 10) * 15, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx + offset, cy, 60 + Math.sin(t * 10) * 15, 0, Math.PI * 2);
      ctx.stroke();

    } else {
      // 2. Post-collision: explosion and rapid particle nucleosynthesis (gold & platinum)
      const tExplode = t - collisionTime;

      // Draw expanding cloud of heavy elements (gold, silver, platinum colors)
      const particleCount = 180;
      const colors = ['#fbbf24', '#f5f5f7', '#d97706', '#fef08a', '#e4e4e7'];

      for (let i = 0; i < particleCount; i++) {
        // Deterministic seeding based on index
        const angle = (i / particleCount) * Math.PI * 2 + Math.sin(i) * 0.3;
        const velocitySeed = 80 + ((i * 321.45) % 350); // speed from 80 to 430 px/sec
        
        // Decelerating drag effect over time
        const drag = (1 - Math.exp(-tExplode * 2)) / 2;
        const distance = velocitySeed * drag * 150;

        const px = cx + Math.cos(angle) * distance;
        const py = cy + Math.sin(angle) * distance;

        const size = 3 + (i % 6);
        ctx.fillStyle = colors[i % colors.length];

        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Collision Flash (fades out over 0.6 seconds)
      const flashDuration = 0.6;
      if (tExplode < flashDuration) {
        const flashOpacity = 1 - tExplode / flashDuration;
        ctx.fillStyle = `rgba(255, 255, 255, ${flashOpacity})`;
        ctx.fillRect(0, 0, width, height);
      }
    }

    // Border Frame & Indicator
    ctx.strokeStyle = 'rgba(255, 0, 127, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.fillStyle = 'rgba(255, 0, 127, 0.85)';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('HIGH-ENERGY EVENT DETECTED', 70, 80);
  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#020005', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
      
      {/* Title & Stats Overlay */}
      <div style={{ position: 'absolute', top: '70px', right: '100px', textAlign: 'right', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#ec4899', fontSize: '20px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#ffffff', fontSize: '32px', fontWeight: 'bold', marginTop: '6px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};
