import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

const SunEarthIntro: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const progress = spring({ frame, fps, config: { damping: 18 } });

  // Instanced Earths pouring in
  const earths = useRef<Array<{ x: number; y: number; vx: number; vy: number; r: number }>>([]);
  if (earths.current.length === 0) {
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 200;
      earths.current.push({
        x: width / 2 + Math.cos(angle) * 350,
        y: height / 2 + 100 + Math.sin(angle) * 350,
        vx: -Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed,
        r: 6 + Math.random() * 8
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

    // Outer giant Sun boundary (70% frame size)
    ctx.strokeStyle = 'rgba(234, 88, 12, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 320, 0, Math.PI * 2);
    ctx.stroke();

    // Radial Sun background glow
    const sGrd = ctx.createRadialGradient(cx, cy, 50, cx, cy, 320);
    sGrd.addColorStop(0, 'rgba(254, 215, 170, 0.1)');
    sGrd.addColorStop(0.6, 'rgba(234, 88, 12, 0.05)');
    sGrd.addColorStop(1, 'transparent');
    ctx.fillStyle = sGrd;
    ctx.beginPath();
    ctx.arc(cx, cy, 320, 0, Math.PI * 2);
    ctx.fill();

    // Draw falling Earths merging/accumulating inside the Sun
    ctx.fillStyle = '#3b82f6';
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 1;

    earths.current.forEach((e, i) => {
      // Calculate current position
      const ex = e.x + e.vx * t;
      const ey = e.y + e.vy * t;
      const dist = Math.hypot(ex - cx, ey - cy);

      // Accumulate at center once they reach inner core
      if (dist < 100 + i * 2) {
        ctx.fillStyle = '#10b981'; // merges into hot core
        ctx.beginPath();
        ctx.arc(cx + Math.cos(i) * (30 + i * 0.8), cy + Math.sin(i) * (30 + i * 0.8), e.r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(ex, ey, e.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    });

  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#080200' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      {t < 1.5 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '0 50px', background: 'rgba(8,2,0,0.4)', backdropFilter: 'blur(4px)', opacity: 1 - t / 1.5 }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#ea580c', letterSpacing: '8px', fontFamily: 'monospace' }}>{eyebrow}</span>
          <h1 style={{ fontSize: '48px', fontWeight: 800, marginTop: '20px', color: '#f8fafc', fontFamily: 'Georgia, serif', letterSpacing: (1 + progress * 6) + 'px', textAlign: 'center', lineHeight: 1.3 }}>{title}</h1>
        </div>
      )}
    </AbsoluteFill>
  );
};

const VolumeRatioDiagram: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ background: '#080200', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 50px' }}>
      <div style={{ width: '100%', border: '2px solid #ea580c', borderRadius: '16px', background: 'rgba(45, 27, 18, 0.8)', padding: '28px', fontFamily: 'monospace' }}>
        <div style={{ color: '#ea580c', fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '28px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>

      {/* Dynamic counter comparing diameters vs volume */}
      <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '30px', marginTop: '20px' }}>
        <div>
          <div style={{ color: '#94a3b8', fontSize: '15px', fontFamily: 'monospace' }}>SUN TO EARTH DIAMETER RATIO</div>
          <div style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', marginTop: '4px' }}>109 Times Wider</div>
        </div>
        <div style={{ borderLeft: '4px solid #ea580c', paddingLeft: '16px' }}>
          <div style={{ color: '#ea580c', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>EARTHS BY VOLUME</div>
          <div style={{ color: '#fff', fontSize: '38px', fontWeight: 'bold', marginTop: '4px' }}>{Math.min(1.3, t * 0.45).toFixed(2)} Million</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SunEarthInstancing: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
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

    // Draw Giant Sun containing thousands of tiny instanced dots (representing packing earths)
    ctx.strokeStyle = 'rgba(234, 88, 12, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 300, 0, Math.PI * 2);
    ctx.stroke();

    // Packing density simulation: draw hundreds of small green/blue spheres filling bottom up
    ctx.fillStyle = '#3b82f6';
    const totalLines = 25;
    for (let l = 0; l < totalLines; l++) {
      const lineY = cy + 300 - l * 20;
      const widthAtY = Math.sqrt(Math.max(0, 300 * 300 - (lineY - cy) * (lineY - cy)));
      const dotCount = Math.floor(widthAtY / 12) * Math.min(1, t / 3);

      for (let d = 0; d < dotCount; d++) {
        const dx = cx - widthAtY + d * 24 + Math.sin(l * 12 + d) * 4;
        ctx.fillStyle = d % 3 === 0 ? '#10b981' : '#3b82f6';
        ctx.beginPath();
        ctx.arc(dx, lineY + Math.cos(d * 7) * 4, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.strokeStyle = 'rgba(234, 88, 12, 0.25)';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, width - 80, height - 80);
  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#080200' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#ea580c', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

const SunEarthConclusion: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: '#080200', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 50px', justifyContent: 'center' }}>
    <div style={{ width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #ffedd5 0%, #ea580c 70%, #080200 100%)', boxShadow: '0 0 30px rgba(234,88,12,0.2)' }} />
    
    <div style={{ width: '100%', marginTop: '30px', textAlign: 'center' }}>
      <span style={{ color: '#ea580c', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
      <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
    </div>

    <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #ea580c', padding: '20px', borderRadius: '0 8px 8px 0' }}>
        <div style={{ color: '#ea580c', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>VOLUME CAPACITY</div>
        <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>1.3 Million Earths</div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #3b82f6', padding: '20px', borderRadius: '0 8px 8px 0' }}>
        <div style={{ color: '#3b82f6', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>MASS RATIO</div>
        <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Sun holds 99% Solar Mass</div>
      </div>
    </div>
  </AbsoluteFill>
);

export const SunEarthScaleVisual: React.FC<{ sceneId: string; title: string; eyebrow: string; theme: string }> = ({ sceneId, title, eyebrow }) => {
  switch (sceneId) {
    case 'intro': return <SunEarthIntro title={title} eyebrow={eyebrow} />;
    case 'diagram': return <VolumeRatioDiagram title={title} eyebrow={eyebrow} />;
    case 'simulation': return <SunEarthInstancing title={title} eyebrow={eyebrow} />;
    case 'summary': return <SunEarthConclusion title={title} eyebrow={eyebrow} />;
    default: return <SunEarthIntro title={title} eyebrow={eyebrow} />;
  }
};
