import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const BootesVoidRemotionBestPractices: React.FC<{
  title: string;
  eyebrow: string;
  sceneId: string;
}> = ({ title, eyebrow, sceneId }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Spring animations following Remotion best practices
  const badgeSpring = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14 } });
  const scaleSpring = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 15 } });

  // Interpolation curves for continuous motion
  const pulseOpacity = interpolate(frame % 45, [0, 22, 45], [0.3, 0.7, 0.3], { extrapolateRight: 'clamp' });
  const rotation = interpolate(frame, [0, 420], [0, 360]);

  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at center, #0f0728 0%, #03010a 100%)', overflow: 'hidden' }}>
      {/* Background Cosmic Grid & Glowing Nebula Particle Ring */}
      <svg width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id="nebulaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#7800ff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Rotating Cosmic Void Ring */}
        <g transform={`translate(${width / 2}, ${height / 2 + 60}) rotate(${rotation})`}>
          <circle cx="0" cy="0" r="320" fill="url(#nebulaGlow)" />
          <circle cx="0" cy="0" r="240" fill="#000000" stroke="#00f0ff" strokeWidth="2" strokeDasharray="12 8" opacity={pulseOpacity} />
          
          {/* Outer Galaxies */}
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            const r = 260 + (i % 3) * 15;
            return (
              <circle
                key={i}
                cx={Math.cos(a) * r}
                cy={Math.sin(a) * r}
                r={4 + (i % 3)}
                fill={i % 2 === 0 ? '#00f0ff' : '#ff00aa'}
                filter="drop-shadow(0 0 8px #00f0ff)"
              />
            );
          })}
        </g>
      </svg>

      {/* Top Eyebrow Badge (Spring Entry) */}
      <div style={{ position: 'absolute', top: '160px', left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${badgeSpring})` }}>
        <div style={{ background: 'rgba(0, 240, 255, 0.15)', border: '1px solid rgba(0, 240, 255, 0.5)', borderRadius: '30px', padding: '10px 28px', color: '#00F0FF', fontSize: '22px', fontWeight: 800, letterSpacing: '6px', textTransform: 'uppercase', backdropFilter: 'blur(12px)', boxShadow: '0 0 24px rgba(0, 240, 255, 0.3)' }}>
          {eyebrow || 'REMOTION BEST PRACTICES'}
        </div>
      </div>

      {/* Main Title Banner (Spring Entry) */}
      <div style={{ position: 'absolute', top: '240px', left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 40px', transform: `scale(${titleSpring})` }}>
        <h1 style={{ fontSize: '60px', fontWeight: 900, color: '#FFFFFF', textShadow: '0 0 35px rgba(0,240,255,0.9), 0 0 60px rgba(120,0,255,0.7)', textAlign: 'center', margin: 0, lineHeight: 1.15 }}>
          {title || 'THE BOÖTES VOID'}
        </h1>
        <div style={{ marginTop: '14px', color: '#FFD700', fontSize: '26px', fontWeight: 700, letterSpacing: '3px' }}>
          330 MILLION LIGHT-YEARS OF NOTHING
        </div>
      </div>

      {/* Scene Content Card */}
      {sceneId === 'scene_2' && (
        <div style={{ position: 'absolute', top: '780px', left: '50px', right: '50px', background: 'rgba(10, 10, 35, 0.85)', borderRadius: '24px', border: '2px solid rgba(0, 240, 255, 0.4)', padding: '40px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${scaleSpring})`, boxShadow: '0 0 40px rgba(0,240,255,0.25)', backdropFilter: 'blur(16px)' }}>
          <div style={{ fontSize: '72px', fontWeight: 900, color: '#00F0FF', textShadow: '0 0 30px #00F0FF', fontFamily: 'monospace' }}>
            330,000,000
          </div>
          <div style={{ color: '#A0A5C0', fontSize: '22px', fontWeight: 700, letterSpacing: '3px', marginTop: '8px' }}>
            LIGHT-YEARS DIAMETER
          </div>
          <div style={{ color: '#FF00AA', fontSize: '24px', fontWeight: 800, marginTop: '20px', textAlign: 'center' }}>
            HOLDS 2,000 MILKY WAY GALAXIES!
          </div>
        </div>
      )}

      {sceneId === 'scene_3' && (
        <div style={{ position: 'absolute', top: '760px', left: '50px', right: '50px', display: 'flex', flexDirection: 'column', gap: '20px', transform: `scale(${scaleSpring})` }}>
          <div style={{ background: 'rgba(0, 255, 136, 0.1)', borderRadius: '20px', border: '1px solid rgba(0, 255, 136, 0.4)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#A0A5C0', fontSize: '16px', fontWeight: 700 }}>NORMAL SPACE REGION</div>
              <div style={{ color: '#00FF88', fontSize: '38px', fontWeight: 900 }}>2,000+ GALAXIES</div>
            </div>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#00FF88', filter: 'drop-shadow(0 0 15px #00FF88)' }} />
          </div>

          <div style={{ background: 'rgba(255, 51, 102, 0.12)', borderRadius: '20px', border: '2px solid rgba(255, 51, 102, 0.6)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#A0A5C0', fontSize: '16px', fontWeight: 700 }}>BOÖTES VOID REALITY</div>
              <div style={{ color: '#FF3366', fontSize: '42px', fontWeight: 900 }}>ONLY 60 GALAXIES!</div>
            </div>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#020108', border: '2px solid #FF3366', boxShadow: '0 0 15px #FF3366' }} />
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
