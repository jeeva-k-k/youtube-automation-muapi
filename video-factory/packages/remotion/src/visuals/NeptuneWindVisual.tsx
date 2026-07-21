import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

const NeptuneIntro: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const progress = spring({ frame, fps, config: { damping: 18 } });

  // Fast winds flow particles
  const particles = useRef<Array<{ y: number; x: number; speed: number; len: number }>>([]);
  if (particles.current.length === 0) {
    for (let i = 0; i < 40; i++) {
      particles.current.push({
        y: 600 + Math.random() * 600,
        x: Math.random() * 1080,
        speed: 800 + Math.random() * 600, // extremely fast
        len: 20 + Math.random() * 40
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

    // Starfield
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 20; i++) {
      ctx.fillRect((Math.sin(i * 15.3) * 0.5 + 0.5) * width, (Math.cos(i * 9.7) * 0.5 + 0.5) * height, 2, 2);
    }

    // Draw Neptune (beautiful deep blue)
    ctx.save();
    ctx.translate(cx, cy);
    const grd = ctx.createRadialGradient(-30, -30, 20, 0, 0, 160);
    grd.addColorStop(0, '#60a5fa');
    grd.addColorStop(0.6, '#2563eb');
    grd.addColorStop(1, '#1e3a8a');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(0, 0, 160, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Fast wind stream particles flowing across the planet
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    particles.current.forEach(p => {
      p.x += p.speed * (1 / fps);
      if (p.x > width + 100) p.x = -100;

      // Draw particle stream segment
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.len, p.y);
      ctx.stroke();
    });
  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#020210' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      {t < 1.5 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '0 50px', background: 'rgba(2,2,16,0.4)', backdropFilter: 'blur(4px)', opacity: 1 - t / 1.5 }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#60a5fa', letterSpacing: '8px', fontFamily: 'monospace' }}>{eyebrow}</span>
          <h1 style={{ fontSize: '48px', fontWeight: 800, marginTop: '20px', color: '#f8fafc', fontFamily: 'Georgia, serif', letterSpacing: (1 + progress * 6) + 'px', textAlign: 'center', lineHeight: 1.3 }}>{title}</h1>
        </div>
      )}
    </AbsoluteFill>
  );
};

const WindSpeedDiagram: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ background: '#020210', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 50px' }}>
      <div style={{ width: '100%', border: '2px solid #60a5fa', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.8)', padding: '28px', fontFamily: 'monospace' }}>
        <div style={{ color: '#60a5fa', fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '28px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>

      {/* Speedometer comparison */}
      <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '30px', marginTop: '20px' }}>
        <div>
          <div style={{ color: '#94a3b8', fontSize: '15px', fontFamily: 'monospace' }}>EARTH HURRICANE LIMIT</div>
          <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>150 mph</div>
        </div>
        <div>
          <div style={{ color: '#94a3b8', fontSize: '15px', fontFamily: 'monospace' }}>SPEED OF SOUND</div>
          <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>767 mph</div>
        </div>
        <div style={{ borderLeft: '4px solid #60a5fa', paddingLeft: '16px' }}>
          <div style={{ color: '#60a5fa', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>NEPTUNE WINDS</div>
          <div style={{ color: '#fff', fontSize: '32px', fontWeight: 'bold', marginTop: '4px' }}>{Math.min(1200, Math.floor(t * 400))} mph</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const NeptuneStorms: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
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

    // Two wind shear layers (top moving right, bottom moving left)
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.2)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(100, cy - 80); ctx.lineTo(width - 100, cy - 80);
    ctx.moveTo(100, cy + 80); ctx.lineTo(width - 100, cy + 80);
    ctx.stroke();

    // Arrows
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    // Top arrow (right)
    ctx.beginPath();
    ctx.moveTo(cx - 80 + Math.sin(t * 5) * 10, cy - 80);
    ctx.lineTo(cx + 80 + Math.sin(t * 5) * 10, cy - 80);
    ctx.lineTo(cx + 70 + Math.sin(t * 5) * 10, cy - 90);
    ctx.stroke();
    // Bottom arrow (left)
    ctx.beginPath();
    ctx.moveTo(cx + 80 - Math.sin(t * 5) * 10, cy + 80);
    ctx.lineTo(cx - 80 - Math.sin(t * 5) * 10, cy + 80);
    ctx.lineTo(cx - 70 - Math.sin(t * 5) * 10, cy + 90);
    ctx.stroke();

    // Swirling Great Dark Spot vortex forming in the shear zone
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * 5); // rotates fast
    const vGrd = ctx.createRadialGradient(0, 0, 5, 0, 0, 80);
    vGrd.addColorStop(0, '#1e3b8a');
    vGrd.addColorStop(0.7, '#1e40af');
    vGrd.addColorStop(1, 'transparent');
    ctx.fillStyle = vGrd;
    ctx.beginPath();
    ctx.ellipse(0, 0, 80, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    ctx.strokeStyle = 'rgba(96, 165, 250, 0.25)';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, width - 80, height - 80);
  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#020210' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#60a5fa', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

const NeptuneConclusion: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: '#020210', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 50px', justifyContent: 'center' }}>
    <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #60a5fa 0%, #1e3a8a 70%, #020210 100%)', boxShadow: '0 0 30px rgba(96,165,250,0.15)' }} />
    
    <div style={{ width: '100%', marginTop: '30px', textAlign: 'center' }}>
      <span style={{ color: '#60a5fa', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
      <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
    </div>

    <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #60a5fa', padding: '20px', borderRadius: '0 8px 8px 0' }}>
        <div style={{ color: '#60a5fa', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>TOP WIND SPEED</div>
        <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>1,200 mph (2,000 km/h)</div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #38bdf8', padding: '20px', borderRadius: '0 8px 8px 0' }}>
        <div style={{ color: '#38bdf8', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>ATMOSPHERIC ENGINE</div>
        <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Powered by Internal Heat</div>
      </div>
    </div>
  </AbsoluteFill>
);

export const NeptuneWindVisual: React.FC<{ sceneId: string; title: string; eyebrow: string; theme: string }> = ({ sceneId, title, eyebrow }) => {
  switch (sceneId) {
    case 'intro': return <NeptuneIntro title={title} eyebrow={eyebrow} />;
    case 'diagram': return <WindSpeedDiagram title={title} eyebrow={eyebrow} />;
    case 'simulation': return <NeptuneStorms title={title} eyebrow={eyebrow} />;
    case 'summary': return <NeptuneConclusion title={title} eyebrow={eyebrow} />;
    default: return <NeptuneIntro title={title} eyebrow={eyebrow} />;
  }
};
