import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

const BlueprintTitle: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const progress = spring({ frame, fps, config: { damping: 18 } });
  const opacity = Math.min(1, frame / 15);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(29, 78, 216, 0.1)'; ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
    for (let y = 0; y < height; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
  }, [frame, width, height]);
  return (
    <AbsoluteFill style={{ background: '#0a1628' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, opacity, padding: '0 50px' }}>
        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444', letterSpacing: '6px', fontFamily: 'monospace' }}>{eyebrow}</span>
        <h1 style={{ fontSize: '48px', fontWeight: 800, marginTop: '24px', color: '#dbeafe', fontFamily: 'Courier New, monospace', letterSpacing: (2 + progress * 5) + 'px', lineHeight: 1.3, textAlign: 'center' }}>{title}</h1>
        <div style={{ marginTop: '30px', width: '280px', height: '12px', borderRadius: '6px', background: 'rgba(29,78,216,0.2)', overflow: 'hidden', border: '1px solid rgba(29,78,216,0.4)' }}><div style={{ width: (progress * 100) + '%', height: '100%', background: 'linear-gradient(90deg, #3b82f6, #ef4444)', borderRadius: '6px' }} /></div>
      </div>
    </AbsoluteFill>
  );
};

const ContainerDiagram: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ background: '#0a1628', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 50px' }}>
      <div style={{ width: '100%', border: '2px solid #1d4ed8', borderRadius: '16px', background: 'rgba(10,22,40,0.8)', padding: '28px', fontFamily: 'monospace' }}>
        <div style={{ color: '#ef4444', fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px' }}>{eyebrow}</div>
        <div style={{ color: '#dbeafe', fontSize: '28px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Courier New, monospace' }}>{title}</div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          <div style={{ flex: 1 }}><div style={{ color: '#93c5fd', fontSize: '13px' }}>HOT</div><div style={{ color: '#ef4444', fontSize: '18px', fontWeight: 'bold' }}>90 °C</div></div>
          <div style={{ flex: 1 }}><div style={{ color: '#93c5fd', fontSize: '13px' }}>COLD</div><div style={{ color: '#3b82f6', fontSize: '18px', fontWeight: 'bold' }}>25 °C</div></div>
          <div style={{ flex: 1 }}><div style={{ color: '#93c5fd', fontSize: '13px' }}>RESULT</div><div style={{ color: '#fbbf24', fontSize: '18px', fontWeight: 'bold' }}>Hot first</div></div>
        </div>
      </div>
      <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '24px' }}>
        <svg width="900" height="1100" viewBox="0 0 400 500" style={{ borderRadius: '16px', background: 'rgba(10,22,40,0.6)' }}>
          <defs><pattern id="bp" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(29,78,216,0.06)" strokeWidth="1" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#bp)" />
          <rect x="50" y="80" width="130" height="200" rx="8" fill="none" stroke="#ef4444" strokeWidth="3" /><text x="115" y="65" fill="#ef4444" fontSize="16" fontFamily="monospace" fontWeight="bold" textAnchor="middle">HOT (90°C)</text>
          {[0,1,2].map(i => <path key={'h'+i} d={'M 75 '+(130+i*50)+' Q 115 '+(115+i*50)+' 155 '+(130+i*50)} fill="none" stroke="#ef4444" strokeWidth="1.5" opacity={0.4+Math.sin(t*3+i)*0.3} />)}
          {[0,1,2].map(i => <line key={'e'+i} x1={75+i*40} y1={80} x2={75+i*40} y2={55-Math.sin(t*2+i)*8} stroke="#ef4444" strokeWidth="1.5" opacity="0.5" markerEnd="url(#am)" />)}
          <text x="115" y="310" fill="#fbbf24" fontSize="12" fontFamily="monospace" textAnchor="middle">EVAPORATION</text>
          <rect x="220" y="80" width="130" height="200" rx="8" fill="none" stroke="#3b82f6" strokeWidth="3" /><text x="285" y="65" fill="#3b82f6" fontSize="16" fontFamily="monospace" fontWeight="bold" textAnchor="middle">COLD (25°C)</text>
          {[0,1,2,3].map(i => <circle key={'c'+i} cx={250+(i%2)*40+Math.sin(t+i)*4} cy={130+Math.floor(i/2)*70+Math.cos(t+i)*4} r="7" fill="rgba(59,130,246,0.4)" />)}
          <text x="285" y="310" fill="#93c5fd" fontSize="12" fontFamily="monospace" textAnchor="middle">SLOW MOTION</text>
          <defs><marker id="am" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#ef4444" /></marker></defs>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

const EvaporationSim: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
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
    // Hot container (top)
    const hy = height * 0.32;
    ctx.strokeStyle='#ef4444'; ctx.lineWidth=3; ctx.strokeRect(cx-130, hy-120, 260, 240);
    ctx.fillStyle='#ef4444'; ctx.font='bold 18px monospace'; ctx.textAlign='center'; ctx.fillText('HOT WATER', cx, hy-140);
    for (let i = 0; i < 35; i++) {
      const seed = i * 137.5;
      const mx = cx - 110 + ((seed + t * 180) % 220);
      const my = hy - 100 + ((seed * 0.7 + t * 160) % 200);
      const escaped = i < Math.floor(t * 3) && i < 12;
      if (escaped) { const ey = hy - 120 - (t - i/3) * 70; if (ey > 40) { ctx.fillStyle='rgba(239,68,68,0.4)'; ctx.beginPath(); ctx.arc(cx - 50 + (i%5)*25, ey, 4, 0, Math.PI*2); ctx.fill(); } }
      else { ctx.fillStyle='rgba(239,68,68,0.5)'; ctx.beginPath(); ctx.arc(mx, my, 4, 0, Math.PI*2); ctx.fill(); }
    }
    // Cold container (bottom)
    const cy2 = height * 0.68;
    ctx.strokeStyle='#3b82f6'; ctx.lineWidth=3; ctx.strokeRect(cx-130, cy2-120, 260, 240);
    ctx.fillStyle='#3b82f6'; ctx.font='bold 18px monospace'; ctx.textAlign='center'; ctx.fillText('COLD WATER', cx, cy2-140);
    for (let i = 0; i < 25; i++) {
      const gx = cx - 100 + (i%5)*40 + Math.sin(t*0.5+i)*6;
      const gy = cy2 - 80 + Math.floor(i/5)*40 + Math.cos(t*0.5+i)*6;
      ctx.fillStyle='rgba(59,130,246,0.4)'; ctx.beginPath(); ctx.arc(gx, gy, 4, 0, Math.PI*2); ctx.fill();
    }
    ctx.fillStyle='#fbbf24'; ctx.font='bold 28px Georgia'; ctx.textAlign='center'; ctx.fillText('VS', cx, height/2);
    ctx.strokeStyle='rgba(29,78,216,0.25)'; ctx.lineWidth=3; ctx.strokeRect(40, 40, width-80, height-80);
  }, [frame, width, height, fps, t]);
  return (
    <AbsoluteFill style={{ background: '#0a1628' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#ef4444', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#dbeafe', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Courier New, monospace' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

const MpembaSummary: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: '#0a1628', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 50px' }}>
    <div style={{ width: '100%', height: '340px', border: '1px solid rgba(29,78,216,0.3)', borderRadius: '16px', background: 'radial-gradient(circle, #122040 0%, #0a1628 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="180" height="180" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 12px #1d4ed8)' }}><rect x="20" y="30" width="25" height="45" rx="3" fill="none" stroke="#ef4444" strokeWidth="2" /><text x="32" y="56" fill="#ef4444" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">H</text><rect x="55" y="30" width="25" height="45" rx="3" fill="none" stroke="#3b82f6" strokeWidth="2" /><text x="67" y="56" fill="#3b82f6" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">C</text><text x="50" y="90" fill="#93c5fd" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">HOT vs COLD</text></svg>
    </div>
    <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div><div style={{ color: '#ef4444', fontSize: '22px', fontWeight: 'bold', letterSpacing: '4px', fontFamily: 'monospace' }}>{eyebrow}</div><div style={{ color: '#dbeafe', fontSize: '40px', fontWeight: 800, marginTop: '10px', fontFamily: 'Courier New, monospace' }}>{title}</div></div>
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid rgba(29,78,216,0.15)', paddingBottom: '20px' }}><span style={{ color: '#1d4ed8', fontSize: '28px', fontWeight: 'bold', fontFamily: 'monospace' }}>01</span><div><h3 style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold' }}>EVAPORATIVE MASS LOSS</h3><p style={{ color: '#93c5fd', fontSize: '17px', marginTop: '6px', lineHeight: 1.4 }}>Hot water loses volume through evaporation, leaving less water to freeze.</p></div></div>
      <div style={{ display: 'flex', gap: '16px' }}><span style={{ color: '#1d4ed8', fontSize: '28px', fontWeight: 'bold', fontFamily: 'monospace' }}>02</span><div><h3 style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold' }}>CONVECTION CURRENTS</h3><p style={{ color: '#93c5fd', fontSize: '17px', marginTop: '6px', lineHeight: 1.4 }}>Stronger convection in hot water accelerates heat dissipation.</p></div></div>
    </div>
  </AbsoluteFill>
);

export const MpembaVisual: React.FC<{ sceneId: string; title: string; eyebrow: string; theme: string }> = ({ sceneId, title, eyebrow }) => {
  switch (sceneId) { case 'intro': return <BlueprintTitle title={title} eyebrow={eyebrow} />; case 'diagram': return <ContainerDiagram title={title} eyebrow={eyebrow} />; case 'simulation': return <EvaporationSim title={title} eyebrow={eyebrow} />; case 'summary': return <MpembaSummary title={title} eyebrow={eyebrow} />; default: return <BlueprintTitle title={title} eyebrow={eyebrow} />; }
};