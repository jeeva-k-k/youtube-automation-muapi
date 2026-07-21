import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export const SummaryScene: React.FC<{
  title: string;
  eyebrow: string;
  theme: string;
}> = ({ title, eyebrow, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ background: '#04020a', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '60px 100px', overflow: 'hidden' }}>
      
      {/* 1. Left Graphic Panel (Floating gold bar/nucleus illustration representation) */}
      <div style={{ width: '480px', height: '600px', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: '16px', background: 'radial-gradient(circle at 50% 50%, #201505 0%, #050402 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        
        {/* Glow halo */}
        <div style={{ position: 'absolute', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(251, 191, 36, 0.15)', filter: 'blur(40px)', zIndex: 1 }} />

        {/* Floating geometric crystal representing heavy metals */}
        <svg width="240" height="240" viewBox="0 0 100 100" style={{ zIndex: 2, filter: 'drop-shadow(0 0 12px #fbbf24)' }}>
          <polygon points="50,15 80,35 80,65 50,85 20,65 20,35" fill="none" stroke="#fbbf24" strokeWidth="2" />
          <line x1="50" y1="15" x2="50" y2="85" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="20" y1="35" x2="80" y2="65" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="80" y1="35" x2="20" y2="65" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="50" cy="50" r="12" fill="#fbbf24" />
          <text x="50" y="96" fill="#fbbf24" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">GOLD (Au) / PLATINUM (Pt)</text>
        </svg>
      </div>

      {/* 2. Right Editorial Takeaway Grid */}
      <div style={{ flex: 1, height: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginLeft: '80px' }}>
        <div>
          <div style={{ color: '#fbbf24', fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px', fontFamily: 'monospace' }}>{eyebrow}</div>
          <div style={{ color: '#ffffff', fontSize: '48px', fontWeight: 800, marginTop: '12px', letterSpacing: '-1px', fontFamily: 'Georgia, serif', lineHeight: '1.1' }}>{title}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid rgba(251, 191, 36, 0.15)', paddingBottom: '20px' }}>
            <span style={{ color: '#fbbf24', fontSize: '28px', fontWeight: 'bold', fontFamily: 'monospace' }}>01</span>
            <div>
              <h3 style={{ color: '#ffffff', fontSize: '22px', fontWeight: 'bold' }}>THE R-PROCESS</h3>
              <p style={{ color: '#8fa9bd', fontSize: '17px', marginTop: '6px', lineHeight: '1.4' }}>Rapid neutron capture fuses atomic nuclei faster than they can decay, forging heavy elements.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ color: '#fbbf24', fontSize: '28px', fontWeight: 'bold', fontFamily: 'monospace' }}>02</span>
            <div>
              <h3 style={{ color: '#ffffff', fontSize: '22px', fontWeight: 'bold' }}>STELLAR NUCLEI</h3>
              <p style={{ color: '#8fa9bd', fontSize: '17px', marginTop: '6px', lineHeight: '1.4' }}>Almost all gold, platinum, and uranium on Earth originated from binary neutron star mergers billions of years ago.</p>
            </div>
          </div>

        </div>
      </div>

    </AbsoluteFill>
  );
};
