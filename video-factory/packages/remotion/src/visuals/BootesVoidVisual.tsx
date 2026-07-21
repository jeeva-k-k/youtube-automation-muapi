import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

// Scene 1: Cosmic Void Orbit Hook
const BootesVoidTitle: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const opacity = Math.min(1, frame / 10);
  const titleSpring = spring({ frame, fps, config: { damping: 14 } });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#04020a';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2 + 100;

    // Draw background starfield
    for (let i = 0; i < 180; i++) {
      const sx = (Math.sin(i * 99 + t * 0.2) * 0.5 + 0.5) * width;
      const sy = (Math.cos(i * 33 + t * 0.15) * 0.5 + 0.5) * height;
      const size = (i % 3) + 1;
      const starAlpha = 0.3 + Math.sin(t * 3 + i) * 0.3;
      ctx.fillStyle = `rgba(180, 220, 255, ${starAlpha})`;
      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw expanding Void Sphere in 3D center
    const voidRadius = 260 + Math.sin(t * 1.5) * 20;

    // Outer cosmic glow ring
    const outerGrd = ctx.createRadialGradient(cx, cy, voidRadius * 0.8, cx, cy, voidRadius * 1.4);
    outerGrd.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
    outerGrd.addColorStop(0.5, 'rgba(120, 0, 255, 0.15)');
    outerGrd.addColorStop(1, 'transparent');
    ctx.fillStyle = outerGrd;
    ctx.beginPath();
    ctx.arc(cx, cy, voidRadius * 1.4, 0, Math.PI * 2);
    ctx.fill();

    // Dark Void core
    const voidGrd = ctx.createRadialGradient(cx, cy, 10, cx, cy, voidRadius);
    voidGrd.addColorStop(0, '#000000');
    voidGrd.addColorStop(0.7, '#020108');
    voidGrd.addColorStop(1, 'rgba(0, 240, 255, 0.6)');
    ctx.fillStyle = voidGrd;
    ctx.beginPath();
    ctx.arc(cx, cy, voidRadius, 0, Math.PI * 2);
    ctx.fill();

    // Galaxies pushed to the outer boundary
    for (let g = 0; g < 36; g++) {
      const angle = (g / 36) * Math.PI * 2 + t * 0.1;
      const gr = voidRadius + 30 + Math.sin(g * 5 + t) * 15;
      const gx = cx + Math.cos(angle) * gr;
      const gy = cy + Math.sin(angle) * gr;

      ctx.fillStyle = g % 2 === 0 ? '#00ffff' : '#ff00aa';
      ctx.shadowColor = g % 2 === 0 ? '#00ffff' : '#ff00aa';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(gx, gy, 4 + (g % 4), 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#04020a' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* Sleek Top Eyebrow Badge */}
      <div style={{ position: 'absolute', top: '180px', left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity, zIndex: 10 }}>
        <div style={{ background: 'rgba(0, 240, 255, 0.12)', border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '30px', padding: '10px 28px', color: '#00F0FF', fontSize: '22px', fontWeight: 800, letterSpacing: '6px', textTransform: 'uppercase', backdropFilter: 'blur(10px)', boxShadow: '0 0 20px rgba(0,240,255,0.3)' }}>
          {eyebrow || 'COSMIC ANOMALY'}
        </div>
      </div>

      {/* Main Title Overlay */}
      <div style={{ position: 'absolute', top: '260px', left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, opacity, transform: `scale(${0.9 + titleSpring * 0.1})`, padding: '0 40px' }}>
        <h1 style={{ fontSize: '64px', fontWeight: 900, color: '#FFFFFF', textShadow: '0 0 30px rgba(0,240,255,0.8), 0 0 60px rgba(120,0,255,0.6)', textAlign: 'center', margin: 0, letterSpacing: '2px', lineHeight: 1.15 }}>
          {title || 'THE BOÖTES VOID'}
        </h1>
        <div style={{ marginTop: '16px', color: '#FFD700', fontSize: '28px', fontWeight: 700, letterSpacing: '3px', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
          330 MILLION LIGHT-YEARS OF NOTHING
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Scale Counter & Galaxy Capacity
const BootesVoidScale: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scaleValue = Math.min(330, Math.floor(interpolate(frame, [0, 45], [0, 330], { extrapolateRight: 'clamp' })));

  return (
    <AbsoluteFill style={{ background: '#04020a', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '140px 50px 0 50px' }}>
      <div style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.4)', borderRadius: '30px', padding: '10px 24px', color: '#FFD700', fontSize: '20px', fontWeight: 800, letterSpacing: '4px' }}>
        {eyebrow || 'IMPOSSIBLE SCALE'}
      </div>

      <h2 style={{ color: '#FFF', fontSize: '48px', fontWeight: 800, marginTop: '24px', textAlign: 'center', lineHeight: 1.2 }}>
        {title || '330 MILLION LIGHT-YEARS'}
      </h2>

      {/* Glowing Counter Card */}
      <div style={{ width: '100%', marginTop: '60px', background: 'linear-gradient(135deg, rgba(10,10,35,0.9), rgba(20,5,40,0.9))', borderRadius: '24px', border: '2px solid rgba(0, 240, 255, 0.4)', padding: '50px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 0 40px rgba(0,240,255,0.2)', backdropFilter: 'blur(15px)' }}>
        <div style={{ fontSize: '90px', fontWeight: 900, color: '#00F0FF', textShadow: '0 0 30px #00F0FF', fontFamily: 'monospace' }}>
          {scaleValue} M
        </div>
        <div style={{ color: '#A0A5C0', fontSize: '24px', fontWeight: 700, letterSpacing: '3px', marginTop: '10px' }}>
          LIGHT-YEARS DIAMETER
        </div>

        <div style={{ width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.5), transparent)', margin: '30px 0' }} />

        <div style={{ color: '#FFF', fontSize: '26px', textAlign: 'center', lineHeight: 1.4 }}>
          Could easily fit <span style={{ color: '#FF00AA', fontWeight: 800 }}>2,000 MILKY WAY</span> galaxies inside!
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Comparison Split (2,000 vs 60)
const BootesVoidComparison: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  return (
    <AbsoluteFill style={{ background: '#04020a', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '140px 40px 0 40px' }}>
      <div style={{ background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.4)', borderRadius: '30px', padding: '10px 24px', color: '#00FF88', fontSize: '20px', fontWeight: 800, letterSpacing: '4px' }}>
        {eyebrow || 'COSMIC COMPARISON'}
      </div>

      <h2 style={{ color: '#FFF', fontSize: '44px', fontWeight: 800, marginTop: '20px', textAlign: 'center' }}>
        {title || 'EXPECTED VS ACTUAL'}
      </h2>

      <div style={{ width: '100%', marginTop: '50px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/* Normal Space Card */}
        <div style={{ background: 'rgba(0, 255, 136, 0.08)', borderRadius: '20px', border: '1px solid rgba(0, 255, 136, 0.3)', padding: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: '#A0A5C0', fontSize: '18px', fontWeight: 700 }}>NORMAL SPACE REGION</div>
            <div style={{ color: '#00FF88', fontSize: '42px', fontWeight: 900, marginTop: '4px' }}>2,000+</div>
            <div style={{ color: '#FFF', fontSize: '20px', fontWeight: 600 }}>GALAXIES EXPECTED</div>
          </div>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'radial-gradient(circle, #00FF88 0%, transparent 70%)', filter: 'drop-shadow(0 0 15px #00FF88)' }} />
        </div>

        {/* Boötes Void Card */}
        <div style={{ background: 'rgba(255, 51, 102, 0.1)', borderRadius: '20px', border: '2px solid rgba(255, 51, 102, 0.5)', padding: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 0 30px rgba(255,51,102,0.2)' }}>
          <div>
            <div style={{ color: '#A0A5C0', fontSize: '18px', fontWeight: 700 }}>BOÖTES VOID REALITY</div>
            <div style={{ color: '#FF3366', fontSize: '48px', fontWeight: 900, marginTop: '4px' }}>ONLY 60</div>
            <div style={{ color: '#FFF', fontSize: '20px', fontWeight: 600 }}>GALAXIES FOUND!</div>
          </div>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#020108', border: '2px solid #FF3366', boxShadow: '0 0 15px #FF3366' }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Conclusion & Call to Action Card
const BootesVoidSummary: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  return (
    <AbsoluteFill style={{ background: '#04020a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 50px' }}>
      <div style={{ width: '100%', background: 'linear-gradient(135deg, rgba(15,10,35,0.95), rgba(5,20,45,0.95))', border: '2px solid rgba(0, 240, 255, 0.5)', borderRadius: '28px', padding: '50px 36px', textAlign: 'center', boxShadow: '0 0 50px rgba(0,240,255,0.3)', backdropFilter: 'blur(20px)' }}>
        <div style={{ color: '#00F0FF', fontSize: '22px', fontWeight: 800, letterSpacing: '6px', textTransform: 'uppercase' }}>
          {eyebrow || 'TOTAL COSMIC ISOLATION'}
        </div>

        <h2 style={{ color: '#FFF', fontSize: '46px', fontWeight: 900, marginTop: '16px', lineHeight: 1.25 }}>
          {title || "WE WOULD BE ALONE IN THE DARK"}
        </h2>

        <p style={{ color: '#D0D5F0', fontSize: '22px', marginTop: '20px', lineHeight: 1.5 }}>
          If our Milky Way was in the center of the Boötes Void, we wouldn't have discovered other galaxies existed until the <span style={{ color: '#FFD700', fontWeight: 800 }}>1960s!</span>
        </p>

        <div style={{ marginTop: '40px', background: 'linear-gradient(90deg, #00F0FF, #7800FF)', borderRadius: '40px', padding: '16px 36px', color: '#FFF', fontSize: '22px', fontWeight: 900, letterSpacing: '2px', display: 'inline-block', boxShadow: '0 0 25px rgba(0,240,255,0.5)' }}>
          SUBSCRIBE FOR MORE SPACE FACTS
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BootesVoidVisual: React.FC<{ sceneId: string; title: string; eyebrow: string; theme: string }> = ({ sceneId, title, eyebrow }) => {
  switch (sceneId) {
    case 'scene_1':
    case 'intro':
      return <BootesVoidTitle title={title} eyebrow={eyebrow} />;
    case 'scene_2':
    case 'diagram':
      return <BootesVoidScale title={title} eyebrow={eyebrow} />;
    case 'scene_3':
    case 'simulation':
      return <BootesVoidComparison title={title} eyebrow={eyebrow} />;
    case 'scene_4':
    case 'summary':
      return <BootesVoidSummary title={title} eyebrow={eyebrow} />;
    default:
      return <BootesVoidTitle title={title} eyebrow={eyebrow} />;
  }
};
