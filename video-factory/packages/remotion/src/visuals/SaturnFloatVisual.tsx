import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

const SaturnIntro: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const progress = spring({ frame, fps, config: { damping: 18 } });

  // Splash particles
  const particles = useRef<Array<{ x: number; y: number; vx: number; vy: number; r: number; color: string }>>([]);
  if (particles.current.length === 0 && t > 0.8) {
    const cx = 540;
    const cy = 1100;
    for (let i = 0; i < 40; i++) {
      const angle = -Math.PI / 4 - Math.random() * Math.PI / 2;
      const speed = 150 + Math.random() * 300;
      particles.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 3 + Math.random() * 8,
        color: 'rgba(125, 211, 252, 0.7)'
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

    // Ocean surface at cy + 100
    const oceanY = cy + 100;

    // Saturn dropping and floating
    // Drops from top, hits water at t=0.8s
    let saturnY = cy - 250 + t * 400;
    if (t >= 0.8) {
      const sT = t - 0.8;
      // Bobbing on water surface
      saturnY = oceanY - 120 + Math.sin(sT * 5) * 20 * Math.exp(-sT * 2);
    }

    // Draw Saturn Globe (glorious gas giant)
    ctx.save();
    ctx.translate(cx, saturnY);
    
    // Gas giant stripes
    const grd = ctx.createRadialGradient(-30, -30, 20, 0, 0, 160);
    grd.addColorStop(0, '#fef08a');
    grd.addColorStop(0.5, '#f59e0b');
    grd.addColorStop(1, '#b45309');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(0, 0, 150, 0, Math.PI * 2);
    ctx.fill();

    // Saturn Rings (slanted ellipse)
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
    ctx.lineWidth = 15;
    ctx.save();
    ctx.scale(2.5, 0.4);
    ctx.rotate(-15 * Math.PI / 180);
    ctx.beginPath();
    ctx.arc(0, 0, 110, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    ctx.restore();

    // Draw Ocean water
    ctx.fillStyle = 'rgba(14, 116, 144, 0.85)';
    ctx.fillRect(0, oceanY, width, height - oceanY);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, oceanY);
    for (let x = 0; x < width; x += 10) {
      const wy = oceanY + Math.sin(x * 0.02 + t * 6) * 8;
      ctx.lineTo(x, wy);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Render splash particles
    if (t > 0.8) {
      const sT = t - 0.8;
      particles.current.forEach(p => {
        const px = p.x + p.vx * sT;
        const py = p.y + p.vy * sT + 0.5 * 400 * sT * sT; // gravity
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#020617' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      {t < 1.5 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '0 50px', background: 'rgba(2,6,23,0.4)', backdropFilter: 'blur(4px)', opacity: 1 - t / 1.5 }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#38bdf8', letterSpacing: '8px', fontFamily: 'monospace' }}>{eyebrow}</span>
          <h1 style={{ fontSize: '48px', fontWeight: 800, marginTop: '20px', color: '#f8fafc', fontFamily: 'Georgia, serif', letterSpacing: (1 + progress * 6) + 'px', textAlign: 'center', lineHeight: 1.3 }}>{title}</h1>
        </div>
      )}
    </AbsoluteFill>
  );
};

const DensityDiagram: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ background: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 50px' }}>
      <div style={{ width: '100%', border: '2px solid #38bdf8', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.8)', padding: '28px', fontFamily: 'monospace' }}>
        <div style={{ color: '#38bdf8', fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '28px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>

      {/* Density comparison slider scale */}
      <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginTop: '40px' }}>
        <div style={{ width: '100%', height: '24px', background: '#334155', borderRadius: '12px', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
          {/* Water density indicator (1.0) */}
          <div style={{ position: 'absolute', left: '60%', top: '-30px', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: '#0ea5e9', fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace' }}>1.0 (Water)</span>
            <div style={{ width: '4px', height: '40px', background: '#0ea5e9', marginTop: '4px' }} />
          </div>

          {/* Saturn density pointer (0.68) */}
          <div style={{
            position: 'absolute',
            left: `${Math.max(15, 60 - t * 15)}%`,
            top: '-30px',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'left 0.1s ease-out'
          }}>
            <span style={{ color: '#f59e0b', fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace' }}>0.68 (Saturn)</span>
            <div style={{ width: '4px', height: '40px', background: '#f59e0b', marginTop: '4px' }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SaturnBobbing: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
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
    const oceanY = cy + 100;

    // Saturn bobbing
    const saturnY = oceanY - 100 + Math.sin(t * 4) * 15;

    // Draw Saturn
    ctx.save();
    ctx.translate(cx, saturnY);
    const grd = ctx.createRadialGradient(-20, -20, 10, 0, 0, 130);
    grd.addColorStop(0, '#fef08a');
    grd.addColorStop(0.5, '#f59e0b');
    grd.addColorStop(1, '#b45309');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(0, 0, 120, 0, Math.PI * 2);
    ctx.fill();

    // Rings
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
    ctx.lineWidth = 12;
    ctx.save();
    ctx.scale(2.4, 0.45);
    ctx.rotate(-15 * Math.PI / 180);
    ctx.beginPath();
    ctx.arc(0, 0, 95, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    ctx.restore();

    // Draw Ocean waves covering lower half
    ctx.fillStyle = 'rgba(14, 116, 144, 0.9)';
    ctx.fillRect(0, oceanY, width, height - oceanY);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, oceanY);
    for (let x = 0; x < width; x += 10) {
      const wy = oceanY + Math.sin(x * 0.025 + t * 5) * 10;
      ctx.lineTo(x, wy);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#020617' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#38bdf8', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

const SaturnConclusion: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 50px', justifyContent: 'center' }}>
    <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #fef08a 0%, #b45309 70%, #1e1b18 100%)', boxShadow: '0 0 30px rgba(251,191,36,0.15)' }} />
    
    <div style={{ width: '100%', marginTop: '30px', textAlign: 'center' }}>
      <span style={{ color: '#38bdf8', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
      <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
    </div>

    <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #f59e0b', padding: '20px', borderRadius: '0 8px 8px 0' }}>
        <div style={{ color: '#f59e0b', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>SATURN DENSITY</div>
        <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>0.68 g/cm³ (Floats)</div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #0ea5e9', padding: '20px', borderRadius: '0 8px 8px 0' }}>
        <div style={{ color: '#0ea5e9', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>WATER DENSITY</div>
        <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>1.00 g/cm³</div>
      </div>
    </div>
  </AbsoluteFill>
);

export const SaturnFloatVisual: React.FC<{ sceneId: string; title: string; eyebrow: string; theme: string }> = ({ sceneId, title, eyebrow }) => {
  switch (sceneId) {
    case 'intro': return <SaturnIntro title={title} eyebrow={eyebrow} />;
    case 'diagram': return <DensityDiagram title={title} eyebrow={eyebrow} />;
    case 'simulation': return <SaturnBobbing title={title} eyebrow={eyebrow} />;
    case 'summary': return <SaturnConclusion title={title} eyebrow={eyebrow} />;
    default: return <SaturnIntro title={title} eyebrow={eyebrow} />;
  }
};
