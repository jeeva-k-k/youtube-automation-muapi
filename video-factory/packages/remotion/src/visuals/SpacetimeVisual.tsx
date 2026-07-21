import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

const SpacetimeTitle: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const progress = spring({ frame, fps, config: { damping: 18 } });
  const opacity = Math.min(1, frame / 15);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2, cy = height / 2 + 80;
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)'; ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 50) { ctx.beginPath(); for (let y = 0; y < height; y += 4) { const dx = x - cx, dy = y - cy; const dist = Math.sqrt(dx*dx+dy*dy); const w = Math.max(0, 1 - dist/400) * 35 * Math.min(1, t/2); const wx = x + (dx/(dist+1))*w; if (y===0) ctx.moveTo(wx,y); else ctx.lineTo(wx,y); } ctx.stroke(); }
    for (let y = 0; y < height; y += 50) { ctx.beginPath(); for (let x = 0; x < width; x += 4) { const dx = x - cx, dy = y - cy; const dist = Math.sqrt(dx*dx+dy*dy); const w = Math.max(0, 1 - dist/400) * 35 * Math.min(1, t/2); const wy = y + (dy/(dist+1))*w; if (x===0) ctx.moveTo(x,wy); else ctx.lineTo(x,wy); } ctx.stroke(); }
    const grd = ctx.createRadialGradient(cx, cy, 5, cx, cy, 70); grd.addColorStop(0, 'rgba(6, 182, 212, 0.5)'); grd.addColorStop(1, 'transparent'); ctx.fillStyle = grd; ctx.fillRect(cx-70,cy-70,140,140);
  }, [frame, width, height, fps, t]);
  return (
    <AbsoluteFill style={{ background: '#050520' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, opacity, padding: '0 50px' }}>
        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#06b6d4', letterSpacing: '6px' }}>{eyebrow}</span>
        <h1 style={{ fontSize: '50px', fontWeight: 800, marginTop: '24px', color: '#e0f7fa', fontFamily: 'Georgia, serif', letterSpacing: (2 + progress * 8) + 'px', lineHeight: 1.3, textAlign: 'center' }}>{title}</h1>
      </div>
    </AbsoluteFill>
  );
};

const GravityWellDiagram: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: '#050520', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 50px' }}>
    <div style={{ width: '100%', border: '2px solid #06b6d4', borderRadius: '16px', background: 'rgba(5, 5, 32, 0.8)', padding: '28px', fontFamily: 'monospace' }}>
      <div style={{ color: '#06b6d4', fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px' }}>{eyebrow}</div>
      <div style={{ color: '#e0f7fa', fontSize: '28px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}><div style={{ color: '#67e8f9', fontSize: '13px' }}>MASS</div><div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>10 M☉</div></div>
        <div style={{ flex: 1 }}><div style={{ color: '#67e8f9', fontSize: '13px' }}>RADIUS</div><div style={{ color: '#f87171', fontSize: '18px', fontWeight: 'bold' }}>29.5 km</div></div>
      </div>
    </div>
    <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '24px' }}>
      <svg width="900" height="1100" viewBox="0 0 400 500" style={{ borderRadius: '16px', background: 'rgba(5,5,32,0.6)' }}>
        <defs><pattern id="sg" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(6,182,212,0.08)" strokeWidth="1" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#sg)" />
        {Array.from({ length: 8 }).map((_, i) => <ellipse key={i} cx="200" cy={150+i*25} rx={50+i*30} ry={(15+i*20)*0.3} fill="none" stroke="#06b6d4" strokeWidth={i===0?2:1} opacity={0.3+(i/8)*0.5} />)}
        <circle cx="200" cy="150" r="12" fill="#06b6d4" /><circle cx="200" cy="150" r="24" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="1" />
        <text x="200" y="135" fill="#06b6d4" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">MASSIVE BODY</text>
        <text x="340" y="160" fill="#fbbf24" fontSize="11" fontFamily="monospace" textAnchor="middle">t = 1.00s</text>
        <text x="310" y="250" fill="#fbbf24" fontSize="11" fontFamily="monospace" textAnchor="middle">t = 0.87s</text>
        <text x="260" y="340" fill="#f87171" fontSize="11" fontFamily="monospace" textAnchor="middle">t → 0</text>
      </svg>
    </div>
  </AbsoluteFill>
);

const TimeDilationSim: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
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
    [180, 280, 380].forEach((r, i) => { ctx.strokeStyle = 'rgba(6,182,212,' + (0.12 + i * 0.08) + ')'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = '#fbbf24'; ctx.font = '13px monospace'; ctx.fillText('t=' + (1-(3-i)*0.15).toFixed(2)+'s', cx+r+8, cy-5); });
    const grd = ctx.createRadialGradient(cx,cy,5,cx,cy,50); grd.addColorStop(0,'#06b6d4'); grd.addColorStop(0.5,'rgba(6,182,212,0.2)'); grd.addColorStop(1,'transparent'); ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(cx,cy,50,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#000'; ctx.beginPath(); ctx.arc(cx,cy,16,0,Math.PI*2); ctx.fill();
    const orbitR = 260 - t * 12; const angle = t * 2.5;
    if (orbitR > 30) { const px = cx+Math.cos(angle)*orbitR, py = cy+Math.sin(angle)*orbitR; ctx.fillStyle='#f87171'; ctx.beginPath(); ctx.arc(px,py,7,0,Math.PI*2); ctx.fill(); ctx.strokeStyle='rgba(248,113,113,0.3)'; ctx.lineWidth=2; ctx.beginPath(); for(let a=0;a<20;a++){const ta=t-a*0.05;const tr=260-ta*12;if(tr<30)break;const tpx=cx+Math.cos(ta*2.5)*tr;const tpy=cy+Math.sin(ta*2.5)*tr;if(a===0)ctx.moveTo(tpx,tpy);else ctx.lineTo(tpx,tpy);}ctx.stroke(); }
    ctx.strokeStyle='rgba(6,182,212,0.25)';ctx.lineWidth=3;ctx.strokeRect(40,40,width-80,height-80);
  }, [frame, width, height, fps, t]);
  return (
    <AbsoluteFill style={{ background: '#050520' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#06b6d4', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#e0f7fa', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

const RelativitySummary: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: '#050520', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 50px' }}>
    <div style={{ width: '100%', height: '340px', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '16px', background: 'radial-gradient(circle, #0a0a40 0%, #050520 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="180" height="180" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 12px #06b6d4)' }}><circle cx="50" cy="50" r="30" fill="none" stroke="#06b6d4" strokeWidth="2" /><circle cx="50" cy="50" r="10" fill="#06b6d4" /><circle cx="50" cy="50" r="42" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="1" strokeDasharray="3 3" /><text x="50" y="88" fill="#67e8f9" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">GRAVITATIONAL WELL</text></svg>
    </div>
    <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div><div style={{ color: '#06b6d4', fontSize: '22px', fontWeight: 'bold', letterSpacing: '4px', fontFamily: 'monospace' }}>{eyebrow}</div><div style={{ color: '#e0f7fa', fontSize: '40px', fontWeight: 800, marginTop: '10px', fontFamily: 'Georgia, serif' }}>{title}</div></div>
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid rgba(6,182,212,0.15)', paddingBottom: '20px' }}><span style={{ color: '#06b6d4', fontSize: '28px', fontWeight: 'bold', fontFamily: 'monospace' }}>01</span><div><h3 style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold' }}>GEOMETRIC GRAVITY</h3><p style={{ color: '#67e8f9', fontSize: '17px', marginTop: '6px', lineHeight: 1.4 }}>Mass curves spacetime; objects follow geodesics through warped geometry.</p></div></div>
      <div style={{ display: 'flex', gap: '16px' }}><span style={{ color: '#06b6d4', fontSize: '28px', fontWeight: 'bold', fontFamily: 'monospace' }}>02</span><div><h3 style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold' }}>TIME DILATION</h3><p style={{ color: '#67e8f9', fontSize: '17px', marginTop: '6px', lineHeight: 1.4 }}>Clocks slow in stronger gravitational fields, confirmed by GPS corrections.</p></div></div>
    </div>
  </AbsoluteFill>
);

export const SpacetimeVisual: React.FC<{ sceneId: string; title: string; eyebrow: string; theme: string }> = ({ sceneId, title, eyebrow }) => {
  switch (sceneId) { case 'intro': return <SpacetimeTitle title={title} eyebrow={eyebrow} />; case 'diagram': return <GravityWellDiagram title={title} eyebrow={eyebrow} />; case 'simulation': return <TimeDilationSim title={title} eyebrow={eyebrow} />; case 'summary': return <RelativitySummary title={title} eyebrow={eyebrow} />; default: return <SpacetimeTitle title={title} eyebrow={eyebrow} />; }
};