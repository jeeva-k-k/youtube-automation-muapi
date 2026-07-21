import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

const NebulaIntro: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const progress = spring({ frame, fps, config: { damping: 18 } });

  // Hourglass expansion particles
  const particles = useRef<Array<{ x: number; y: number; vx: number; vy: number; r: number; color: string }>>([]);
  if (particles.current.length === 0) {
    const cx = width / 2;
    const cy = height / 2 + 100;
    for (let i = 0; i < 60; i++) {
      const angle = (i % 2 === 0 ? 0.3 : Math.PI + 0.3) + (Math.random() * 0.8 - 0.4);
      const speed = 100 + Math.random() * 250;
      particles.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 3 + Math.random() * 6,
        color: i % 2 === 0 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(125, 211, 252, 0.3)'
      });
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2 + 100;

    // Draw the Boomerang Nebula background hourglass wings (cyan/blue)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(15 * Math.PI / 180);

    // Left wing
    const leftGrd = ctx.createRadialGradient(-100, 0, 5, -150, 0, 200);
    leftGrd.addColorStop(0, '#0284c7');
    leftGrd.addColorStop(1, 'transparent');
    ctx.fillStyle = leftGrd;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-260, -120);
    ctx.lineTo(-260, 120);
    ctx.closePath();
    ctx.fill();

    // Right wing
    const rightGrd = ctx.createRadialGradient(100, 0, 5, 150, 0, 200);
    rightGrd.addColorStop(0, '#0284c7');
    rightGrd.addColorStop(1, 'transparent');
    ctx.fillStyle = rightGrd;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(260, -120);
    ctx.lineTo(260, 120);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Expansion particles flowing out
    particles.current.forEach(p => {
      const px = p.x + p.vx * t;
      const py = p.y + p.vy * t;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#020208' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      {t < 1.5 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '0 50px', background: 'rgba(2,2,8,0.4)', backdropFilter: 'blur(4px)', opacity: 1 - t / 1.5 }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#0ea5e9', letterSpacing: '8px', fontFamily: 'monospace' }}>{eyebrow}</span>
          <h1 style={{ fontSize: '48px', fontWeight: 800, marginTop: '20px', color: '#f8fafc', fontFamily: 'Georgia, serif', letterSpacing: (1 + progress * 6) + 'px', textAlign: 'center', lineHeight: 1.3 }}>{title}</h1>
        </div>
      )}
    </AbsoluteFill>
  );
};

const TemperatureDiagram: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ background: '#020208', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 50px' }}>
      <div style={{ width: '100%', border: '2px solid #0ea5e9', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.8)', padding: '28px', fontFamily: 'monospace' }}>
        <div style={{ color: '#0ea5e9', fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '28px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>

      <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '30px', marginTop: '20px' }}>
        <div>
          <div style={{ color: '#94a3b8', fontSize: '15px', fontFamily: 'monospace' }}>DEEP SPACE (BACKGROUND RADIATON)</div>
          <div style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', marginTop: '4px' }}>2.7 Kelvin</div>
        </div>
        <div style={{ borderLeft: '4px solid #ef4444', paddingLeft: '16px' }}>
          <div style={{ color: '#ef4444', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>BOOMERANG NEBULA</div>
          <div style={{ color: '#fff', fontSize: '38px', fontWeight: 'bold', marginTop: '4px' }}>{Math.max(1, 2.7 - t * 0.85).toFixed(1)} Kelvin</div>
        </div>
        <div>
          <div style={{ color: '#94a3b8', fontSize: '15px', fontFamily: 'monospace' }}>ABSOLUTE ZERO</div>
          <div style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', marginTop: '4px' }}>0 Kelvin</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ExpansionCooling: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
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

    // Center dying star (hot red/yellow)
    const starGrd = ctx.createRadialGradient(cx, cy, 2, cx, cy, 15);
    starGrd.addColorStop(0, '#fff');
    starGrd.addColorStop(0.5, '#ef4444');
    starGrd.addColorStop(1, 'transparent');
    ctx.fillStyle = starGrd;
    ctx.beginPath();
    ctx.arc(cx, cy, 15, 0, Math.PI * 2);
    ctx.fill();

    // Flowing gas shells cooling as they expand
    ctx.lineWidth = 4;
    for (let i = 0; i < 4; i++) {
      const radius = 40 + i * 65 + t * 45;
      if (radius < 320) {
        // Red near star, transitioning to deep cyan/blue at edge
        const opacity = Math.max(0, 1 - radius / 320);
        const redRatio = Math.max(0, 1 - radius / 120);
        ctx.strokeStyle = `rgba(${Math.floor(redRatio * 239)}, ${Math.floor((1 - redRatio) * 165 + 50)}, 233, ${opacity * 0.5})`;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.strokeStyle = 'rgba(14, 165, 233, 0.25)';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, width - 80, height - 80);
  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#020208' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#0ea5e9', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

const NebulaConclusion: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: '#020208', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 50px', justifyContent: 'center' }}>
    <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #0ea5e9 0%, #0369a1 70%, #020208 100%)', boxShadow: '0 0 30px rgba(14,165,233,0.2)' }} />
    
    <div style={{ width: '100%', marginTop: '30px', textAlign: 'center' }}>
      <span style={{ color: '#0ea5e9', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
      <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
    </div>

    <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #0ea5e9', padding: '20px', borderRadius: '0 8px 8px 0' }}>
        <div style={{ color: '#0ea5e9', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>TEMPERATURE</div>
        <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>1 Kelvin (-272.15°C)</div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #f43f5e', padding: '20px', borderRadius: '0 8px 8px 0' }}>
        <div style={{ color: '#f43f5e', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>PHYSICAL ENGINE</div>
        <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Thermodynamic Expansion Cooling</div>
      </div>
    </div>
  </AbsoluteFill>
);

export const NebulaColdVisual: React.FC<{ sceneId: string; title: string; eyebrow: string; theme: string }> = ({ sceneId, title, eyebrow }) => {
  switch (sceneId) {
    case 'intro': return <NebulaIntro title={title} eyebrow={eyebrow} />;
    case 'diagram': return <TemperatureDiagram title={title} eyebrow={eyebrow} />;
    case 'simulation': return <ExpansionCooling title={title} eyebrow={eyebrow} />;
    case 'summary': return <NebulaConclusion title={title} eyebrow={eyebrow} />;
    default: return <NebulaIntro title={title} eyebrow={eyebrow} />;
  }
};
