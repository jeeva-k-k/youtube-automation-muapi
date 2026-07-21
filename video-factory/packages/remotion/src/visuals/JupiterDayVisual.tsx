import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

const JupiterIntro: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const progress = spring({ frame, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ background: '#080503', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {/* Starfield */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} style={{ position: 'absolute', left: `${(Math.sin(i * 12.3) * 0.5 + 0.5) * 100}%`, top: `${(Math.cos(i * 7.7) * 0.5 + 0.5) * 100}%`, width: 2, height: 2, backgroundColor: '#fff', opacity: 0.2 + Math.sin(t * 4 + i) * 0.2 }} />
      ))}

      {/* Large Fast-Spinning Jupiter (65% size) */}
      {/* Oblate spheroid scale: stretched horizontally (1.07), squashed vertically (0.93) */}
      <div style={{
        position: 'relative',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #ffedd5 0%, #ea580c 45%, #7c2d12 75%, #0f172a 100%)',
        boxShadow: '0 0 60px rgba(234, 88, 12, 0.25)',
        transform: `scaleX(1.07) scaleY(0.93) rotate(${t * 60}deg)`, // Spins fast
      }}>
        {/* Great Red Spot and bands visual overlay */}
        <div style={{ position: 'absolute', left: '20%', top: '55%', width: '60px', height: '40px', borderRadius: '50%', background: '#b91c1c', opacity: 0.8, filter: 'blur(2px)' }} />
        {/* Horizontal bands */}
        <div style={{ position: 'absolute', left: '5%', right: '5%', top: '35%', height: '30px', background: 'rgba(124, 45, 18, 0.4)', borderRadius: '15px' }} />
        <div style={{ position: 'absolute', left: '2%', right: '2%', top: '48%', height: '40px', background: 'rgba(254, 215, 170, 0.25)', borderRadius: '20px' }} />
      </div>

      {t < 1.5 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '0 50px', background: 'rgba(8,5,3,0.4)', backdropFilter: 'blur(4px)', opacity: 1 - t / 1.5 }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#ea580c', letterSpacing: '8px', fontFamily: 'monospace' }}>{eyebrow}</span>
          <h1 style={{ fontSize: '48px', fontWeight: 800, marginTop: '20px', color: '#f8fafc', fontFamily: 'Georgia, serif', letterSpacing: (1 + progress * 6) + 'px', textAlign: 'center', lineHeight: 1.3 }}>{title}</h1>
        </div>
      )}
    </AbsoluteFill>
  );
};

const JupiterClocks: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ background: '#080503', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 50px' }}>
      <div style={{ width: '100%', border: '2px solid #ea580c', borderRadius: '16px', background: 'rgba(45, 27, 18, 0.8)', padding: '28px', fontFamily: 'monospace' }}>
        <div style={{ color: '#ea580c', fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '28px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>

      {/* Side-by-side clock comparison */}
      <div style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
        {/* Earth Clock */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ color: '#38bdf8', fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace' }}>EARTH DAY</span>
          <svg width="150" height="150" viewBox="0 0 100 100" style={{ marginTop: '16px' }}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="#38bdf8" strokeWidth="3" />
            <line x1="50" y1="50" x2="50" y2="20" stroke="#38bdf8" strokeWidth="4" transform={`rotate(${t * 30}, 50, 50)`} />
          </svg>
          <span style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold', marginTop: '12px', fontFamily: 'monospace' }}>24 Hours</span>
        </div>

        {/* Jupiter Clock */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ color: '#ea580c', fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace' }}>JUPITER DAY</span>
          <svg width="150" height="150" viewBox="0 0 100 100" style={{ marginTop: '16px' }}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="#ea580c" strokeWidth="3" />
            <line x1="50" y1="50" x2="50" y2="15" stroke="#ea580c" strokeWidth="4" transform={`rotate(${t * 180}, 50, 50)`} />
          </svg>
          <span style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold', marginTop: '12px', fontFamily: 'monospace' }}>9.9 Hours</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const JupiterBulge: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ background: '#080503', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 50px' }}>
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#ea580c', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>

      {/* Bulging distortion visual with force arrows */}
      <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginTop: '80px' }}>
        {/* Stretched globe */}
        <div style={{
          width: '400px',
          height: '340px', // squashed
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #ffedd5, #ea580c, #7c2d12)',
          boxShadow: '0 0 40px rgba(234,88,12,0.2)'
        }} />
        
        {/* Outward centrifugal force arrows */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <marker id="arr" markerWidth="10" markerHeight="8" refX="10" refY="4" orient="auto">
              <polygon points="0 0, 10 4, 0 8" fill="#ea580c" />
            </marker>
          </defs>
          {/* Left Arrow */}
          <line x1="280" y1="250" x2={`${190 - Math.sin(t * 10) * 15}`} y2="250" stroke="#ea580c" strokeWidth="4" markerEnd="url(#arr)" />
          {/* Right Arrow */}
          <line x1="800" y1="250" x2={`${890 + Math.sin(t * 10) * 15}`} y2="250" stroke="#ea580c" strokeWidth="4" markerEnd="url(#arr)" />
          
          <text x="540" y="440" fill="#ea580c" fontSize="24" fontWeight="bold" fontFamily="monospace" textAnchor="middle">EQUATORIAL BULGE</text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

const JupiterConclusion: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: '#080503', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 50px', justifyContent: 'center' }}>
    <div style={{ width: '150px', height: '140px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #ffedd5 0%, #ea580c 70%, #0f172a 100%)', boxShadow: '0 0 30px rgba(234,88,12,0.15)', transform: 'scaleX(1.06) scaleY(0.94)' }} />
    
    <div style={{ width: '100%', marginTop: '30px', textAlign: 'center' }}>
      <span style={{ color: '#ea580c', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
      <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
    </div>

    <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #ea580c', padding: '20px', borderRadius: '0 8px 8px 0' }}>
        <div style={{ color: '#ea580c', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>JUPITER DAY</div>
        <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>9.9 Hours</div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #38bdf8', padding: '20px', borderRadius: '0 8px 8px 0' }}>
        <div style={{ color: '#38bdf8', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>EQUATORIAL BULGE</div>
        <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Stretched Oblique Spheroid</div>
      </div>
    </div>
  </AbsoluteFill>
);

export const JupiterDayVisual: React.FC<{ sceneId: string; title: string; eyebrow: string; theme: string }> = ({ sceneId, title, eyebrow }) => {
  switch (sceneId) {
    case 'intro': return <JupiterIntro title={title} eyebrow={eyebrow} />;
    case 'diagram': return <JupiterClocks title={title} eyebrow={eyebrow} />;
    case 'simulation': return <JupiterBulge title={title} eyebrow={eyebrow} />;
    case 'summary': return <JupiterConclusion title={title} eyebrow={eyebrow} />;
    default: return <JupiterIntro title={title} eyebrow={eyebrow} />;
  }
};
