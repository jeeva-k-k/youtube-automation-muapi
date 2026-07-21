import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

const VenusIntro: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const progress = spring({ frame, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ background: '#0a0503', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {/* Space stars background */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} style={{ position: 'absolute', left: `${(Math.sin(i * 12.3) * 0.5 + 0.5) * 100}%`, top: `${(Math.cos(i * 7.7) * 0.5 + 0.5) * 100}%`, width: i % 2 === 0 ? 3 : 2, height: i % 2 === 0 ? 3 : 2, backgroundColor: '#fff', opacity: 0.3 + Math.sin(t * 3 + i) * 0.2 }} />
      ))}
      
      {/* Sun glow on left */}
      <div style={{ position: 'absolute', left: '-200px', top: '25%', width: '400px', height: '800px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,179,8,0.15) 0%, transparent 70%)', filter: 'blur(50px)' }} />

      {/* Large Venus Globe (60% of frame) */}
      <div style={{ position: 'relative', width: '650px', height: '650px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #eab308 0%, #ca8a04 40%, #854d0e 70%, #1e1b18 100%)', boxShadow: '0 0 80px rgba(234, 179, 8, 0.2)', transform: 'scale(1)' }}>
        {/* Retrograde slow rotation lines overlay */}
        <svg width="650" height="650" style={{ transform: `rotate(${-t * 0.5}deg)`, opacity: 0.25 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <ellipse key={i} cx="325" cy="325" rx={80 + i * 30} ry={40 + i * 15} fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="5 15" />
          ))}
        </svg>
      </div>

      {t < 1.5 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '0 50px', background: 'rgba(10,5,3,0.4)', backdropFilter: 'blur(4px)', opacity: 1 - t / 1.5 }}>
          <span style={{ fontSize: '26px', fontWeight: 'bold', color: '#eab308', letterSpacing: '8px', fontFamily: 'monospace' }}>{eyebrow}</span>
          <h1 style={{ fontSize: '48px', fontWeight: 800, marginTop: '20px', color: '#f8fafc', fontFamily: 'Georgia, serif', letterSpacing: (1 + progress * 6) + 'px', textAlign: 'center', lineHeight: 1.3 }}>{title}</h1>
        </div>
      )}
    </AbsoluteFill>
  );
};

const VenusTimeline: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ background: '#0a0503', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 50px' }}>
      <div style={{ width: '100%', border: '2px solid #eab308', borderRadius: '16px', background: 'rgba(30, 27, 24, 0.8)', padding: '28px', fontFamily: 'monospace' }}>
        <div style={{ color: '#eab308', fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '28px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>

      {/* Orbit vs Rotation comparison UI */}
      <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '50px', marginTop: '20px' }}>
        {/* Orbit timeline */}
        <div style={{ border: '1px solid rgba(234,179,8,0.3)', borderRadius: '12px', padding: '24px', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#eab308', fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bold' }}>
            <span>VENUS YEAR (ORBIT)</span>
            <span>{Math.min(225, Math.floor(t * 75))} Earth Days</span>
          </div>
          <div style={{ height: '16px', background: '#1e1b18', borderRadius: '8px', marginTop: '14px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, (t / 3) * 100)}%`, height: '100%', background: '#22c55e' }} />
          </div>
        </div>

        {/* Rotation timeline */}
        <div style={{ border: '1px solid rgba(234,179,8,0.3)', borderRadius: '12px', padding: '24px', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#eab308', fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bold' }}>
            <span>VENUS DAY (ROTATION)</span>
            <span>{Math.min(243, Math.floor(t * 12))} Earth Days</span>
          </div>
          <div style={{ height: '16px', background: '#1e1b18', borderRadius: '8px', marginTop: '14px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, (t / 3) * 15)}%`, height: '100%', background: '#ef4444' }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const VenusSunRise: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ background: '#0a0503', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 50px' }}>
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#eab308', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>

      {/* Surface Sun Path simulation (rises in West, sets in East) */}
      <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginTop: '100px' }}>
        {/* Horizon */}
        <div style={{ position: 'absolute', bottom: '15%', width: '100%', height: '150px', background: 'linear-gradient(0deg, #272522 0%, #171614 100%)', borderTop: '2px solid #eab308' }} />
        
        {/* West Label */}
        <div style={{ position: 'absolute', left: '10%', bottom: '20%', color: '#eab308', fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace' }}>WEST</div>
        {/* East Label */}
        <div style={{ position: 'absolute', right: '10%', bottom: '20%', color: '#eab308', fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace' }}>EAST</div>

        {/* Rising Sun */}
        <div style={{
          position: 'absolute',
          left: `${15 + t * 20}%`,
          bottom: `${20 + Math.sin(t * 0.8) * 35}%`,
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: '#fef08a',
          boxShadow: '0 0 40px #eab308',
        }} />
        
        {/* Heat haze effect */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(234,179,8,0.06) 0%, transparent 60%)' }} />
      </div>
    </AbsoluteFill>
  );
};

const VenusConclusion: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#0a0503', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 50px', justifyContent: 'center' }}>
      {/* Small rotating globe in header */}
      <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #eab308 0%, #854d0e 70%, #1e1b18 100%)', boxShadow: '0 0 30px rgba(234,179,8,0.15)' }} />
      
      <div style={{ width: '100%', marginTop: '30px', textAlign: 'center' }}>
        <span style={{ color: '#eab308', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
        <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
      </div>

      <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #eab308', padding: '20px', borderRadius: '0 8px 8px 0' }}>
          <div style={{ color: '#eab308', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>DAY DURATON</div>
          <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>243 Earth Days</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #22c55e', padding: '20px', borderRadius: '0 8px 8px 0' }}>
          <div style={{ color: '#22c55e', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>YEAR DURATION</div>
          <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>225 Earth Days</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const VenusDayVisual: React.FC<{ sceneId: string; title: string; eyebrow: string; theme: string }> = ({ sceneId, title, eyebrow }) => {
  switch (sceneId) {
    case 'intro': return <VenusIntro title={title} eyebrow={eyebrow} />;
    case 'diagram': return <VenusTimeline title={title} eyebrow={eyebrow} />;
    case 'simulation': return <VenusSunRise title={title} eyebrow={eyebrow} />;
    case 'summary': return <VenusConclusion title={title} eyebrow={eyebrow} />;
    default: return <VenusIntro title={title} eyebrow={eyebrow} />;
  }
};
