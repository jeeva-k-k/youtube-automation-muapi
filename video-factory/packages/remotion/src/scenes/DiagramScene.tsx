import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export const DiagramScene: React.FC<{
  title: string;
  eyebrow: string;
  theme: string;
}> = ({ title, eyebrow, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Orbit parameters
  const angle = t * 3.5;
  const radius = 110;
  const cx = 400; // SVG center x
  const cy = 300; // SVG center y

  const starAx = cx + Math.cos(angle) * radius;
  const starAy = cy + Math.sin(angle) * radius;

  const starBx = cx - Math.cos(angle) * radius;
  const starBy = cy - Math.sin(angle) * radius;

  return (
    <AbsoluteFill style={{ background: '#04020a', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '60px 100px', overflow: 'hidden' }}>
      
      {/* 1. Left Telemetry Stats Card */}
      <div style={{ width: '480px', height: '600px', border: '2px solid #8b5cf6', borderRadius: '16px', background: 'rgba(10, 6, 20, 0.75)', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'monospace' }}>
        <div>
          <div style={{ color: '#ec4899', fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px' }}>{eyebrow}</div>
          <div style={{ color: '#ffffff', fontSize: '32px', fontWeight: 'bold', marginTop: '12px', letterSpacing: '-1px', fontFamily: 'Georgia, serif', lineHeight: '1.2' }}>{title}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderTop: '1px solid rgba(139, 92, 246, 0.3)', paddingTop: '30px' }}>
          <div>
            <div style={{ color: '#8fa9bd', fontSize: '16px' }}>SYSTEM: BINARY NEUTRON STAR</div>
            <div style={{ color: '#ffffff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>PSR J0737-3039</div>
          </div>
          <div>
            <div style={{ color: '#8fa9bd', fontSize: '16px' }}>ORBITAL VELOCITY: 0.1c</div>
            <div style={{ color: '#00ffcc', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>30,000 km/s</div>
          </div>
          <div>
            <div style={{ color: '#8fa9bd', fontSize: '16px' }}>GRAVITATIONAL FLUX</div>
            <div style={{ color: '#ffb86c', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>MAX DEFORMATION</div>
          </div>
        </div>
      </div>

      {/* 2. Right Interactive SVG Diagram */}
      <div style={{ flex: 1, height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '60px' }}>
        <svg width="800" height="600" style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', background: 'rgba(5, 5, 8, 0.6)' }}>
          {/* Grid background */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(139, 92, 246, 0.08)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Coordinate axis crosshairs */}
          <line x1={cx} y1="50" x2={cx} y2="550" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="50" y1={cy} x2="750" y2={cy} stroke="rgba(139, 92, 246, 0.15)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Concentric expanding gravitational waves */}
          {[1, 2, 3].map(i => {
            const waveRadius = ((t * 80 + i * 120) % 360);
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={waveRadius}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
                opacity={Math.max(0, 1 - waveRadius / 360) * 0.5}
              />
            );
          })}

          {/* Orbital path outline */}
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1.5" />

          {/* Connectors to center */}
          <line x1={cx} y1={cy} x2={starAx} y2={starAy} stroke="rgba(139, 92, 246, 0.4)" strokeWidth="1.5" />
          <line x1={cx} y1={cy} x2={starBx} y2={starBy} stroke="rgba(255, 0, 127, 0.4)" strokeWidth="1.5" />

          {/* Star A */}
          <circle cx={starAx} cy={starAy} r="18" fill="#8b5cf6" filter="url(#glow)" />
          <text x={starAx} y={starAy - 26} fill="#8b5cf6" fontSize="14" fontWeight="bold" textAnchor="middle">CORE A</text>

          {/* Star B */}
          <circle cx={starBx} cy={starBy} r="18" fill="#ec4899" filter="url(#glow)" />
          <text x={starBx} y={starBy - 26} fill="#ec4899" fontSize="14" fontWeight="bold" textAnchor="middle">CORE B</text>

          {/* Filters definitions */}
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>
      </div>

    </AbsoluteFill>
  );
};
