import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

const ChalkTitle: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, config: { damping: 18 } });
  const opacity = Math.min(1, frame / 15);
  return (
    <AbsoluteFill style={{ background: '#1a2a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {Array.from({ length: 35 }).map((_, i) => <div key={i} style={{ position: 'absolute', top: (i * 54) + 'px', left: 0, right: 0, borderTop: '1px solid rgba(255,255,255,0.02)' }} />)}
      {Array.from({ length: 20 }).map((_, i) => { const x = ((Math.sin(i*41.3)*0.5+0.5)*100); const y = ((Math.cos(i*67.7)*0.5+0.5)*100); return <div key={i} style={{ position: 'absolute', left: x+'%', top: y+'%', width: '2px', height: '2px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />; })}
      <div style={{ zIndex: 10, textAlign: 'center', opacity, padding: '0 60px' }}>
        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#4ade80', letterSpacing: '6px', fontFamily: 'monospace' }}>{eyebrow}</span>
        <h1 style={{ fontSize: '50px', fontWeight: 800, marginTop: '24px', color: '#f0fdf4', fontFamily: 'Georgia, serif', letterSpacing: (2 + progress * 5) + 'px', textShadow: '2px 2px 0 rgba(0,0,0,0.3)', lineHeight: 1.3 }}>{title}</h1>
      </div>
    </AbsoluteFill>
  );
};

const WindDiagram: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ background: '#1a2a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 50px' }}>
      <div style={{ width: '100%', border: '2px solid #4ade80', borderRadius: '16px', background: 'rgba(26,42,26,0.8)', padding: '28px', fontFamily: 'monospace' }}>
        <div style={{ color: '#4ade80', fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px' }}>{eyebrow}</div>
        <div style={{ color: '#f0fdf4', fontSize: '28px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          <div style={{ flex: 1 }}><div style={{ color: '#86efac', fontSize: '13px' }}>NORTH</div><div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>Right →</div></div>
          <div style={{ flex: 1 }}><div style={{ color: '#86efac', fontSize: '13px' }}>SOUTH</div><div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>← Left</div></div>
        </div>
      </div>
      <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '24px' }}>
        <svg width="900" height="1100" viewBox="0 0 400 500" style={{ borderRadius: '16px', background: 'rgba(26,42,26,0.6)' }}>
          <circle cx="200" cy="230" r="170" fill="none" stroke="#4ade80" strokeWidth="2" />
          <circle cx="200" cy="230" r="120" fill="none" stroke="rgba(74,222,128,0.2)" strokeWidth="1" />
          <circle cx="200" cy="230" r="65" fill="none" stroke="rgba(74,222,128,0.2)" strokeWidth="1" />
          <text x="200" y="235" fill="#4ade80" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">N. POLE</text>
          {Array.from({ length: 6 }).map((_, i) => { const a = (i/6)*Math.PI*2+t*0.4; const r1=80; const r2=155; return <line key={i} x1={200+Math.cos(a)*r1} y1={230+Math.sin(a)*r1} x2={200+Math.cos(a+0.5)*r2} y2={230+Math.sin(a+0.5)*r2} stroke="#0ea5e9" strokeWidth="2" markerEnd="url(#ac)" opacity="0.7" />; })}
          <defs><marker id="ac" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#0ea5e9" /></marker></defs>
          <text x="200" y="440" fill="#86efac" fontSize="13" fontFamily="monospace" textAnchor="middle">DEFLECTION → RIGHT (NH)</text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

const CycloneSim: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
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
    const cx = width / 2, cy = height / 2;
    for (let i = 0; i < 140; i++) {
      const baseAngle = (i / 140) * Math.PI * 2;
      const spiralR = 30 + (i / 140) * 380;
      const angle = baseAngle + t * (1.5 - spiralR / 600) * 3;
      const px = cx + Math.cos(angle) * spiralR;
      const py = cy + Math.sin(angle) * spiralR;
      const inn = 1 - spiralR / 420;
      ctx.fillStyle = 'rgba(' + Math.floor(14+inn*200) + ',' + Math.floor(165+inn*60) + ',' + Math.floor(233-inn*100) + ',0.7)';
      ctx.beginPath(); ctx.arc(px, py, 2 + (i % 4), 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = 'rgba(26,42,26,0.8)'; ctx.beginPath(); ctx.arc(cx, cy, 26, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 26, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#4ade80'; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center'; ctx.fillText('EYE', cx, cy + 4);
    ctx.strokeStyle = 'rgba(74,222,128,0.25)'; ctx.lineWidth = 3; ctx.strokeRect(40, 40, width - 80, height - 80);
  }, [frame, width, height, fps, t]);
  return (
    <AbsoluteFill style={{ background: '#1a2a1a' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#4ade80', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f0fdf4', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

const CoriolisSummary: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: '#1a2a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 50px' }}>
    <div style={{ width: '100%', height: '340px', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '16px', background: 'radial-gradient(circle, #243824 0%, #1a2a1a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="180" height="180" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 12px #4ade80)' }}><circle cx="50" cy="50" r="35" fill="none" stroke="#4ade80" strokeWidth="2" /><path d="M 50 15 Q 75 50 50 85" fill="none" stroke="#0ea5e9" strokeWidth="2" /><path d="M 50 15 Q 25 50 50 85" fill="none" stroke="#0ea5e9" strokeWidth="2" /><circle cx="50" cy="50" r="4" fill="#4ade80" /><text x="50" y="95" fill="#86efac" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">EARTH ROTATION</text></svg>
    </div>
    <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div><div style={{ color: '#4ade80', fontSize: '22px', fontWeight: 'bold', letterSpacing: '4px', fontFamily: 'monospace' }}>{eyebrow}</div><div style={{ color: '#f0fdf4', fontSize: '40px', fontWeight: 800, marginTop: '10px', fontFamily: 'Georgia, serif' }}>{title}</div></div>
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid rgba(74,222,128,0.15)', paddingBottom: '20px' }}><span style={{ color: '#4ade80', fontSize: '28px', fontWeight: 'bold', fontFamily: 'monospace' }}>01</span><div><h3 style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold' }}>APPARENT DEFLECTION</h3><p style={{ color: '#86efac', fontSize: '17px', marginTop: '6px', lineHeight: 1.4 }}>Not a real force but an apparent deflection caused by Earth's rotation.</p></div></div>
      <div style={{ display: 'flex', gap: '16px' }}><span style={{ color: '#4ade80', fontSize: '28px', fontWeight: 'bold', fontFamily: 'monospace' }}>02</span><div><h3 style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold' }}>WEATHER ENGINE</h3><p style={{ color: '#86efac', fontSize: '17px', marginTop: '6px', lineHeight: 1.4 }}>Trade winds, jet streams, and hurricane rotation are all shaped by the Coriolis effect.</p></div></div>
    </div>
  </AbsoluteFill>
);

export const CoriolisVisual: React.FC<{ sceneId: string; title: string; eyebrow: string; theme: string }> = ({ sceneId, title, eyebrow }) => {
  switch (sceneId) { case 'intro': return <ChalkTitle title={title} eyebrow={eyebrow} />; case 'diagram': return <WindDiagram title={title} eyebrow={eyebrow} />; case 'simulation': return <CycloneSim title={title} eyebrow={eyebrow} />; case 'summary': return <CoriolisSummary title={title} eyebrow={eyebrow} />; default: return <ChalkTitle title={title} eyebrow={eyebrow} />; }
};