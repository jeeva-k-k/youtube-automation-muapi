import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

// ==========================================
// V011: CORNEA (AVASCULAR VISION)
// ==========================================
const CorneaVisual: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;


  // Draw eye cornea cross section showing oxygen diffusion vs nerve lines
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

    // Draw cornea curve
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(cx - 200, cy, 260, -Math.PI / 4, Math.PI / 4);
    ctx.stroke();

    // Draw oxygen diffusion particles (cyan dots moving into the cornea)
    ctx.fillStyle = '#67e8f9';
    for (let i = 0; i < 20; i++) {
      const px = cx - 40 + Math.sin(i * 12 + t * 5) * 80;
      const py = cy - 100 + i * 15;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw dense yellow nerve lines branching in cornea
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 200, cy);
    ctx.lineTo(cx - 100, cy - 30);
    ctx.lineTo(cx - 40, cy - 20);
    ctx.moveTo(cx - 200, cy);
    ctx.lineTo(cx - 120, cy + 40);
    ctx.lineTo(cx - 60, cy + 60);
    ctx.stroke();

    ctx.fillStyle = '#eab308';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('SENSORY NERVES', cx - 180, cy - 60);
    ctx.fillStyle = '#67e8f9';
    ctx.fillText('OXYGEN DIFFUSION', cx - 60, cy - 120);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #38bdf8', background: 'rgba(56,189,248,0.1)', boxShadow: '0 0 20px rgba(56,189,248,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#38bdf8', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #38bdf8', padding: '20px' }}>
            <div style={{ color: '#38bdf8', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>VASCULAR STATUS</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>100% Avascular (No Blood Vessels)</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #e2e8f0', padding: '20px' }}>
            <div style={{ color: '#e2e8f0', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>OXYGEN SOURCE</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Absorbed Directly from Tears & Air</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#020617' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#38bdf8', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V012: HEART PUMP (VOLUME METRICS)
// ==========================================
const HeartPumpVisual: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Beating Heart (Scale oscillation)
    const scale = 1.0 + Math.sin(t * Math.PI * 2) * 0.1;
    ctx.save();
    ctx.translate(cx, cy - 80);
    ctx.scale(scale, scale);

    // Simple Heart Shape Path
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.bezierCurveTo(-45, -75, -90, -30, -90, 15);
    ctx.bezierCurveTo(-90, 60, -45, 90, 0, 120);
    ctx.bezierCurveTo(45, 90, 90, 60, 90, 15);
    ctx.bezierCurveTo(90, -30, 45, -75, 0, -30);
    ctx.fill();
    ctx.restore();

    // Draw fluid tank representing blood output accumulation
    const tankY = cy + 220;
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.strokeRect(cx - 150, tankY, 300, 160);

    // Fluid level increases with t
    const fillHeight = Math.min(150, t * 15);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.fillRect(cx - 148, tankY + 158 - fillHeight, 296, fillHeight);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('BLOOD ACCUMULATION', cx - 80, tankY - 15);
    ctx.fillText(`${Math.floor(t * 150)} GALLONS`, cx - 50, tankY + 80);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#090204', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #ef4444', background: 'rgba(239,68,68,0.1)', boxShadow: '0 0 20px rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '40px' }}>❤️</span>
        </div>
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#ef4444', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #ef4444', padding: '20px' }}>
            <div style={{ color: '#ef4444', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>DAILY OUTPUT</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>2,000 Gallons (7,500 Liters)</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #f43f5e', padding: '20px' }}>
            <div style={{ color: '#f43f5e', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>LIFETIME BEATS</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Over 2.5 Billion Beats</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#090204' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#ef4444', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V013: LIVER REGROWTH (CELL DIVISION)
// ==========================================
const LiverRegrowVisual: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Draw liver outline
    ctx.fillStyle = '#854d0e';
    ctx.beginPath();
    ctx.ellipse(cx - 40, cy, 180, 110, -Math.PI / 10, 0, Math.PI * 2);
    ctx.fill();

    // Partial slice fade out
    if (t < 2) {
      // Intact liver
      ctx.fillStyle = '#a16207';
      ctx.beginPath();
      ctx.ellipse(cx + 60, cy - 20, 80, 70, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Regrowing area: animates growing back from cut
      const regrowScale = Math.min(1.0, (t - 2) * 0.3);
      ctx.fillStyle = 'rgba(161, 98, 7, ' + (0.3 + regrowScale * 0.7) + ')';
      ctx.beginPath();
      ctx.ellipse(cx + 60, cy - 20, 80 * regrowScale, 70 * regrowScale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Dividing cells indicators (green circles expanding)
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        const rad = 10 + ((t * 20 + i * 15) % 30);
        ctx.beginPath();
        ctx.arc(cx + 40 + i * 10, cy - 30 + Math.sin(i) * 20, rad, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('HEPATOCYTE PROLIFERATION', cx - 110, cy + 180);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#090502', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #f97316', background: 'rgba(249,115,22,0.1)', boxShadow: '0 0 20px rgba(249,115,22,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#f97316', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #f97316', padding: '20px' }}>
            <div style={{ color: '#f97316', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>RESTORATION TIME</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Regains full mass in weeks</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #fb923c', padding: '20px' }}>
            <div style={{ color: '#fb923c', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>FUNCTIONAL MECHANISM</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Hepatocyte Division (Cell Proliferation)</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#090502' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#f97316', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V014: TICKLE BRAIN (SENSORY PREDICTION)
// ==========================================
const TickleBrainVisual: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Draw Brain schematic
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy - 60, 110, Math.PI, 0); // Cerebrum
    ctx.ellipse(cx, cy + 30, 80, 60, 0, 0, Math.PI);
    ctx.stroke();

    // Cerebellum (Prediction Engine)
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(cx + 60, cy + 40, 35, 0, Math.PI * 2);
    ctx.fill();

    // Signal vectors
    // 1. Motor Command down
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy - 60);
    ctx.lineTo(cx - 30, cy + 120);
    ctx.stroke();

    // 2. Cancellation prediction copy to sensory cortex
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(cx + 60, cy + 10);
    ctx.bezierCurveTo(cx + 40, cy - 40, cx - 20, cy - 60, cx - 40, cy - 40);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('1. MOTOR ACTION', cx - 140, cy + 40);

    ctx.fillStyle = '#ef4444';
    ctx.fillText('2. CANCEL COPY', cx + 20, cy - 30);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#06020c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #c084fc', background: 'rgba(192,132,252,0.1)', boxShadow: '0 0 20px rgba(192,132,252,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#c084fc', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #c084fc', padding: '20px' }}>
            <div style={{ color: '#c084fc', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>SENSORY ATTENUATION</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Cerebellum Predicts Touch & Suppresses Response</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #f43f5e', padding: '20px' }}>
            <div style={{ color: '#f43f5e', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>SELF-TICKLE TIMING</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Introducing delay triggers tickling sensation</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#06020c' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#c084fc', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V015: BLUSH VESSEL (AUTONOMIC BLOOD FLOW)
// ==========================================
const BlushVesselVisual: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Draw face silhouette
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(cx, cy - 40, 130, 0, Math.PI * 2);
    ctx.fill();

    // Red blushing capillaries widening overlay
    const blushFactor = Math.min(1.0, t / 4);
    ctx.fillStyle = `rgba(244, 63, 94, ${blushFactor * 0.45})`;
    ctx.beginPath();
    ctx.arc(cx - 60, cy - 30, 45, 0, Math.PI * 2);
    ctx.arc(cx + 60, cy - 30, 45, 0, Math.PI * 2);
    ctx.fill();

    // Draw vessel branching paths
    ctx.strokeStyle = `rgba(239, 68, 68, ${0.2 + blushFactor * 0.8})`;
    ctx.lineWidth = 1 + blushFactor * 3;
    ctx.beginPath();
    // left cheek branch
    ctx.moveTo(cx - 10, cy + 40);
    ctx.lineTo(cx - 50, cy + 10);
    ctx.lineTo(cx - 70, cy - 20);
    ctx.moveTo(cx - 50, cy + 10);
    ctx.lineTo(cx - 30, cy - 10);
    // right cheek branch
    ctx.moveTo(cx + 10, cy + 40);
    ctx.lineTo(cx + 50, cy + 10);
    ctx.lineTo(cx + 70, cy - 20);
    ctx.moveTo(cx + 50, cy + 10);
    ctx.lineTo(cx + 30, cy - 10);
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('AUTONOMIC VASODILATION', cx - 100, cy + 180);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#0a0203', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #f43f5e', background: 'rgba(244,63,94,0.1)', boxShadow: '0 0 20px rgba(244,63,94,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#f43f5e', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #f43f5e', padding: '20px' }}>
            <div style={{ color: '#f43f5e', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>INVOLUNTARY MECHANISM</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Adrenaline Widens Facial Blood Vessels</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #e11d48', padding: '20px' }}>
            <div style={{ color: '#e11d48', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>RESPONSE TARGET</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>High Capillary Density in Face & Neck</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#0a0203' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#f43f5e', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V016: NERVE SIGNAL (SALTATORY IMPULSE)
// ==========================================
const NerveSignalVisual: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Draw Axon (central pathway)
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(100, cy);
    ctx.lineTo(width - 100, cy);
    ctx.stroke();

    // Draw Myelin Sheaths (insulating blocks)
    const myelinBlocks = [160, 360, 560, 760];
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    myelinBlocks.forEach(bx => {
      ctx.fillRect(bx, cy - 20, 160, 40);
      ctx.strokeRect(bx, cy - 20, 160, 40);
    });

    // Nodes of Ranvier (gaps) are at: 320, 520, 720
    // Electrical impulse jumps between nodes
    const impulseT = (t * 2) % 3.5;
    let pulseX = 140;
    let pulseY = cy;

    if (impulseT < 1) {
      // Leaping from node 1 (320) to node 2 (520)
      const leapProgress = impulseT;
      pulseX = 320 + leapProgress * 200;
      pulseY = cy - Math.sin(leapProgress * Math.PI) * 50;
    } else if (impulseT < 2) {
      const leapProgress = impulseT - 1;
      pulseX = 520 + leapProgress * 200;
      pulseY = cy - Math.sin(leapProgress * Math.PI) * 50;
    } else {
      const leapProgress = impulseT - 2;
      pulseX = 720 + leapProgress * 200;
      pulseY = cy - Math.sin(leapProgress * Math.PI) * 50;
    }

    // Draw leap trajectory arc
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.setLineDash([4, 4, sceneId]);
    ctx.beginPath();
    ctx.moveTo(320, cy); ctx.quadraticCurveTo(420, cy - 60, 520, cy);
    ctx.moveTo(520, cy); ctx.quadraticCurveTo(620, cy - 60, 720, cy);
    ctx.stroke();
    ctx.setLineDash([, sceneId]);

    // Draw leap pulse
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(pulseX, pulseY, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('SALTATORY CONDUCTION', cx - 90, cy + 100);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#020907', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #10b981', background: 'rgba(16,185,129,0.1)', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#10b981', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #10b981', padding: '20px' }}>
            <div style={{ color: '#10b981', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>SIGNAL VELOCITY</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Up to 120 m/s (268 mph)</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #34d399', padding: '20px' }}>
            <div style={{ color: '#34d399', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>CONDUCTION TYPE</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Saltatory (Leaping across Myelin Nodes)</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#020907' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#10b981', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V017: BONE STEEL (STRESS TESTING)
// ==========================================
const BoneSteelVisual: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Split view comparing Bone composite vs Steel rod under bending force
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 200); ctx.lineTo(cx, cy + 200);
    ctx.stroke();

    const bend = Math.sin(t * 3) * 30;

    // LEFT: Bone (bends flexibly, lattice structure)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(cx - 150, cy - 150);
    ctx.quadraticCurveTo(cx - 150 - bend, cy, cx - 150, cy + 150);
    ctx.stroke();

    // RIGHT: Steel (rigid, deforms/cracks at peak bend)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(cx + 150, cy - 150);
    ctx.quadraticCurveTo(cx + 150 - (bend > 15 ? 15 : bend), cy, cx + 150, cy + 150);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('FLEXIBLE BONE LATTICE', cx - 210, cy + 180);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('RIGID STEEL ROD', cx + 40, cy + 180);

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
            <div style={{ color: '#f59e0b', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>TENSILE STRENGTH</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Bone matches steel in weight ratio</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #fbbf24', padding: '20px' }}>
            <div style={{ color: '#fbbf24', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>MATERIAL STRUCTURE</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Living Hydroxyapatite & Collagen Composite</div>
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
// V018: FINGERS WRINKLE (AUTONOMIC GRIP)
// ==========================================
const FingersWrinkleVisual: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Draw fingertip outline
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 140, 200, 0, 0, Math.PI * 2);
    ctx.fill();

    // Constricting blood vessel path narrowing
    const constrict = Math.min(1.0, t / 4);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 14 - constrict * 9;
    ctx.beginPath();
    ctx.moveTo(cx, cy + 180);
    ctx.lineTo(cx, cy - 80);
    ctx.stroke();

    // Ridges forming on sides of skin
    ctx.strokeStyle = '#db2777';
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let y = cy - 120; y < cy + 120; y += 30) {
      const ridgeDepth = constrict * 15;
      ctx.moveTo(cx - 140, y);
      ctx.lineTo(cx - 140 + ridgeDepth, y);
      ctx.moveTo(cx + 140, y);
      ctx.lineTo(cx + 140 - ridgeDepth, y);
    }
    ctx.stroke();

    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('AUTONOMIC VESSELS CONSTRICTION', cx - 130, cy + 240);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#020709', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #06b6d4', background: 'rgba(6,182,212,0.1)', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#06b6d4', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #06b6d4', padding: '20px' }}>
            <div style={{ color: '#06b6d4', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>ACTIVE TRIGGER</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Nervous System Constricts Blood Vessels</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #22d3ee', padding: '20px' }}>
            <div style={{ color: '#22d3ee', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>HYPOTHESIZED UTILITY</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Tread Drainage for Improved Wet Grip</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#020709' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#06b6d4', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V019: SLEEP DEPRIVED (ATTENTION LAPSE)
// ==========================================
const SleepDeprivedVisual: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // React speed clock
    const reactionTime = Math.min(2.5, 0.2 + t * 0.45);
    ctx.strokeStyle = reactionTime > 1.2 ? '#ef4444' : '#10b981';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(cx, cy, 120, -Math.PI / 2, -Math.PI / 2 + (reactionTime / 2.5) * Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`${reactionTime.toFixed(2)}s`, cx - 35, cy + 10);

    ctx.fillStyle = reactionTime > 1.2 ? '#ef4444' : '#10b981';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('REACTION DELAY GAUGE', cx - 80, cy + 180);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#0a090c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #a855f7', background: 'rgba(168,85,247,0.1)', boxShadow: '0 0 20px rgba(168,85,247,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#a855f7', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #a855f7', padding: '20px' }}>
            <div style={{ color: '#a855f7', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>REACTION DEFICIT</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Slowed processing & cognitive drift</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #f43f5e', padding: '20px' }}>
            <div style={{ color: '#f43f5e', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>MICROSLEEP EPISODES</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Brain lapses into brief sleep patterns</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#0a090c' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#a855f7', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V020: STOMACH ACID (METAL DECAY)
// ==========================================
const StomachAcidVisual: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Draw stomach jar showing acidic liquid
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.fillRect(cx - 150, cy - 100, 300, 260);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.strokeRect(cx - 150, cy - 100, 300, 260);

    // Draw metal bolt dissolving inside the acid
    const dissolved = Math.min(1.0, t / 4);
    ctx.fillStyle = '#94a3b8';
    ctx.save();
    ctx.translate(cx, cy + 40);
    ctx.rotate(15 * Math.PI / 180);

    // Bolt head
    ctx.fillRect(-40, -60, 80, 25);
    // Bolt shank: gets thinner with t
    ctx.fillRect(-20, -35, 40 - dissolved * 15, 80);
    ctx.restore();

    // Acid bubbles rising
    ctx.fillStyle = '#34d399';
    for (let i = 0; i < 15; i++) {
      const bx = cx - 120 + ((i * 35 + t * 40) % 240);
      const by = cy + 140 - ((i * 20 + t * 60) % 220);
      ctx.beginPath();
      ctx.arc(bx, by, 3 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('DO NOT INGEST METAL!', cx - 90, cy + 220);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#050a04', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #10b981', background: 'rgba(16,185,129,0.1)', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#10b981', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #10b981', padding: '20px' }}>
            <div style={{ color: '#10b981', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>ACID CHEMISTRY</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Hydrochloric Acid (pH 1.5 - 3.5)</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #ef4444', padding: '20px' }}>
            <div style={{ color: '#ef4444', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>PROTECTION BARRIER</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Thick Mucus prevents self-digestion</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#050a04' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#10b981', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// MASTER EXPORTER
// ==========================================
export const HumanBodyVisuals: React.FC<{ projectId: string; sceneId: string; title: string; eyebrow: string; theme: string }> = ({ projectId, sceneId, title, eyebrow }) => {
  switch (projectId) {
    case 'cornea-no-vessels': return <CorneaVisual sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'heart-daily-pump': return <HeartPumpVisual sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'liver-regrowth-speed': return <LiverRegrowVisual sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'brain-tickle-prediction': return <TickleBrainVisual sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'blush-vessel-adrenaline': return <BlushVesselVisual sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'nerve-impulse-saltatory': return <NerveSignalVisual sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'bone-steel-strength': return <BoneSteelVisual sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'finger-wrinkle-constriction': return <FingersWrinkleVisual sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'sleep-deprived-attention': return <SleepDeprivedVisual sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'stomach-acid-corrosive': return <StomachAcidVisual sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    default: return <CorneaVisual sceneId={sceneId} title={title} eyebrow={eyebrow} />;
  }
};
