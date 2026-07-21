import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

const HelixTitle: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, config: { damping: 18 } });
  const opacity = Math.min(1, frame / 15);
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(135deg, #1a0533 0%, #2d1054 40%, #4a1a7a 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '15%', right: '10%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div style={{ zIndex: 10, textAlign: 'center', opacity, padding: '40px 50px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', margin: '0 40px' }}>
        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#ec4899', letterSpacing: '6px' }}>{eyebrow}</span>
        <h1 style={{ fontSize: '48px', fontWeight: 800, marginTop: '18px', color: '#f5f3ff', fontFamily: 'Georgia, serif', letterSpacing: (1 + progress * 5) + 'px', lineHeight: '1.3' }}>{title}</h1>
      </div>
    </AbsoluteFill>
  );
};

const BasePairDiagram: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ background: '#1a0533', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 50px' }}>
      <div style={{ width: '100%', border: '2px solid #a855f7', borderRadius: '16px', background: 'rgba(45, 16, 84, 0.7)', padding: '28px', fontFamily: 'monospace' }}>
        <div style={{ color: '#ec4899', fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px' }}>{eyebrow}</div>
        <div style={{ color: '#f5f3ff', fontSize: '28px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}><div style={{ color: '#c4b5fd', fontSize: '13px' }}>A–T</div><div style={{ color: '#ffffff', fontSize: '18px', fontWeight: 'bold' }}>2 H-Bonds</div></div>
          <div style={{ flex: 1 }}><div style={{ color: '#c4b5fd', fontSize: '13px' }}>G–C</div><div style={{ color: '#22c55e', fontSize: '18px', fontWeight: 'bold' }}>3 H-Bonds</div></div>
        </div>
      </div>
      <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '24px' }}>
        <svg width="900" height="1100" viewBox="0 0 400 520" style={{ borderRadius: '16px', background: 'rgba(26, 5, 51, 0.8)' }}>
          <rect x="60" y="40" width="110" height="70" rx="12" fill="#a855f7" opacity="0.8" /><text x="115" y="82" fill="#fff" fontSize="26" fontWeight="bold" textAnchor="middle">A</text>
          <rect x="230" y="40" width="110" height="70" rx="12" fill="#ec4899" opacity="0.8" /><text x="285" y="82" fill="#fff" fontSize="26" fontWeight="bold" textAnchor="middle">T</text>
          <line x1="170" y1="60" x2="230" y2="60" stroke="#fbbf24" strokeWidth="2" strokeDasharray="8 6" opacity={0.5 + Math.sin(t * 4) * 0.3} />
          <line x1="170" y1="85" x2="230" y2="85" stroke="#fbbf24" strokeWidth="2" strokeDasharray="8 6" opacity={0.5 + Math.sin(t * 4 + 1) * 0.3} />
          <text x="200" y="35" fill="#fbbf24" fontSize="12" fontFamily="monospace" textAnchor="middle">2 H-BONDS</text>
          <text x="115" y="28" fill="#c4b5fd" fontSize="12" fontFamily="monospace" textAnchor="middle">ADENINE</text>
          <text x="285" y="28" fill="#f9a8d4" fontSize="12" fontFamily="monospace" textAnchor="middle">THYMINE</text>
          <rect x="60" y="200" width="110" height="70" rx="12" fill="#22c55e" opacity="0.8" /><text x="115" y="242" fill="#fff" fontSize="26" fontWeight="bold" textAnchor="middle">G</text>
          <rect x="230" y="200" width="110" height="70" rx="12" fill="#06b6d4" opacity="0.8" /><text x="285" y="242" fill="#fff" fontSize="26" fontWeight="bold" textAnchor="middle">C</text>
          <line x1="170" y1="215" x2="230" y2="215" stroke="#fbbf24" strokeWidth="2" strokeDasharray="8 6" opacity={0.5 + Math.sin(t * 4) * 0.3} />
          <line x1="170" y1="235" x2="230" y2="235" stroke="#fbbf24" strokeWidth="2" strokeDasharray="8 6" opacity={0.5 + Math.sin(t * 4 + 1) * 0.3} />
          <line x1="170" y1="255" x2="230" y2="255" stroke="#fbbf24" strokeWidth="2" strokeDasharray="8 6" opacity={0.5 + Math.sin(t * 4 + 2) * 0.3} />
          <text x="200" y="195" fill="#fbbf24" fontSize="12" fontFamily="monospace" textAnchor="middle">3 H-BONDS</text>
          <text x="115" y="188" fill="#86efac" fontSize="12" fontFamily="monospace" textAnchor="middle">GUANINE</text>
          <text x="285" y="188" fill="#67e8f9" fontSize="12" fontFamily="monospace" textAnchor="middle">CYTOSINE</text>
          {/* Helix preview */}
          {Array.from({ length: 16 }).map((_, i) => {
            const y = 340 + i * 10;
            const lx = 160 + Math.sin(i * 0.7 + t * 0.8) * 40;
            const rx = 240 - Math.sin(i * 0.7 + t * 0.8) * 40;
            return <React.Fragment key={i}><circle cx={lx} cy={y} r="3" fill="#a855f7" opacity="0.6" /><circle cx={rx} cy={y} r="3" fill="#ec4899" opacity="0.6" /><line x1={lx} y1={y} x2={rx} y2={y} stroke="rgba(251,191,36,0.3)" strokeWidth="1" /></React.Fragment>;
          })}
        </svg>
      </div>
    </AbsoluteFill>
  );
};

const BindingSim: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
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
    const bindTime = 3.0;
    const pairs = [{ l: 'A', lc: '#a855f7', r: 'T', rc: '#ec4899', y: cy - 180, bonds: 2 }, { l: 'G', lc: '#22c55e', r: 'C', rc: '#06b6d4', y: cy + 180, bonds: 3 }];
    pairs.forEach(p => {
      const offset = t < bindTime ? (1 - t / bindTime) * 300 : 0;
      const lx = cx - 60 - offset, rx = cx + 60 + offset;
      ctx.fillStyle = p.lc; ctx.beginPath(); ctx.roundRect(lx - 40, p.y - 28, 80, 56, 12); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 28px Georgia'; ctx.textAlign = 'center'; ctx.fillText(p.l, lx, p.y + 10);
      ctx.fillStyle = p.rc; ctx.beginPath(); ctx.roundRect(rx - 40, p.y - 28, 80, 56, 12); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.fillText(p.r, rx, p.y + 10);
      if (t >= bindTime) {
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
        for (let b = 0; b < p.bonds; b++) { const by = p.y - 12 + b * 12; ctx.beginPath(); ctx.moveTo(lx + 40, by); ctx.lineTo(rx - 40, by); ctx.stroke(); }
        ctx.setLineDash([]);
        if (t - bindTime < 0.4) { ctx.fillStyle = 'rgba(251,191,36,' + (1 - (t - bindTime) / 0.4) * 0.3 + ')'; ctx.beginPath(); ctx.arc(cx, p.y, 80, 0, Math.PI * 2); ctx.fill(); }
      }
    });
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)'; ctx.lineWidth = 3; ctx.strokeRect(40, 40, width - 80, height - 80);
  }, [frame, width, height, fps, t]);
  return (
    <AbsoluteFill style={{ background: '#1a0533' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#ec4899', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f5f3ff', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

const DnaSummary: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: '#1a0533', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 50px' }}>
    <div style={{ width: '100%', height: '340px', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '16px', background: 'radial-gradient(circle, #2d1054 0%, #1a0533 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="180" height="240" viewBox="0 0 100 130" style={{ filter: 'drop-shadow(0 0 12px #a855f7)' }}>
        {Array.from({ length: 12 }).map((_, i) => { const y = 10 + i * 10; const lx = 30 + Math.sin(i * 0.8) * 15; const rx = 70 - Math.sin(i * 0.8) * 15;
          return <React.Fragment key={i}><circle cx={lx} cy={y} r="4" fill="#a855f7" /><circle cx={rx} cy={y} r="4" fill="#ec4899" /><line x1={lx} y1={y} x2={rx} y2={y} stroke="rgba(251,191,36,0.5)" strokeWidth="1" strokeDasharray="3 2" /></React.Fragment>; })}
        <text x="50" y="126" fill="#c4b5fd" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">DNA DOUBLE HELIX</text>
      </svg>
    </div>
    <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div><div style={{ color: '#ec4899', fontSize: '22px', fontWeight: 'bold', letterSpacing: '4px', fontFamily: 'monospace' }}>{eyebrow}</div>
        <div style={{ color: '#f5f3ff', fontSize: '40px', fontWeight: 800, marginTop: '10px', fontFamily: 'Georgia, serif' }}>{title}</div></div>
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid rgba(168, 85, 247, 0.15)', paddingBottom: '20px' }}>
        <span style={{ color: '#a855f7', fontSize: '28px', fontWeight: 'bold', fontFamily: 'monospace' }}>01</span>
        <div><h3 style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold' }}>COMPLEMENTARY PAIRING</h3><p style={{ color: '#c4b5fd', fontSize: '17px', marginTop: '6px', lineHeight: 1.4 }}>A pairs with T; G pairs with C via hydrogen bonds.</p></div>
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <span style={{ color: '#a855f7', fontSize: '28px', fontWeight: 'bold', fontFamily: 'monospace' }}>02</span>
        <div><h3 style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold' }}>REPLICATION STABILITY</h3><p style={{ color: '#c4b5fd', fontSize: '17px', marginTop: '6px', lineHeight: 1.4 }}>Bonds stabilize the helix but enzymes can unzip them for replication.</p></div>
      </div>
    </div>
  </AbsoluteFill>
);

export const DnaVisual: React.FC<{ sceneId: string; title: string; eyebrow: string; theme: string }> = ({ sceneId, title, eyebrow }) => {
  switch (sceneId) {
    case 'intro': return <HelixTitle title={title} eyebrow={eyebrow} />;
    case 'diagram': return <BasePairDiagram title={title} eyebrow={eyebrow} />;
    case 'simulation': return <BindingSim title={title} eyebrow={eyebrow} />;
    case 'summary': return <DnaSummary title={title} eyebrow={eyebrow} />;
    default: return <HelixTitle title={title} eyebrow={eyebrow} />;
  }
};