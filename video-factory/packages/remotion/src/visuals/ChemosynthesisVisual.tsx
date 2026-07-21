import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

const OceanTitle: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, config: { damping: 18 } });
  const opacity = Math.min(1, frame / 15);
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #020a18 0%, #0a1e3d 30%, #0f2b4a 60%, #1a3a5c 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {Array.from({ length: 35 }).map((_, i) => {
        const x = ((Math.sin(i * 73.1) * 0.5 + 0.5) * 100);
        const t = frame / fps;
        const speed = 20 + (i % 5) * 12;
        const y = 100 - ((t * speed + i * 33) % 120);
        const size = 4 + (i % 8);
        return <div key={i} style={{ position: 'absolute', left: x + '%', top: y + '%', width: size, height: size, borderRadius: '50%', background: 'rgba(20, 184, 166, 0.25)', border: '1px solid rgba(20, 184, 166, 0.35)' }} />;
      })}
      <div style={{ position: 'absolute', bottom: '-80px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(234, 88, 12, 0.3) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      <div style={{ zIndex: 10, textAlign: 'center', opacity, padding: '0 60px' }}>
        <span style={{ fontSize: '26px', fontWeight: 'bold', color: '#14b8a6', letterSpacing: '8px' }}>{eyebrow}</span>
        <h1 style={{ fontSize: '52px', fontWeight: 800, marginTop: '24px', color: '#e0f2fe', fontFamily: 'Georgia, serif', letterSpacing: (2 + progress * 6) + 'px', lineHeight: '1.3' }}>{title}</h1>
      </div>
    </AbsoluteFill>
  );
};

const VentDiagram: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ background: '#020a18', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 50px', overflow: 'hidden' }}>
      <div style={{ width: '100%', border: '2px solid #14b8a6', borderRadius: '16px', background: 'rgba(10, 30, 61, 0.8)', padding: '30px', fontFamily: 'monospace' }}>
        <div style={{ color: '#14b8a6', fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px' }}>{eyebrow}</div>
        <div style={{ color: '#e0f2fe', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}><div style={{ color: '#7dd3c0', fontSize: '14px' }}>DEPTH</div><div style={{ color: '#ffffff', fontSize: '20px', fontWeight: 'bold' }}>2,500 m</div></div>
          <div style={{ flex: 1 }}><div style={{ color: '#7dd3c0', fontSize: '14px' }}>TEMP</div><div style={{ color: '#ea580c', fontSize: '20px', fontWeight: 'bold' }}>407 °C</div></div>
          <div style={{ flex: 1 }}><div style={{ color: '#7dd3c0', fontSize: '14px' }}>PRESSURE</div><div style={{ color: '#ffffff', fontSize: '20px', fontWeight: 'bold' }}>250 atm</div></div>
        </div>
      </div>
      <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
        <svg width="900" height="1100" viewBox="0 0 400 500" style={{ borderRadius: '16px', background: 'rgba(2, 10, 24, 0.6)' }}>
          <rect x="0" y="350" width="400" height="150" fill="#1a2744" stroke="#14b8a6" strokeWidth="1" />
          <line x1="0" y1="350" x2="400" y2="350" stroke="#14b8a6" strokeWidth="2" />
          <polygon points="170,350 178,140 222,140 230,350" fill="#3d2c1a" stroke="#7c5a2e" strokeWidth="2" />
          {Array.from({ length: 10 }).map((_, i) => {
            const py = 130 - (t * 35 + i * 25) % 130;
            const px = 200 + Math.sin(t * 2 + i) * (15 + i * 6);
            const r = 8 + i * 4;
            return <circle key={i} cx={px} cy={py} r={r} fill="rgba(60, 60, 60, 0.5)" opacity={Math.max(0, 1 - py / 130)} />;
          })}
          {Array.from({ length: 12 }).map((_, i) => {
            const py = 130 - ((t * 20 + i * 18) % 130);
            const px = 200 + Math.sin(t * 1.5 + i * 2) * 30;
            const colors = ['#ea580c', '#f59e0b', '#14b8a6'];
            return <circle key={'m' + i} cx={px} cy={py} r={3} fill={colors[i % 3]} opacity={0.7} />;
          })}
          <text x="200" y="390" fill="#7dd3c0" fontSize="14" fontFamily="monospace" textAnchor="middle">OCEAN FLOOR</text>
          <text x="200" y="125" fill="#ea580c" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">BLACK SMOKER</text>
          {Array.from({ length: 8 }).map((_, i) => <circle key={'b' + i} cx={160 + i * 12} cy={345} r={4 + Math.sin(t * 3 + i) * 1.5} fill="#22c55e" opacity={0.7} />)}
          <text x="200" y="335" fill="#22c55e" fontSize="11" fontFamily="monospace" textAnchor="middle">BACTERIAL COLONIES</text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

const BacterialSim: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
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
    const cx = width / 2, cy = height / 2 + 100;
    const gradient = ctx.createRadialGradient(cx, cy + 150, 10, cx, cy + 150, 300);
    gradient.addColorStop(0, 'rgba(234, 88, 12, 0.5)');
    gradient.addColorStop(0.5, 'rgba(234, 88, 12, 0.12)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    const branchCount = 28;
    const maxLength = Math.min(t * 70, 400);
    ctx.lineWidth = 2;
    for (let i = 0; i < branchCount; i++) {
      const angle = (i / branchCount) * Math.PI * 2;
      const wobble = Math.sin(i * 5.3) * 0.3;
      const len = maxLength * (0.4 + Math.sin(i * 2.7) * 0.5);
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.6)';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      let px = cx, py = cy;
      for (let s = 1; s <= 5; s++) {
        const segLen = len / 5;
        const segAngle = angle + wobble * Math.sin(s * 3.1 + i);
        px += Math.cos(segAngle) * segLen;
        py += Math.sin(segAngle) * segLen;
        ctx.lineTo(px, py);
      }
      ctx.stroke();
      if (t > 1) { ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(px, py, 4 + Math.sin(t * 4 + i) * 2, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.fillStyle = '#ea580c'; ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(20, 184, 166, 0.25)'; ctx.lineWidth = 3; ctx.strokeRect(40, 40, width - 80, height - 80);
  }, [frame, width, height, fps, t]);
  return (
    <AbsoluteFill style={{ background: '#020a18' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#14b8a6', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#e0f2fe', fontSize: '32px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

const ChemoSummary: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: '#020a18', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 50px', overflow: 'hidden' }}>
    <div style={{ width: '100%', height: '360px', border: '1px solid rgba(20, 184, 166, 0.3)', borderRadius: '16px', background: 'radial-gradient(circle at 50% 60%, #0f2b4a 0%, #020a18 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="180" height="180" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 12px #14b8a6)' }}>
        <polygon points="40,85 45,30 55,30 60,85" fill="none" stroke="#14b8a6" strokeWidth="2" />
        <circle cx="50" cy="25" r="8" fill="none" stroke="#ea580c" strokeWidth="2" /><circle cx="50" cy="25" r="14" fill="none" stroke="rgba(234, 88, 12, 0.3)" strokeWidth="1" />
        <circle cx="42" cy="82" r="3" fill="#22c55e" /><circle cx="50" cy="84" r="3" fill="#22c55e" /><circle cx="58" cy="82" r="3" fill="#22c55e" />
        <text x="50" y="98" fill="#14b8a6" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">HYDROTHERMAL VENT</text>
      </svg>
    </div>
    <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div><div style={{ color: '#14b8a6', fontSize: '22px', fontWeight: 'bold', letterSpacing: '4px', fontFamily: 'monospace' }}>{eyebrow}</div>
        <div style={{ color: '#e0f2fe', fontSize: '40px', fontWeight: 800, marginTop: '10px', fontFamily: 'Georgia, serif' }}>{title}</div></div>
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid rgba(20, 184, 166, 0.15)', paddingBottom: '20px' }}>
        <span style={{ color: '#14b8a6', fontSize: '28px', fontWeight: 'bold', fontFamily: 'monospace' }}>01</span>
        <div><h3 style={{ color: '#ffffff', fontSize: '22px', fontWeight: 'bold' }}>CHEMOSYNTHESIS</h3><p style={{ color: '#7dd3c0', fontSize: '17px', marginTop: '6px', lineHeight: 1.4 }}>Bacteria oxidize H₂S to produce organic carbon without photosynthesis.</p></div>
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <span style={{ color: '#14b8a6', fontSize: '28px', fontWeight: 'bold', fontFamily: 'monospace' }}>02</span>
        <div><h3 style={{ color: '#ffffff', fontSize: '22px', fontWeight: 'bold' }}>DEEP-SEA FOOD WEB</h3><p style={{ color: '#7dd3c0', fontSize: '17px', marginTop: '6px', lineHeight: 1.4 }}>Tube worms, shrimp, and crabs depend entirely on chemosynthetic bacteria.</p></div>
      </div>
    </div>
  </AbsoluteFill>
);

export const ChemosynthesisVisual: React.FC<{ sceneId: string; title: string; eyebrow: string; theme: string }> = ({ sceneId, title, eyebrow }) => {
  switch (sceneId) {
    case 'intro': return <OceanTitle title={title} eyebrow={eyebrow} />;
    case 'diagram': return <VentDiagram title={title} eyebrow={eyebrow} />;
    case 'simulation': return <BacterialSim title={title} eyebrow={eyebrow} />;
    case 'summary': return <ChemoSummary title={title} eyebrow={eyebrow} />;
    default: return <OceanTitle title={title} eyebrow={eyebrow} />;
  }
};