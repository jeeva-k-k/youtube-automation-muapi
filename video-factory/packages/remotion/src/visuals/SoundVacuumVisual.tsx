import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

const SoundIntro: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
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

    // Draw split-screen line
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 250);
    ctx.lineTo(cx, cy + 250);
    ctx.stroke();

    // LEFT: Hollywood Sci-Fi (Explosion with loud orange shockwave rings)
    const leftGlow = ctx.createRadialGradient(cx - 200, cy, 10, cx - 200, cy, 100);
    leftGlow.addColorStop(0, '#f97316');
    leftGlow.addColorStop(0.5, '#ef4444');
    leftGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = leftGlow;
    ctx.beginPath();
    ctx.arc(cx - 200, cy, 100, 0, Math.PI * 2);
    ctx.fill();

    // Sound shockwave rings
    ctx.strokeStyle = `rgba(249, 115, 22, ${Math.max(0, 1 - (t % 1))})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx - 200, cy, (t % 1) * 120, 0, Math.PI * 2);
    ctx.stroke();

    // RIGHT: Physical Reality (Quiet expansion - light flash only, no shockwave rings)
    if (t < 0.6) {
      const rightGlow = ctx.createRadialGradient(cx + 200, cy, 5, cx + 200, cy, 80);
      rightGlow.addColorStop(0, '#fff');
      rightGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = rightGlow;
      ctx.beginPath();
      ctx.arc(cx + 200, cy, 80, 0, Math.PI * 2);
      ctx.fill();
    }

    // Text labels
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('HOLLYWOOD ROAR', cx - 200, cy + 140);
    ctx.fillStyle = '#22c55e';
    ctx.fillText('SILENT REALITY', cx + 200, cy + 140);

  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#030206' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      {t < 1.5 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '0 50px', background: 'rgba(3,2,6,0.4)', backdropFilter: 'blur(4px)', opacity: 1 - t / 1.5 }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#a855f7', letterSpacing: '8px', fontFamily: 'monospace' }}>{eyebrow}</span>
          <h1 style={{ fontSize: '48px', fontWeight: 800, marginTop: '20px', color: '#f8fafc', fontFamily: 'Georgia, serif', letterSpacing: (1 + progress * 6) + 'px', textAlign: 'center', lineHeight: 1.3 }}>{title}</h1>
        </div>
      )}
    </AbsoluteFill>
  );
};

const VacuumLattice: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ background: '#030206', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 50px' }}>
      <div style={{ width: '100%', border: '2px solid #a855f7', borderRadius: '16px', background: 'rgba(21, 16, 28, 0.8)', padding: '28px', fontFamily: 'monospace' }}>
        <div style={{ color: '#a855f7', fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '28px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>

      <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '30px', marginTop: '20px' }}>
        <div>
          <div style={{ color: '#c084fc', fontSize: '15px', fontFamily: 'monospace' }}>PROPAGATION MEDIUM</div>
          <div style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', marginTop: '4px' }}>No Air/Matter in Vacuum</div>
        </div>
        <div style={{ borderLeft: '4px solid #ef4444', paddingLeft: '16px' }}>
          <div style={{ color: '#ef4444', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>SOUND WAVE AMPLITUDE</div>
          <div style={{ color: '#fff', fontSize: '38px', fontWeight: 'bold', marginTop: '4px' }}>0% (Cannot Oscillate)</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const WavePropagationSim: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
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

    // Draw grid of particles representing air molecules that stop at vacuum threshold
    const midX = cx;
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(midX, cy - 200); ctx.lineTo(midX, cy + 200); ctx.stroke();

    // Labels
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('AIR MEDIUM', midX - 80, cy - 220);
    ctx.fillText('VACUUM SPACE', midX + 80, cy - 220);

    // Left side: Air molecules vibrating, sound wave propagating
    ctx.fillStyle = '#a855f7';
    for (let x = 80; x < midX; x += 30) {
      const compression = Math.sin(x * 0.1 - t * 12) * 10;
      for (let y = cy - 160; y < cy + 160; y += 40) {
        ctx.beginPath();
        ctx.arc(x + compression, y + Math.cos(x) * 5, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Sound wave packet (sine wave) propagating and dying out at the border
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 80; px < width - 80; px++) {
      let py = cy + Math.sin(px * 0.05 - t * 15) * 40;
      if (px > midX) {
        // Flat line in vacuum
        py = cy;
      }
      if (px === 80) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, width - 80, height - 80);
  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#030206' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#a855f7', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

const SoundConclusion: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: '#030206', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 50px', justifyContent: 'center' }}>
    <svg width="120" height="120" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 12px #a855f7)' }}>
      <circle cx="50" cy="50" r="30" fill="none" stroke="#a855f7" strokeWidth="3" />
      <line x1="28" y1="28" x2="72" y2="72" stroke="#ef4444" strokeWidth="5" />
    </svg>
    
    <div style={{ width: '100%', marginTop: '30px', textAlign: 'center' }}>
      <span style={{ color: '#a855f7', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
      <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
    </div>

    <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #ef4444', padding: '20px', borderRadius: '0 8px 8px 0' }}>
        <div style={{ color: '#ef4444', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>SOUND WAVE TRAJECTORY</div>
        <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Cannot Cross Vacuum Space</div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #a855f7', padding: '20px', borderRadius: '0 8px 8px 0' }}>
        <div style={{ color: '#a855f7', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>LIGHT & RADIO</div>
        <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Electromagnetic (Propagates Safely)</div>
      </div>
    </div>
  </AbsoluteFill>
);

export const SoundVacuumVisual: React.FC<{ sceneId: string; title: string; eyebrow: string; theme: string }> = ({ sceneId, title, eyebrow }) => {
  switch (sceneId) {
    case 'intro': return <SoundIntro title={title} eyebrow={eyebrow} />;
    case 'diagram': return <VacuumLattice title={title} eyebrow={eyebrow} />;
    case 'simulation': return <WavePropagationSim title={title} eyebrow={eyebrow} />;
    case 'summary': return <SoundConclusion title={title} eyebrow={eyebrow} />;
    default: return <SoundIntro title={title} eyebrow={eyebrow} />;
  }
};
