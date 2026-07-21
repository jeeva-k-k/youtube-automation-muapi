import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

const SunVanishIntro: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const progress = spring({ frame, fps, config: { damping: 18 } });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2 + 100;

    // Draw background stars
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 20; i++) {
      ctx.fillRect((Math.sin(i * 15) * 0.5 + 0.5) * width, (Math.cos(i * 8) * 0.5 + 0.5) * height, 2, 2);
    }

    // Draw Sun in center (disappears at t = 1.0s)
    if (t < 1.0) {
      const sunGrd = ctx.createRadialGradient(cx, cy, 10, cx, cy, 70);
      sunGrd.addColorStop(0, '#fff');
      sunGrd.addColorStop(0.3, '#f59e0b');
      sunGrd.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGrd;
      ctx.beginPath();
      ctx.arc(cx, cy, 70, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Draw vanishing flash ring
      const flashT = t - 1.0;
      if (flashT < 0.3) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - flashT / 0.3})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, flashT * 120, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Draw Earth orbiting
    const orbitRadius = 180;
    const angle = t * 2; // Orbit angle
    const earthX = cx + Math.cos(angle) * orbitRadius;
    const earthY = cy + Math.sin(angle) * orbitRadius;

    // Orbit path line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, orbitRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw Earth (blue sphere)
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(earthX, earthY, 15, 0, Math.PI * 2);
    ctx.fill();
  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#020208' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      {t < 1.5 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '0 50px', background: 'rgba(2,2,8,0.4)', backdropFilter: 'blur(4px)', opacity: 1 - t / 1.5 }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b', letterSpacing: '8px', fontFamily: 'monospace' }}>{eyebrow}</span>
          <h1 style={{ fontSize: '48px', fontWeight: 800, marginTop: '20px', color: '#f8fafc', fontFamily: 'Georgia, serif', letterSpacing: (1 + progress * 6) + 'px', textAlign: 'center', lineHeight: 1.3 }}>{title}</h1>
        </div>
      )}
    </AbsoluteFill>
  );
};

const GravityPropagation: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
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

    // Gravity/light wave propagation radiating outwards from center
    const waveRadius = t * 140;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, waveRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, waveRadius - 30 > 0 ? waveRadius - 30 : 0, 0, Math.PI * 2);
    ctx.stroke();

    // Center indicator (Sun missing)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // Draw static target Earth
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(cx + 200, cy, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('EARTH', cx + 200, cy - 24);
  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#020208' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#ef4444', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

const EarthTangentPath: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
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

    // Earth flying off in a straight tangent line from the point it was released
    const releaseX = cx + 200;
    const releaseY = cy;
    const earthY = releaseY - t * 240; // moves straight up (tangent)

    // Draw original circular orbit path in grey
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 200, 0, Math.PI * 2);
    ctx.stroke();

    // Draw straight tangent trajectory line
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(releaseX, releaseY);
    ctx.lineTo(releaseX, earthY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Earth
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(releaseX, earthY, 15, 0, Math.PI * 2);
    ctx.fill();

    // Draw tangent path marker
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('STRAIGHT TANGENT', releaseX + 24, earthY + 5);
  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#020208' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#ef4444', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

const SunVanishConclusion: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: '#020208', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 50px', justifyContent: 'center' }}>
    {/* Earth drifting in dark space */}
    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #3b82f6 0%, #1d4ed8 70%, #020208 100%)', boxShadow: '0 0 20px rgba(59,130,246,0.15)' }} />
    
    <div style={{ width: '100%', marginTop: '30px', textAlign: 'center' }}>
      <span style={{ color: '#ef4444', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
      <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
    </div>

    <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #ef4444', padding: '20px', borderRadius: '0 8px 8px 0' }}>
        <div style={{ color: '#ef4444', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>PROPAGATION DELAY</div>
        <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>8.3 Minutes (Speed of Light)</div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #22c55e', padding: '20px', borderRadius: '0 8px 8px 0' }}>
        <div style={{ color: '#22c55e', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>ORBIT TRAJECTORY</div>
        <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Straight Tangent Line</div>
      </div>
    </div>
  </AbsoluteFill>
);

export const SunVanishVisual: React.FC<{ sceneId: string; title: string; eyebrow: string; theme: string }> = ({ sceneId, title, eyebrow }) => {
  switch (sceneId) {
    case 'intro': return <SunVanishIntro title={title} eyebrow={eyebrow} />;
    case 'diagram': return <GravityPropagation title={title} eyebrow={eyebrow} />;
    case 'simulation': return <EarthTangentPath title={title} eyebrow={eyebrow} />;
    case 'summary': return <SunVanishConclusion title={title} eyebrow={eyebrow} />;
    default: return <SunVanishIntro title={title} eyebrow={eyebrow} />;
  }
};
