import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

// ── Scene 1: Glass Standing Wave Intro ──
const GlassIntro: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, config: { damping: 15 } });
  const opacity = Math.min(1, frame / 15);
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(135deg, #0a0e17 0%, #151a2e 50%, #1c233a 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {/* Wave lines in background */}
      {Array.from({ length: 10 }).map((_, i) => {
        const yOffset = Math.sin(t * 3 + i) * 15;
        return (
          <div key={i} style={{ position: 'absolute', width: '100%', height: '1px', background: 'rgba(6, 182, 212, 0.08)', top: (30 + i * 8) + '%', transform: `translateY(${yOffset}px)` }} />
        );
      })}
      <div style={{ zIndex: 10, textAlign: 'center', opacity, padding: '0 50px' }}>
        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4', letterSpacing: '8px' }}>{eyebrow}</span>
        <h1 style={{ fontSize: '50px', fontWeight: 800, marginTop: '20px', color: '#f8fafc', fontFamily: 'Georgia, serif', letterSpacing: (1 + progress * 6) + 'px', lineHeight: '1.3' }}>{title}</h1>
      </div>
      {/* Simple animated outline of vibrating glass at bottom */}
      <svg width="200" height="250" viewBox="0 0 100 130" style={{ position: 'absolute', bottom: '15%', opacity: 0.3 }}>
        <path d={`M 30,10 Q 50,${10 + Math.sin(t * 15) * 4} 70,10 L 65,70 Q 50,75 35,70 Z`} fill="none" stroke="#06b6d4" strokeWidth="2" />
        <line x1="50" y1="73" x2="50" y2="110" stroke="#06b6d4" strokeWidth="2" />
        <ellipse cx="50" cy="110" rx="20" ry="5" fill="none" stroke="#06b6d4" strokeWidth="2" />
      </svg>
    </AbsoluteFill>
  );
};

// ── Scene 2: Wave Match & Resonance ──
const ResonanceDiagram: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ background: '#0a0e17', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 50px', overflow: 'hidden' }}>
      <div style={{ width: '100%', border: '2px solid #06b6d4', borderRadius: '16px', background: 'rgba(21, 26, 46, 0.8)', padding: '28px', fontFamily: 'monospace' }}>
        <div style={{ color: '#06b6d4', fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '28px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          <div style={{ flex: 1 }}><div style={{ color: '#67e8f9', fontSize: '13px' }}>SOUND FREQUENCY</div><div style={{ color: '#fbbf24', fontSize: '18px', fontWeight: 'bold' }}>556 Hz</div></div>
          <div style={{ flex: 1 }}><div style={{ color: '#67e8f9', fontSize: '13px' }}>RESONANCE RATE</div><div style={{ color: '#ef4444', fontSize: '18px', fontWeight: 'bold' }}>MATCHED</div></div>
        </div>
      </div>
      <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '24px' }}>
        <svg width="100%" height="100%" viewBox="0 0 400 500" style={{ borderRadius: '16px', background: 'rgba(10, 14, 23, 0.6)' }}>
          {/* Incoming sound waves - moving towards the center */}
          {Array.from({ length: 5 }).map((_, i) => {
            const wavePos = ((t * 80 + i * 50) % 200);
            return (
              <circle key={i} cx="50" cy="250" r={wavePos} fill="none" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1.5" opacity={Math.max(0, 1 - wavePos / 200)} />
            );
          })}
          {/* Vibrating Glass */}
          <g transform="translate(150, 130)">
            {/* The rim warps with resonant frequency */}
            <path d={`M 50,40 Q 100,${40 + Math.sin(t * 25) * 15} 150,40 L 140,240 Q 100,255 60,240 Z`} fill="rgba(6, 182, 212, 0.05)" stroke="#06b6d4" strokeWidth="3" />
            <line x1="100" y1="248" x2="100" y2="340" stroke="#06b6d4" strokeWidth="3" />
            <ellipse cx="100" cy="340" rx="40" ry="10" fill="none" stroke="#06b6d4" strokeWidth="3" />
            {/* Resonance glow */}
            <path d={`M 50,40 Q 100,${40 + Math.sin(t * 25) * 15} 150,40`} fill="none" stroke="#ef4444" strokeWidth="4" opacity={0.6 + Math.sin(t * 12) * 0.4} />
          </g>
          <text x="250" y="460" fill="#ef4444" fontSize="13" fontFamily="monospace" textAnchor="middle" fontWeight="bold">AMPLIFYING RESONANCE</text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Molecular Bond Deformation (Canvas) ──
const LatticeDeformation: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
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
    const cy = height / 2 + 100;

    // Molecular grid with stretching bonds
    const rows = 5;
    const cols = 5;
    const spacing = 80;
    const startX = cx - (cols - 1) * spacing / 2;
    const startY = cy - (rows - 1) * spacing / 2;

    const stretch = Math.sin(t * 18) * (20 + t * 4); // Stretch amplifies over time

    // Draw bonds (springs)
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * spacing + (Math.sin(t * 15 + r) * stretch * 0.6);
        const y = startY + r * spacing + (Math.cos(t * 15 + c) * stretch * 0.6);

        if (c < cols - 1) {
          const nextX = startX + (c + 1) * spacing + (Math.sin(t * 15 + r) * stretch * 0.6);
          const nextY = startY + r * spacing + (Math.cos(t * 15 + (c + 1)) * stretch * 0.6);
          
          // Stress changes color to red
          const stressVal = Math.min(1, Math.abs(stretch) / 30);
          ctx.strokeStyle = `rgb(${Math.floor(6 + stressVal * 230)}, ${Math.floor(182 - stressVal * 120)}, ${Math.floor(212 - stressVal * 160)})`;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nextX, nextY);
          ctx.stroke();
        }

        if (r < rows - 1) {
          const nextX = startX + c * spacing + (Math.sin(t * 15 + (r + 1)) * stretch * 0.6);
          const nextY = startY + (r + 1) * spacing + (Math.cos(t * 15 + c) * stretch * 0.6);

          const stressVal = Math.min(1, Math.abs(stretch) / 30);
          ctx.strokeStyle = `rgb(${Math.floor(6 + stressVal * 230)}, ${Math.floor(182 - stressVal * 120)}, ${Math.floor(212 - stressVal * 160)})`;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nextX, nextY);
          ctx.stroke();
        }
      }
    }

    // Draw atoms
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * spacing + (Math.sin(t * 15 + r) * stretch * 0.6);
        const y = startY + r * spacing + (Math.cos(t * 15 + c) * stretch * 0.6);
        ctx.fillStyle = Math.abs(stretch) > 22 ? '#ef4444' : '#06b6d4';
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw stress indicator border
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, width - 80, height - 80);
  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#0a0e17' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#ef4444', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: Glass Shatter Explosion (Particles in Canvas) ──
const ShatterExplosion: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  // Particle state initialized on load based on index
  const particles = useRef<Array<{ x: number; y: number; vx: number; vy: number; r: number; color: string; rot: number; rotSpeed: number }>>([]);

  if (particles.current.length === 0) {
    const cx = 540;
    const cy = 960;
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 450;
      particles.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 100, // Blow upwards slightly
        r: 3 + Math.random() * 8,
        color: Math.random() > 0.4 ? 'rgba(6, 182, 212, 0.7)' : 'rgba(248, 250, 252, 0.8)',
        rot: Math.random() * Math.PI,
        rotSpeed: -5 + Math.random() * 10
      });
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    // Update & draw particles
    particles.current.forEach(p => {
      const px = p.x + p.vx * t;
      const py = p.y + p.vy * t + 0.5 * 300 * t * t; // gravity

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(p.rot + p.rotSpeed * t);
      ctx.fillStyle = p.color;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;

      // Draw random triangle/polygon shard
      ctx.beginPath();
      ctx.moveTo(-p.r, -p.r);
      ctx.lineTo(p.r, -p.r);
      ctx.lineTo(0, p.r * 1.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });

    // Central flash
    if (t < 0.3) {
      const flashOp = 1 - t / 0.3;
      ctx.fillStyle = `rgba(255, 255, 255, ${flashOp * 0.8})`;
      ctx.fillRect(0, 0, width, height);
    }
  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#0a0e17', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 50px' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }} />
      <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '28px', zIndex: 10 }}>
        <div>
          <div style={{ color: '#ef4444', fontSize: '22px', fontWeight: 'bold', letterSpacing: '4px', fontFamily: 'monospace' }}>{eyebrow}</div>
          <div style={{ color: '#f8fafc', fontSize: '40px', fontWeight: 800, marginTop: '10px', fontFamily: 'Georgia, serif' }}>{title}</div>
        </div>
        <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid rgba(6, 182, 212, 0.15)', paddingBottom: '20px' }}>
          <span style={{ color: '#06b6d4', fontSize: '28px', fontWeight: 'bold', fontFamily: 'monospace' }}>01</span>
          <div>
            <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold' }}>MOLECULAR SHATTER</h3>
            <p style={{ color: '#67e8f9', fontSize: '17px', marginTop: '6px', lineHeight: 1.4 }}>Resonant amplification exceeds the tensile strength, tearing the bonds apart instantly.</p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const GlassShatterVisual: React.FC<{ sceneId: string; title: string; eyebrow: string; theme: string }> = ({ sceneId, title, eyebrow }) => {
  switch (sceneId) {
    case 'intro': return <GlassIntro title={title} eyebrow={eyebrow} />;
    case 'diagram': return <ResonanceDiagram title={title} eyebrow={eyebrow} />;
    case 'simulation': return <LatticeDeformation title={title} eyebrow={eyebrow} />;
    case 'summary': return <ShatterExplosion title={title} eyebrow={eyebrow} />;
    default: return <GlassIntro title={title} eyebrow={eyebrow} />;
  }
};
