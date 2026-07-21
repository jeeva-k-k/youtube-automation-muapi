import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

// ── Scene 1: Energy Absorption & Orbital Jump (Canvas) ──
const ElectronAbsorption: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const progress = spring({ frame, fps, config: { damping: 18 } });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2 + 100;

    // Nucleus (Red/Blue cluster)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(cx - 10, cy, 15, 0, Math.PI * 2);
    ctx.arc(cx + 10, cy, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(cx, cy - 10, 15, 0, Math.PI * 2);
    ctx.arc(cx, cy + 10, 15, 0, Math.PI * 2);
    ctx.fill();

    // Orbitals (Concentric rings)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 100, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 180, 0, Math.PI * 2);
    ctx.stroke();

    // Incoming excitation energy wave
    const waveX = 100 + t * 440;
    if (t < 0.8) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x < 60; x++) {
        const px = waveX - 60 + x;
        const py = cy + Math.sin(x * 0.4 - t * 25) * 12;
        if (x === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Electron orbital jump
    if (t >= 0.8) {
      const eT = t - 0.8;
      const r = 100 + Math.min(1, eT * 3) * 80;
      const angle = eT * 2;
      const ex = cx + Math.cos(angle) * r;
      const ey = cy + Math.sin(angle) * r;

      if (eT < 0.25) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(cx + 100, cy, 30, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(ex, ey, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      // Electron on ground state
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx + 100, cy, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#09050b' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ display: 'block', width: '100%', height: '100%' }} />
      {t < 1.5 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, opacity: 1 - t / 1.5 }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444', letterSpacing: '8px', fontFamily: 'monospace' }}>{eyebrow}</span>
          <h1 style={{ fontSize: '50px', fontWeight: 800, marginTop: '20px', color: '#f8fafc', fontFamily: 'Georgia, serif', letterSpacing: (1 + progress * 6) + 'px', textAlign: 'center', lineHeight: 1.3 }}>{title}</h1>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ── Scene 2: Stimulated Emission (Canvas) ──
const StimulatedEmission: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
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

    const cx = width / 2;
    const cy = height / 2 + 100;

    // Concentric orbitals
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath(); ctx.arc(cx, cy, 80, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 160, 0, Math.PI * 2); ctx.stroke();

    const emitTime = 2.0;

    // Incoming seed photon
    const photonX = 80 + t * 450;
    if (t < emitTime) {
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x < 60; x++) {
        const px = photonX - 60 + x;
        const py = cy - 80 + Math.sin(x * 0.4 - t * 25) * 12;
        if (x === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Electron excited on outer orbit
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx, cy - 160, 10, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const eT = t - emitTime;

      // Electron drops back down (drawn on inner orbit)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx, cy - 80, 10, 0, Math.PI * 2);
      ctx.fill();

      // Two coherent identical photons emitted together (glowing waves side-by-side)
      const outX = cx + eT * 450;
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 4;
      
      // First wave
      ctx.beginPath();
      for (let x = 0; x < 60; x++) {
        const px = outX - 60 + x;
        const py = cy - 100 + Math.sin(x * 0.4 - t * 25) * 12;
        if (x === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Second wave (perfectly in-phase)
      ctx.beginPath();
      for (let x = 0; x < 60; x++) {
        const px = outX - 60 + x;
        const py = cy - 60 + Math.sin(x * 0.4 - t * 25) * 12;
        if (x === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#09050b' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#ef4444', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '32px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Resonator Cavity Wave Amplification (Canvas) ──
const CavityAmplification: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
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

    const cx = width / 2;
    const cy = height / 2 + 100;

    // Mirrors (Left: 100% reflective, Right: 95% reflective)
    ctx.fillStyle = '#64748b';
    ctx.fillRect(100, cy - 200, 20, 400); // Left mirror
    ctx.fillRect(width - 120, cy - 200, 20, 400); // Right mirror

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('REFLECTIVE', 110, cy - 220);
    ctx.fillText('PARTIAL', width - 110, cy - 220);

    // Multi-wave packet bouncing back and forth, amplifying
    // Direction toggles based on t
    const loopDuration = 1.0;
    const loopProgress = (t % loopDuration) / loopDuration;
    const direction = Math.floor(t / loopDuration) % 2 === 0 ? 1 : -1;

    const startX = direction === 1 ? 120 : width - 120;
    const endX = direction === 1 ? width - 120 : 120;
    const currentX = startX + (endX - startX) * loopProgress;

    // Draw waves multiplying (more lines as t grows)
    const waveCount = Math.min(6, 1 + Math.floor(t * 1.5));
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 10;

    for (let w = 0; w < waveCount; w++) {
      const yOffset = -80 + w * 30;
      ctx.beginPath();
      for (let x = 0; x < 120; x++) {
        const px = currentX - direction * 60 + direction * x;
        const py = cy + yOffset + Math.sin(x * 0.3 - t * 30) * 10;
        if (x === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.shadowBlur = 0; // reset

    // Laser beam escape pulse from right mirror
    if (t > 2.0) {
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.8)';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(width - 100, cy);
      ctx.lineTo(width - 100 + (t - 2.0) * 400, cy);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, width - 80, height - 80);
  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#09050b' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#ef4444', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: Coherent Amplification Summary ──
const LaserSummary: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: '#09050b', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 50px', overflow: 'hidden' }}>
    <div style={{ width: '100%', height: '340px', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', background: 'radial-gradient(circle, #2d0c1e 0%, #09050b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="180" height="180" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 12px #f43f5e)' }}>
        <rect x="15" y="30" width="8" height="40" fill="#64748b" /><rect x="77" y="30" width="8" height="40" fill="#64748b" />
        <line x1="23" y1="50" x2="77" y2="50" stroke="#f43f5e" strokeWidth="4" />
        <line x1="77" y1="50" x2="98" y2="50" stroke="#f43f5e" strokeWidth="6" />
        <text x="50" y="86" fill="#f43f5e" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">RESONATOR AMPLIFIER</text>
      </svg>
    </div>
    <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <div style={{ color: '#ef4444', fontSize: '22px', fontWeight: 'bold', letterSpacing: '4px', fontFamily: 'monospace' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '40px', fontWeight: 800, marginTop: '10px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid rgba(239, 68, 68, 0.15)', paddingBottom: '20px' }}>
        <span style={{ color: '#ef4444', fontSize: '28px', fontWeight: 'bold', fontFamily: 'monospace' }}>01</span>
        <div>
          <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold' }}>STIMULATED EMISSION</h3>
          <p style={{ color: '#fca5a5', fontSize: '17px', marginTop: '6px', lineHeight: 1.4 }}>Passing photons trigger excited electrons to drop levels, releasing phase-locked identical photons.</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <span style={{ color: '#ef4444', fontSize: '28px', fontWeight: 'bold', fontFamily: 'monospace' }}>02</span>
        <div>
          <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold' }}>COHERENT LIGHT</h3>
          <p style={{ color: '#fca5a5', fontSize: '17px', marginTop: '6px', lineHeight: 1.4 }}>Reflection between mirrors amplifies waves, escaping as a highly focused, monochromatic beam.</p>
        </div>
      </div>
    </div>
  </AbsoluteFill>
);

export const LaserVisual: React.FC<{ sceneId: string; title: string; eyebrow: string; theme: string }> = ({ sceneId, title, eyebrow }) => {
  switch (sceneId) {
    case 'intro': return <ElectronAbsorption title={title} eyebrow={eyebrow} />;
    case 'diagram': return <StimulatedEmission title={title} eyebrow={eyebrow} />;
    case 'simulation': return <CavityAmplification title={title} eyebrow={eyebrow} />;
    case 'summary': return <LaserSummary title={title} eyebrow={eyebrow} />;
    default: return <ElectronAbsorption title={title} eyebrow={eyebrow} />;
  }
};
