import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

// ── Scene 1: Photon Strike & Electron Ejection (Canvas) ──
const PhotonStrike: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const progress = spring({ frame, fps, config: { damping: 18 } });
  const opacity = Math.min(1, frame / 15);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2 + 100;

    // Draw Chlorophyll molecule (green ring with magnesium center)
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 140, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(cx, cy, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Mg', cx, cy + 7);

    // Incoming photon wave packet (yellow)
    const photonX = 120 + t * 450;
    const photonY = cy - 200 + t * 200;

    if (t < 0.8) {
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x < 60; x++) {
        const px = photonX - 60 + x;
        const py = photonY + Math.sin(x * 0.4 - t * 20) * 15;
        if (x === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Excited electron ejection (flashing dot flying out)
    if (t >= 0.8) {
      const eT = t - 0.8;
      const ex = cx + eT * 500;
      const ey = cy - eT * 300;

      // Ejection flash
      if (eT < 0.3) {
        ctx.fillStyle = `rgba(255, 255, 255, ${(1 - eT / 0.3) * 0.8})`;
        ctx.beginPath();
        ctx.arc(cx, cy - 40, 60, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(ex, ey, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    } else {
      // Electron resting on chlorophyll outer ring
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(cx, cy - 140, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#050c05' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ display: 'block', width: '100%', height: '100%' }} />
      {t < 1.5 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, opacity: 1 - t / 1.5 }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e', letterSpacing: '8px', fontFamily: 'monospace' }}>{eyebrow}</span>
          <h1 style={{ fontSize: '50px', fontWeight: 800, marginTop: '20px', color: '#f8fafc', fontFamily: 'Georgia, serif', letterSpacing: (1 + progress * 6) + 'px', textAlign: 'center', lineHeight: 1.3 }}>{title}</h1>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ── Scene 2: Water Splitting Action (Canvas) ──
const WaterSplitting: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
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

    // Membrane structure
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, cy - 40, width, 80);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, cy - 40, width, 80);

    // Oxygen-evolving complex (enzyme)
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(cx, cy, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('OEC ENZYME', cx, cy + 5);

    // Water molecule approaching and splitting
    const splitTime = 2.0;
    if (t < splitTime) {
      const h2oY = cy - 250 + (t / splitTime) * 180;
      // Oxygen atom (Red)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx, h2oY, 20, 0, Math.PI * 2);
      ctx.fill();
      // Hydrogen atoms (Blue)
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(cx - 24, h2oY + 15, 12, 0, Math.PI * 2);
      ctx.arc(cx + 24, h2oY + 15, 12, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const sT = t - splitTime;
      // Oxygen flies out as O2 (merging/moving upward)
      const oxY = cy - 70 - sT * 150;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx - 15, oxY, 18, 0, Math.PI * 2);
      ctx.arc(cx + 15, oxY, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('O₂ Gas', cx, oxY - 24);

      // Protons (H+ split and cross downward)
      const pY = cy + 70 + sT * 180;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(cx - 50, pY, 10, 0, Math.PI * 2);
      ctx.arc(cx + 50, pY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('H+', cx - 50, pY + 4);
      ctx.fillText('H+', cx + 50, pY + 4);
    }
  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#050c05' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#22c55e', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '32px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: ATP Synthase Turbine (Canvas) ──
const AtpSynthase: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
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

    // Draw membrane layer
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, cy - 180, width, 60);

    // Draw ATP Synthase channel and turbine rotor
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4;
    ctx.fillStyle = '#0f172a';
    // Rotor head (spinning section)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * 4); // Rotates like a turbine
    ctx.beginPath();
    ctx.arc(0, 0, 90, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Rotor blades/compartments
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * 90, Math.sin(angle) * 90);
      ctx.stroke();
    }
    ctx.restore();

    // Protons (H+) flowing down channel, spinning the turbine
    const p1Progress = (t * 180) % 360;
    const p1Y = cy - 250 + p1Progress;
    if (p1Y < cy + 200) {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(cx - 30, p1Y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('H+', cx - 30, p1Y + 4);
    }

    // ATP synthesis flash at bottom
    if (t > 1.0) {
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(cx, cy + 180, 20 + Math.sin(t * 10) * 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('ATP', cx, cy + 184);
    }

    ctx.strokeStyle = 'rgba(34, 197, 94, 0.25)';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, width - 80, height - 80);
  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#050c05' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#22c55e', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: Summary Active Loop (Canvas) ──
const PhotosynthesisSummary: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: '#050c05', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 50px', overflow: 'hidden' }}>
    <div style={{ width: '100%', height: '340px', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '16px', background: 'radial-gradient(circle, #0c2e0c 0%, #050c05 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="180" height="180" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 12px #22c55e)' }}>
        <circle cx="50" cy="50" r="30" fill="none" stroke="#22c55e" strokeWidth="2" />
        <line x1="50" y1="20" x2="50" y2="80" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />
        <path d="M 30,40 Q 50,20 70,40" fill="none" stroke="#eab308" strokeWidth="2" />
        <text x="50" y="92" fill="#22c55e" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">WATER SPLITTING SYSTEM</text>
      </svg>
    </div>
    <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <div style={{ color: '#22c55e', fontSize: '22px', fontWeight: 'bold', letterSpacing: '4px', fontFamily: 'monospace' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '40px', fontWeight: 800, marginTop: '10px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid rgba(34, 197, 94, 0.15)', paddingBottom: '20px' }}>
        <span style={{ color: '#22c55e', fontSize: '28px', fontWeight: 'bold', fontFamily: 'monospace' }}>01</span>
        <div>
          <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold' }}>PHOTOLYSIS OF WATER</h3>
          <p style={{ color: '#86efac', fontSize: '17px', marginTop: '6px', lineHeight: 1.4 }}>Photons excite chlorophyll electrons; enzyme splits water to restore the balance, releasing O₂.</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <span style={{ color: '#22c55e', fontSize: '28px', fontWeight: 'bold', fontFamily: 'monospace' }}>02</span>
        <div>
          <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold' }}>PROTON GRADIENT</h3>
          <p style={{ color: '#86efac', fontSize: '17px', marginTop: '6px', lineHeight: 1.4 }}>Accumulated protons flow through ATP Synthase, powering molecular energy production.</p>
        </div>
      </div>
    </div>
  </AbsoluteFill>
);

export const PhotosynthesisVisual: React.FC<{ sceneId: string; title: string; eyebrow: string; theme: string }> = ({ sceneId, title, eyebrow }) => {
  switch (sceneId) {
    case 'intro': return <PhotonStrike title={title} eyebrow={eyebrow} />;
    case 'diagram': return <WaterSplitting title={title} eyebrow={eyebrow} />;
    case 'simulation': return <AtpSynthase title={title} eyebrow={eyebrow} />;
    case 'summary': return <PhotosynthesisSummary title={title} eyebrow={eyebrow} />;
    default: return <PhotonStrike title={title} eyebrow={eyebrow} />;
  }
};
