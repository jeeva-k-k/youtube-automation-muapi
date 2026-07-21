import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { ParticleLayer } from '../components/ParticleLayer';

export const TitleScene: React.FC<{
  title: string;
  eyebrow: string;
  theme: string;
}> = ({ title, eyebrow, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring transition for smooth text letter spacing expansion
  const progress = spring({
    frame,
    fps,
    config: { damping: 18 }
  });

  const letterSpacing = 4 + progress * 22; // expands from 4px to 26px
  const opacity = Math.min(1.0, frame / 15);

  return (
    <AbsoluteFill style={{ background: '#04020a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {/* Target HUD calibration lines */}
      <div style={{ position: 'absolute', width: '90%', height: '80%', border: '1px solid rgba(139, 92, 246, 0.15)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: '50%', top: '5%', bottom: '5%', borderLeft: '1px dashed rgba(139, 92, 246, 0.1)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', left: '5%', right: '5%', borderTop: '1px dashed rgba(139, 92, 246, 0.1)', pointerEvents: 'none' }} />

      <ParticleLayer color="rgba(139, 92, 246, 0.3)" count={50} speed={0.4} />

      <div style={{ zIndex: 10, textAlign: 'center', opacity, padding: '0 80px' }}>
        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#ec4899', letterSpacing: '8px', textTransform: 'uppercase' }}>
          {eyebrow}
        </span>
        <h1 style={{ fontSize: '64px', fontWeight: 800, marginTop: '24px', textTransform: 'uppercase', color: '#ffffff', letterSpacing: `${letterSpacing}px`, fontFamily: 'Georgia, Times, serif', lineHeight: '1.2' }}>
          {title}
        </h1>
      </div>
    </AbsoluteFill>
  );
};
