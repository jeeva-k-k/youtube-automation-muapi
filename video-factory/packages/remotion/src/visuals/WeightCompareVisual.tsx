import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

const WeightIntro: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const progress = spring({ frame, fps, config: { damping: 18 } });

  // Astronaut jumping physics: simple bounce height curve
  const jumpHeight = Math.max(0, Math.sin(t * 4) * 120);

  return (
    <AbsoluteFill style={{ background: '#090810', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {/* Platform floor */}
      <div style={{ position: 'absolute', bottom: '25%', width: '80%', height: '10px', background: '#38bdf8', borderRadius: '5px', boxShadow: '0 0 15px #38bdf8' }} />

      {/* Astronaut shape (60% scale subject) */}
      <svg width="200" height="280" viewBox="0 0 100 140" style={{ transform: `translateY(${-jumpHeight}px)`, transition: 'transform 0.05s linear' }}>
        {/* Suit */}
        <rect x="25" y="40" width="50" height="70" rx="15" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
        {/* Helmet visor */}
        <rect x="35" y="48" width="30" height="20" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
        <ellipse cx="50" cy="58" rx="8" ry="4" fill="rgba(56,189,248,0.5)" />
        {/* Boots */}
        <rect x="28" y="110" width="18" height="15" rx="4" fill="#475569" />
        <rect x="54" y="110" width="18" height="15" rx="4" fill="#475569" />
      </svg>

      {t < 1.5 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '0 50px', background: 'rgba(9,8,16,0.4)', backdropFilter: 'blur(4px)', opacity: 1 - t / 1.5 }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#38bdf8', letterSpacing: '8px', fontFamily: 'monospace' }}>{eyebrow}</span>
          <h1 style={{ fontSize: '48px', fontWeight: 800, marginTop: '20px', color: '#f8fafc', fontFamily: 'Georgia, serif', letterSpacing: (1 + progress * 6) + 'px', textAlign: 'center', lineHeight: 1.3 }}>{title}</h1>
        </div>
      )}
    </AbsoluteFill>
  );
};

const WeightClocks: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ background: '#090810', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 50px' }}>
      <div style={{ width: '100%', border: '2px solid #38bdf8', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.8)', padding: '28px', fontFamily: 'monospace' }}>
        <div style={{ color: '#38bdf8', fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '28px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>

      <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '30px', marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '14px' }}>
          <span style={{ color: '#94a3b8', fontSize: '18px', fontFamily: 'monospace' }}>EARTH MASS</span>
          <span style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold' }}>70 kg (1.00 G)</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '14px' }}>
          <span style={{ color: '#fb923c', fontSize: '18px', fontFamily: 'monospace' }}>MARS WEIGHT</span>
          <span style={{ color: '#fb923c', fontSize: '22px', fontWeight: 'bold' }}>26 kg (0.38 G)</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '14px' }}>
          <span style={{ color: '#ef4444', fontSize: '18px', fontFamily: 'monospace' }}>JUPITER WEIGHT</span>
          <span style={{ color: '#ef4444', fontSize: '22px', fontWeight: 'bold' }}>{Math.min(175, Math.floor(70 + t * 35))} kg (2.50 G)</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const GravitySandbox: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  // Split-screen gravity bounce simulation
  // Left: Mars (slow high jump), Right: Jupiter (heavy flat jump)
  const marsY = Math.max(0, Math.sin(t * 2) * 200); // Higher, slower
  const jupY = Math.max(0, Math.sin(t * 8) * 30); // Very low, rapid bounce

  return (
    <AbsoluteFill style={{ background: '#090810', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 50px' }}>
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#38bdf8', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>

      <div style={{ flex: 1, width: '100%', display: 'flex', gap: '20px', marginTop: '80px' }}>
        {/* Mars Sandbox */}
        <div style={{ flex: 1, border: '1px solid #fb923c', borderRadius: '12px', background: 'rgba(251,146,60,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '40px', position: 'relative' }}>
          <span style={{ position: 'absolute', top: '15px', color: '#fb923c', fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bold' }}>MARS (0.38G)</span>
          <svg width="80" height="120" viewBox="0 0 100 140" style={{ transform: `translateY(${-marsY}px)` }}>
            <rect x="25" y="40" width="50" height="70" rx="15" fill="#f8fafc" stroke="#fb923c" strokeWidth="2" />
            <rect x="35" y="48" width="30" height="20" rx="6" fill="#0f172a" />
          </svg>
          <div style={{ width: '80%', height: '4px', background: '#fb923c', marginTop: '10px' }} />
        </div>

        {/* Jupiter Sandbox */}
        <div style={{ flex: 1, border: '1px solid #ef4444', borderRadius: '12px', background: 'rgba(239,68,68,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '40px', position: 'relative' }}>
          <span style={{ position: 'absolute', top: '15px', color: '#ef4444', fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bold' }}>JUPITER (2.50G)</span>
          <svg width="80" height="120" viewBox="0 0 100 140" style={{ transform: `translateY(${-jupY}px)` }}>
            <rect x="25" y="40" width="50" height="70" rx="15" fill="#f8fafc" stroke="#ef4444" strokeWidth="2" />
            <rect x="35" y="48" width="30" height="20" rx="6" fill="#0f172a" />
          </svg>
          <div style={{ width: '80%', height: '4px', background: '#ef4444', marginTop: '10px' }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const WeightConclusion: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: '#090810', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 50px', justifyContent: 'center' }}>
    <svg width="120" height="120" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 12px #38bdf8)' }}>
      <circle cx="50" cy="45" r="30" fill="none" stroke="#38bdf8" strokeWidth="3" />
      <line x1="50" y1="45" x2="68" y2="28" stroke="#38bdf8" strokeWidth="4" />
      <rect x="20" y="80" width="60" height="8" rx="2" fill="#475569" />
    </svg>
    
    <div style={{ width: '100%', marginTop: '30px', textAlign: 'center' }}>
      <span style={{ color: '#38bdf8', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
      <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
    </div>

    <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #fb923c', padding: '20px', borderRadius: '0 8px 8px 0' }}>
        <div style={{ color: '#fb923c', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>MARS WEIGHT</div>
        <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>38% of Earth Weight (Light)</div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #ef4444', padding: '20px', borderRadius: '0 8px 8px 0' }}>
        <div style={{ color: '#ef4444', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>JUPITER WEIGHT</div>
        <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>250% of Earth Weight (Heavy)</div>
      </div>
    </div>
  </AbsoluteFill>
);

export const WeightCompareVisual: React.FC<{ sceneId: string; title: string; eyebrow: string; theme: string }> = ({ sceneId, title, eyebrow }) => {
  switch (sceneId) {
    case 'intro': return <WeightIntro title={title} eyebrow={eyebrow} />;
    case 'diagram': return <WeightClocks title={title} eyebrow={eyebrow} />;
    case 'simulation': return <GravitySandbox title={title} eyebrow={eyebrow} />;
    case 'summary': return <WeightConclusion title={title} eyebrow={eyebrow} />;
    default: return <WeightIntro title={title} eyebrow={eyebrow} />;
  }
};
