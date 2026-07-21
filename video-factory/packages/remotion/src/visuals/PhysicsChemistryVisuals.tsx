import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

// ==========================================
// V041: GRAVITY FALL (BOWLING VS FEATHER)
// ==========================================
const GravityFall: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;


  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (sceneId === 'summary') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2 + 100;

    // Split line
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 200); ctx.lineTo(cx, cy + 200);
    ctx.stroke();

    // LEFT: Air Resistance (Ball falls, feather floats)
    const ballY_air = Math.min(cy + 140, cy - 140 + t * 140);
    const featherY_air = Math.min(cy + 140, cy - 140 + t * 45); // falls slowly
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(cx - 150, ballY_air, 15, 0, Math.PI * 2); ctx.fill(); // Ball
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(cx - 160, featherY_air, 20, 5); // Feather

    // RIGHT: Vacuum (Both fall identically)
    const Y_vacuum = Math.min(cy + 140, cy - 140 + t * 140);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(cx + 150, Y_vacuum, 15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(cx + 140, Y_vacuum, 20, 5);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('AIR MEDIUM', cx - 210, cy + 180);
    ctx.fillStyle = '#60a5fa';
    ctx.fillText('VACUUM CHAMBER', cx + 40, cy + 180);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#020202', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #ef4444', background: 'rgba(239,68,68,0.1)', boxShadow: '0 0 20px rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '40px' }}>⚖️</span>
        </div>
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#ef4444', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #ef4444', padding: '20px' }}>
            <div style={{ color: '#ef4444', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>VACUUM PRINCIPLE</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>All mass accelerates identically without air drag</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #f43f5e', padding: '20px' }}>
            <div style={{ color: '#f43f5e', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>HISTORICAL PROOF</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Apollo 15 hammer-feather lunar demonstration</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#020202' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#ef4444', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V042: TRIPLE POINT (WATER EQUILIBRIUM)
// ==========================================
const TriplePoint: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;


  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (sceneId === 'summary') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2 + 100;

    // Vial container
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.strokeRect(cx - 120, cy - 140, 240, 280);

    // 1. Ice sheets at bottom corners
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(cx - 118, cy + 80, 50, 58);
    ctx.fillRect(cx + 68, cy + 80, 50, 58);

    // 2. Liquid water in center
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.fillRect(cx - 68, cy + 90, 136, 48);

    // 3. Vapor particles boiling up
    ctx.fillStyle = '#cbd5e1';
    for (let i = 0; i < 8; i++) {
      const vx = cx - 60 + i * 16;
      const vy = cy + 20 + Math.sin(t * 8 + i) * 35;
      ctx.beginPath();
      ctx.arc(vx, vy, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('ICE, LIQUID & STEAM PHASE', cx - 100, cy + 180);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#020609', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #38bdf8', background: 'rgba(56,189,248,0.1)', boxShadow: '0 0 20px rgba(56,189,248,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#38bdf8', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #38bdf8', padding: '20px' }}>
            <div style={{ color: '#38bdf8', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>PHASE EQUILIBRIUM</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Ice, Liquid, and Vapor coexist in balance</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #0284c7', padding: '20px' }}>
            <div style={{ color: '#0284c7', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>EXACT VALUE</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>0.01°C at 0.006 atmospheres</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#020609' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#38bdf8', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V043: STEEL FEATHER (BUOYANCY SCALES)
// ==========================================
const SteelFeather: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;


  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (sceneId === 'summary') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2 + 100;

    // Balance scale bar (tilts slightly in air, balances in vacuum)
    const tilt = t < 2 ? Math.sin(t * 8) * 10 : 0;

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx - 150, cy + tilt);
    ctx.lineTo(cx + 150, cy - tilt);
    ctx.stroke();

    // Center pivot
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.fill();

    // Scales
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(cx - 165, cy + tilt - 5, 30, 8);
    ctx.fillRect(cx + 135, cy - tilt - 5, 30, 8);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('1KG STEEL', cx - 190, cy + tilt + 40);
    ctx.fillStyle = '#60a5fa';
    ctx.fillText('1KG FEATHERS', cx + 110, cy - tilt + 40);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#020202', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #ef4444', background: 'rgba(239,68,68,0.1)', boxShadow: '0 0 20px rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '40px' }}>⚖️</span>
        </div>
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#ef4444', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #ef4444', padding: '20px' }}>
            <div style={{ color: '#ef4444', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>BUOYANCY VARIATION</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Air pushes up feathers slightly more than steel</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #f43f5e', padding: '20px' }}>
            <div style={{ color: '#f43f5e', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>MASS CALIBRATION</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>1kg represents identical matter quantity</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#020202' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#ef4444', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V044: MPEMBA WATER (FREEZING EXPERIMENT)
// ==========================================
const MpembaWater: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;


  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (sceneId === 'summary') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2 + 100;

    // Split container
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 200); ctx.lineTo(cx, cy + 200);
    ctx.stroke();

    // LEFT: Hot Water (rising convection arrows)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      const ay = cy + 40 - ((t * 40 + i * 30) % 80);
      ctx.beginPath();
      ctx.moveTo(cx - 100 + i * 20, ay);
      ctx.lineTo(cx - 100 + i * 20, ay - 15);
      ctx.stroke();
    }

    // RIGHT: Cold Water (flat/settled lines)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx + 40, cy); ctx.lineTo(cx + 120, cy);
    ctx.moveTo(cx + 40, cy + 20); ctx.lineTo(cx + 120, cy + 20);
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('HOT WATER (80°C)', cx - 145, cy + 120);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('COLD WATER (20°C)', cx + 45, cy + 120);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#020609', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #38bdf8', background: 'rgba(56,189,248,0.1)', boxShadow: '0 0 20px rgba(56,189,248,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#38bdf8', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #38bdf8', padding: '20px' }}>
            <div style={{ color: '#38bdf8', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>MPEMBA EVENT</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Hot water freezes faster in some setups</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #0284c7', padding: '20px' }}>
            <div style={{ color: '#0284c7', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>CONTRIBUTING INGREDIENTS</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Evaporation rate, convection, supercooling</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#020609' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#38bdf8', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V045: GLASS RESONANCE (SHATTER WAVES)
// ==========================================
const GlassResonance: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;


  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (sceneId === 'summary') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2 + 100;

    // Draw Glass beaker vibrating or shattering
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 4;

    const vibrate = Math.sin(t * 20) * (t * 8);

    if (t < 3) {
      // Vibrating intact beaker
      ctx.beginPath();
      ctx.moveTo(cx - 80 - vibrate, cy - 100);
      ctx.lineTo(cx - 80 + vibrate, cy + 100);
      ctx.lineTo(cx + 80 - vibrate, cy + 100);
      ctx.lineTo(cx + 80 + vibrate, cy - 100);
      ctx.stroke();
    } else {
      // Shattered glass pieces
      ctx.fillStyle = '#a855f7';
      for (let i = 0; i < 12; i++) {
        const px = cx - 120 + i * 20 + Math.sin(i * 12) * (t - 3) * 60;
        const py = cy + Math.cos(i * 7) * (t - 3) * 60;
        ctx.beginPath();
        ctx.moveTo(px, py); ctx.lineTo(px + 15, py - 10); ctx.lineTo(px + 8, py + 12);
        ctx.closePath(); ctx.fill();
      }
    }

    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('NATURAL RESONANCE FREQUENCY', cx - 110, cy + 180);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#030206', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #a855f7', background: 'rgba(168,85,247,0.1)', boxShadow: '0 0 20px rgba(168,85,247,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#a855f7', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #a855f7', padding: '20px' }}>
            <div style={{ color: '#a855f7', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>RESONANCE FACTOR</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Matched natural frequency builds vibration strain</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #ef4444', padding: '20px' }}>
            <div style={{ color: '#ef4444', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>BREAK LIMIT</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Shatters when mechanical tension limits are crossed</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#030206' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#a855f7', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V046: MAGNET PIPE (LENZ ELECTROMAGNETIC)
// ==========================================
const MagnetPipe: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;


  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (sceneId === 'summary') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2 + 100;

    // Split-screen copper pipes
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 200); ctx.lineTo(cx, cy + 200);
    ctx.stroke();

    // LEFT: Steel Slug (Falls instantly)
    const steelY = Math.min(cy + 150, cy - 150 + t * 300);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(cx - 160, steelY, 20, 30);

    // RIGHT: Magnet (Falls in slow motion)
    const magnetY = Math.min(cy + 150, cy - 150 + t * 45); // very slow
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(cx + 140, magnetY, 20, 15);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(cx + 140, magnetY + 15, 20, 15);

    // Circulating currents indicators (yellow loops in pipe)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx + 150, magnetY - 15, 25, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 150, magnetY + 45, 25, 6, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Pipe columns
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 6;
    ctx.strokeRect(cx - 170, cy - 150, 40, 300);
    ctx.strokeRect(cx + 130, cy - 150, 40, 300);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('STEEL SLUG', cx - 205, cy + 180);
    ctx.fillText('EDDY BRAKING', cx + 105, cy + 180);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#090805', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #f59e0b', background: 'rgba(245,158,11,0.1)', boxShadow: '0 0 20px rgba(245,158,11,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#f59e0b', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #f59e0b', padding: '20px' }}>
            <div style={{ color: '#f59e0b', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>EDDY CURRENTS</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Induced magnetic fields oppose magnet direction</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #fbbf24', padding: '20px' }}>
            <div style={{ color: '#fbbf24', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>LENZ LAW EFFECTS</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Slows fall speed, converting momentum to heat</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#090805' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#f59e0b', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V047: LIGHT PUSH (PHOTON RADIATION PRESSURE)
// ==========================================
const LightPush: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;


  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (sceneId === 'summary') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2 + 100;

    // Laser photon stream (red lines flowing from left to right)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      const lineY = cy - 60 + i * 30;
      ctx.beginPath();
      ctx.moveTo(100, lineY);
      ctx.lineTo(cx - 30 + t * 12, lineY);
      ctx.stroke();
    }

    // Reflective sail plate moving slightly right
    const sailX = cx - 30 + t * 12;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.strokeRect(sailX, cy - 80, 15, 160);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.fillRect(sailX, cy - 80, 15, 160);

    ctx.fillStyle = '#0ea5e9';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('PHOTON MOMENTUM TRANSFER', cx - 110, cy + 120);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#020208', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #0ea5e9', background: 'rgba(14,165,233,0.1)', boxShadow: '0 0 20px rgba(14,165,233,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#0ea5e9', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #0ea5e9', padding: '20px' }}>
            <div style={{ color: '#0ea5e9', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>RADIATION PRESSURE</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Photons transfer momentum when reflected</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #38bdf8', padding: '20px' }}>
            <div style={{ color: '#38bdf8', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>SOLAR SAILS</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Enables propellant-free travel in space</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#020208' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#0ea5e9', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V048: ELECTRICITY DRIFT (SIGNAL VELOCITY)
// ==========================================
const ElectricityDrift: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;


  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (sceneId === 'summary') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2 + 100;

    // Draw Wire column
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(100, cy); ctx.lineTo(width - 100, cy);
    ctx.stroke();

    // Signal wavefront (yellow arrow moving extremely fast along top of wire)
    const waveX = 100 + ((t * 400) % 800);
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(waveX, cy - 20, 8, 0, Math.PI * 2);
    ctx.fill();

    // Electrons (blue spheres drifting very slowly inside the wire)
    ctx.fillStyle = '#38bdf8';
    for (let i = 0; i < 15; i++) {
      const ex = 100 + i * 50 + t * 6; // very slow drift
      if (ex < width - 100) {
        ctx.beginPath();
        ctx.arc(ex, cy, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.fillStyle = '#eab308';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('EM SIGNAL: NEAR LIGHT SPEED', cx - 120, cy - 40);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('ELECTRON DRIFT: MM/SEC', cx - 110, cy + 40);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#05020c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #a855f7', background: 'rgba(168,85,247,0.1)', boxShadow: '0 0 20px rgba(168,85,247,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#a855f7', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #a855f7', padding: '20px' }}>
            <div style={{ color: '#a855f7', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>SIGNAL VELOCITY</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Propagates near light speed along circuit</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #c084fc', padding: '20px' }}>
            <div style={{ color: '#c084fc', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>ELECTRON DRIFT</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Individual electrons move at millimeters per second</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#05020c' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#a855f7', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V049: CAN CRUSH (STEAM CONCENTRATION)
// ==========================================
const CanCrush: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;


  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (sceneId === 'summary') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2 + 100;

    // Draw Can template (collapses/contracts at t = 2)
    const crush = t < 2 ? 0 : Math.min(1.0, (t - 2) * 2) * 55;

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';

    ctx.beginPath();
    ctx.moveTo(cx - 80 + crush, cy - 120);
    ctx.lineTo(cx + 80 - crush, cy - 120);
    ctx.lineTo(cx + 80 - crush, cy + 120);
    ctx.lineTo(cx - 80 + crush, cy + 120);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Large atmospheric pressure arrows crushing inward
    if (t > 1.8) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      // Left arrow
      ctx.beginPath(); ctx.moveTo(cx - 160, cy); ctx.lineTo(cx - 90 + crush, cy); ctx.stroke();
      // Right arrow
      ctx.beginPath(); ctx.moveTo(cx + 160, cy); ctx.lineTo(cx + 90 - crush, cy); ctx.stroke();
    }

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('100,000 PA OUTSIDE AIR PRESSURE', cx - 120, cy + 160);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#060204', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #ef4444', background: 'rgba(239,68,68,0.1)', boxShadow: '0 0 20px rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '40px' }}>🥫</span>
        </div>
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#ef4444', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #ef4444', padding: '20px' }}>
            <div style={{ color: '#ef4444', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>COLLAPSE VECTOR</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>101,325 Pascals (Sea Level atmospheric weight)</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #f43f5e', padding: '20px' }}>
            <div style={{ color: '#f43f5e', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>TRIGGER CAUSE</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Cold water condenses internal steam into vacuum</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#060204' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#ef4444', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V050: ATOM CHARGE (ELECTROSTATIC BLOCK)
// ==========================================
const AtomCharge: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;


  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (sceneId === 'summary') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2 + 100;

    // Draw central nucleus (red/orange)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2); ctx.fill();

    // Electrons crowding around and repelling each other (explodes outwards at t = 2)
    const explode = t < 2 ? 0 : (t - 2) * 260;
    ctx.fillStyle = '#38bdf8';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;

    const electronCount = 8;
    for (let i = 0; i < electronCount; i++) {
      const angle = i * (Math.PI * 2 / electronCount);
      const rad = 80 + explode;
      const ex = cx + Math.cos(angle) * rad;
      const ey = cy + Math.sin(angle) * rad;

      ctx.beginPath();
      ctx.arc(ex, ey, 8, 0, Math.PI * 2);
      ctx.fill();

      // Repulsion force vector arrows
      if (t > 1.8) {
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex + Math.cos(angle) * 35, ey + Math.sin(angle) * 35);
        ctx.stroke();
      }
    }

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('COULOMB REPULSION FORCE SPIKE', cx - 120, cy + 180);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#020202', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #ef4444', background: 'rgba(239,68,68,0.1)', boxShadow: '0 0 20px rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '40px' }}>💥</span>
        </div>
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#ef4444', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #ef4444', padding: '20px' }}>
            <div style={{ color: '#ef4444', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>COULOMB REPULSION</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Electrostatic forces dominate gravity on atomic scale</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #f43f5e', padding: '20px' }}>
            <div style={{ color: '#f43f5e', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>PHYSICAL EFFECT</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Uniform charge excess results in immediate explosion</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#020202' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#ef4444', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// MASTER EXPORTER
// ==========================================
export const PhysicsChemistryVisuals: React.FC<{ projectId: string; sceneId: string; title: string; eyebrow: string; theme: string }> = ({ projectId, sceneId, title, eyebrow }) => {
  switch (projectId) {
    case 'gravity-fall-vacuum': return <GravityFall sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'triple-point-water': return <TriplePoint sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'steel-feather-buoyancy': return <SteelFeather sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'mpemba-hot-water-freeze': return <MpembaWater sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'sound-shatter-glass': return <GlassResonance sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'magnet-copper-pipe': return <MagnetPipe sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'light-pressure-solar-sail': return <LightPush sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'electricity-signal-electrons': return <ElectricityDrift sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'air-pressure-can-crush': return <CanCrush sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'extra-electron-atom': return <AtomCharge sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    default: return <GravityFall sceneId={sceneId} title={title} eyebrow={eyebrow} />;
  }
};
