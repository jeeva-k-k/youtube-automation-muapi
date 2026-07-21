import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

const ExoplanetIntro: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const progress = spring({ frame, fps, config: { damping: 18 } });

  // Sideways glass rain shards
  const shards = useRef<Array<{ y: number; x: number; speed: number; len: number; thickness: number }>>([]);
  if (shards.current.length === 0) {
    for (let i = 0; i < 50; i++) {
      shards.current.push({
        y: 400 + Math.random() * 900,
        x: Math.random() * 1080,
        speed: 1500 + Math.random() * 1200, // Supersonic sideways rain
        len: 30 + Math.random() * 60,
        thickness: 1 + Math.random() * 2
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

    // Draw deep blue exoplanet HD 189733 b (cobalt blue)
    ctx.save();
    ctx.translate(cx, cy);
    const grd = ctx.createRadialGradient(-40, -40, 20, 0, 0, 160);
    grd.addColorStop(0, '#38bdf8');
    grd.addColorStop(0.5, '#1d4ed8');
    grd.addColorStop(1, '#0f172a');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(0, 0, 160, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Raining glass shards flying horizontally
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.6)';
    shards.current.forEach(s => {
      s.x += s.speed * (1 / fps);
      if (s.x > width + 100) s.x = -100;

      ctx.lineWidth = s.thickness;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.len, s.y);
      ctx.stroke();
    });

  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#020108' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      {t < 1.5 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '0 50px', background: 'rgba(2,1,8,0.4)', backdropFilter: 'blur(4px)', opacity: 1 - t / 1.5 }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#38bdf8', letterSpacing: '8px', fontFamily: 'monospace' }}>{eyebrow}</span>
          <h1 style={{ fontSize: '48px', fontWeight: 800, marginTop: '20px', color: '#f8fafc', fontFamily: 'Georgia, serif', letterSpacing: (1 + progress * 6) + 'px', textAlign: 'center', lineHeight: 1.3 }}>{title}</h1>
        </div>
      )}
    </AbsoluteFill>
  );
};

const WindSpeedComparison: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ background: '#020108', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 50px' }}>
      <div style={{ width: '100%', border: '2px solid #38bdf8', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.8)', padding: '28px', fontFamily: 'monospace' }}>
        <div style={{ color: '#38bdf8', fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '28px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>

      <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '30px', marginTop: '20px' }}>
        <div>
          <div style={{ color: '#94a3b8', fontSize: '15px', fontFamily: 'monospace' }}>EARTH CATEGORY 5 HURRICANE</div>
          <div style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', marginTop: '4px' }}>157 mph</div>
        </div>
        <div>
          <div style={{ color: '#94a3b8', fontSize: '15px', fontFamily: 'monospace' }}>SPEED OF SOUND</div>
          <div style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', marginTop: '4px' }}>767 mph</div>
        </div>
        <div style={{ borderLeft: '4px solid #38bdf8', paddingLeft: '16px' }}>
          <div style={{ color: '#38bdf8', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>EXOPLANET HD 189733 b WINDS</div>
          <div style={{ color: '#fff', fontSize: '38px', fontWeight: 'bold', marginTop: '4px' }}>{Math.min(5400, Math.floor(t * 1800))} mph</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SilicaCondensation: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
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

    // Draw molecular view of silica condensing into liquid glass droplets
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.lineWidth = 2;

    // Draw grid of bonds
    const spacing = 120;
    const cols = 5;
    const rows = 5;
    const startX = cx - (cols - 1) * spacing / 2;
    const startY = cy - (rows - 1) * spacing / 2;

    const vibrate = Math.sin(t * 20) * 8;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * spacing + (r % 2 === 0 ? vibrate : -vibrate);
        const y = startY + r * spacing + (c % 2 === 0 ? vibrate : -vibrate);

        // draw lines to neighbors
        if (c < cols - 1) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(startX + (c + 1) * spacing + (r % 2 === 0 ? vibrate : -vibrate), y);
          ctx.stroke();
        }
        if (r < rows - 1) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, startY + (r + 1) * spacing + (c % 2 === 0 ? vibrate : -vibrate));
          ctx.stroke();
        }

        // Draw silica/oxygen atoms (glass lattice)
        ctx.fillStyle = c % 2 === 0 ? '#38bdf8' : '#e0f2fe';
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, width - 80, height - 80);
  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#020108' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#38bdf8', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

const ExoplanetConclusion: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: '#020108', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 50px', justifyContent: 'center' }}>
    <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #38bdf8 0%, #1d4ed8 70%, #020108 100%)', boxShadow: '0 0 30px rgba(56,189,248,0.2)' }} />
    
    <div style={{ width: '100%', marginTop: '30px', textAlign: 'center' }}>
      <span style={{ color: '#38bdf8', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
      <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
    </div>

    <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #38bdf8', padding: '20px', borderRadius: '0 8px 8px 0' }}>
        <div style={{ color: '#38bdf8', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>WIND SPEED</div>
        <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>5,400 mph (Supersonic)</div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #f43f5e', padding: '20px', borderRadius: '0 8px 8px 0' }}>
        <div style={{ color: '#f43f5e', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>WEATHER PHENOMENON</div>
        <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Sideways Liquid Glass Rain</div>
      </div>
    </div>
  </AbsoluteFill>
);

export const ExoplanetRainVisual: React.FC<{ sceneId: string; title: string; eyebrow: string; theme: string }> = ({ sceneId, title, eyebrow }) => {
  switch (sceneId) {
    case 'intro': return <ExoplanetIntro title={title} eyebrow={eyebrow} />;
    case 'diagram': return <WindSpeedComparison title={title} eyebrow={eyebrow} />;
    case 'simulation': return <SilicaCondensation title={title} eyebrow={eyebrow} />;
    case 'summary': return <ExoplanetConclusion title={title} eyebrow={eyebrow} />;
    default: return <ExoplanetIntro title={title} eyebrow={eyebrow} />;
  }
};
