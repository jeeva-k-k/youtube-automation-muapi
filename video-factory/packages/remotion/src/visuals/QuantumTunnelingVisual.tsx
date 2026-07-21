import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const QuantumTunnelingVisual: React.FC<{
  sceneId: string;
  title: string;
  eyebrow: string;
}> = ({ sceneId, title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Remotion spring physics animations
  const badgeSpring = spring({ frame, fps, config: { damping: 12 } });
  const titleSpring = spring({ frame: Math.max(0, frame - 4), fps, config: { damping: 14 } });
  const cardSpring = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 15 } });

  // Interpolation curves
  const wavePhase = interpolate(frame, [0, 300], [0, Math.PI * 12]);
  const glowPulse = interpolate(frame % 30, [0, 15, 30], [0.4, 0.9, 0.4], { extrapolateRight: 'clamp' });
  const particleX = interpolate(frame % 90, [0, 45, 90], [180, 540, 900]);

  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at center, #0a041c 0%, #020108 100%)', overflow: 'hidden' }}>
      {/* Background SVG Quantum Wavefield & Barrier Simulation */}
      <svg width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="barrierGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff0077" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ff5500" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ff0077" stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id="particleGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00ffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#0088ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Quantum Barrier Wall in Center */}
        <rect x="510" y="580" width="60" height="500" rx="12" fill="url(#barrierGrad)" filter="drop-shadow(0 0 20px #ff0077)" opacity={glowPulse} />
        <text x="540" y="550" fill="#ff0077" fontSize="20" fontFamily="monospace" fontWeight="bold" textAnchor="middle">POTENTIAL BARRIER</text>

        {/* Dynamic Sine Wave Function */}
        <path
          d={Array.from({ length: 180 }).map((_, i) => {
            const x = 120 + i * 4.6;
            let amp = 80;
            if (x > 510 && x < 570) amp = 25; // Exponential decay inside barrier
            if (x >= 570) amp = 35; // Transmitted wave
            const y = 830 + Math.sin((i * 0.1) - wavePhase) * amp;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ')}
          fill="none"
          stroke="#00ffff"
          strokeWidth="4"
          filter="drop-shadow(0 0 10px #00ffff)"
        />

        {/* Traveling Subatomic Particle */}
        <circle cx={particleX} cy={830 + Math.sin(particleX * 0.05 - wavePhase) * 40} r="18" fill="url(#particleGlow)" />
        <circle cx={particleX} cy={830 + Math.sin(particleX * 0.05 - wavePhase) * 40} r="6" fill="#ffffff" />
      </svg>

      {/* Top Eyebrow Badge */}
      <div style={{ position: 'absolute', top: '160px', left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${badgeSpring})` }}>
        <div style={{ background: 'rgba(0, 255, 255, 0.12)', border: '1px solid rgba(0, 255, 255, 0.5)', borderRadius: '30px', padding: '10px 28px', color: '#00FFFF', fontSize: '22px', fontWeight: 800, letterSpacing: '6px', textTransform: 'uppercase', backdropFilter: 'blur(12px)', boxShadow: '0 0 24px rgba(0, 255, 255, 0.3)' }}>
          {eyebrow || 'QUANTUM PHYSICS'}
        </div>
      </div>

      {/* Main Title Banner */}
      <div style={{ position: 'absolute', top: '240px', left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 40px', transform: `scale(${titleSpring})` }}>
        <h1 style={{ fontSize: '58px', fontWeight: 900, color: '#FFFFFF', textShadow: '0 0 35px rgba(0,255,255,0.9), 0 0 60px rgba(255,0,119,0.7)', textAlign: 'center', margin: 0, lineHeight: 1.15 }}>
          {title || 'QUANTUM TUNNELING'}
        </h1>
        <div style={{ marginTop: '14px', color: '#FFD700', fontSize: '26px', fontWeight: 700, letterSpacing: '3px' }}>
          PASSING THROUGH SOLID BARRIERS
        </div>
      </div>

      {/* Dynamic Scene Cards */}
      {sceneId === 'scene_2' && (
        <div style={{ position: 'absolute', top: '1160px', left: '50px', right: '50px', background: 'rgba(10, 15, 35, 0.9)', borderRadius: '24px', border: '2px solid rgba(0, 255, 255, 0.4)', padding: '36px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${cardSpring})`, boxShadow: '0 0 40px rgba(0,255,255,0.25)', backdropFilter: 'blur(16px)' }}>
          <div style={{ color: '#00FFFF', fontSize: '24px', fontWeight: 800, letterSpacing: '4px' }}>PROBABILITY WAVE</div>
          <div style={{ color: '#FFF', fontSize: '22px', marginTop: '12px', textAlign: 'center', lineHeight: 1.4 }}>
            Particles exist as continuous waves of probability, spread across space!
          </div>
        </div>
      )}

      {sceneId === 'scene_3' && (
        <div style={{ position: 'absolute', top: '1160px', left: '50px', right: '50px', background: 'rgba(255, 0, 119, 0.12)', borderRadius: '24px', border: '2px solid rgba(255, 0, 119, 0.5)', padding: '36px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${cardSpring})`, boxShadow: '0 0 40px rgba(255,0,119,0.25)', backdropFilter: 'blur(16px)' }}>
          <div style={{ color: '#FF0077', fontSize: '24px', fontWeight: 800, letterSpacing: '4px' }}>BARRIER PENETRATION</div>
          <div style={{ color: '#FFF', fontSize: '22px', marginTop: '12px', textAlign: 'center', lineHeight: 1.4 }}>
            The wave extends through the wall, allowing the particle to instantly materialize on the other side!
          </div>
        </div>
      )}

      {sceneId === 'scene_4' && (
        <div style={{ position: 'absolute', top: '1140px', left: '50px', right: '50px', background: 'linear-gradient(135deg, rgba(255,100,0,0.2), rgba(20,5,40,0.9))', borderRadius: '24px', border: '2px solid rgba(255, 215, 0, 0.5)', padding: '40px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${cardSpring})`, boxShadow: '0 0 50px rgba(255,215,0,0.3)', backdropFilter: 'blur(16px)' }}>
          <div style={{ color: '#FFD700', fontSize: '26px', fontWeight: 900, letterSpacing: '4px' }}>POWERING THE SUN</div>
          <div style={{ color: '#FFF', fontSize: '22px', marginTop: '12px', textAlign: 'center', lineHeight: 1.4 }}>
            Without quantum tunneling, solar nuclear fusion would stop, and life on Earth wouldn’t exist!
          </div>
          <div style={{ marginTop: '24px', background: 'linear-gradient(90deg, #00FFFF, #FF0077)', borderRadius: '30px', padding: '12px 30px', color: '#FFF', fontSize: '20px', fontWeight: 900, letterSpacing: '2px' }}>
            SUBSCRIBE FOR QUANTUM FACTS
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
