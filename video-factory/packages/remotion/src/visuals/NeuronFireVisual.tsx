import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

// ── Scene 1: Neuron Rest Title ──
const RestTitle: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, config: { damping: 18 } });
  const opacity = Math.min(1, frame / 15);
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(135deg, #090d16 0%, #0d1e3d 50%, #152d5e 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {/* Background network connections */}
      {Array.from({ length: 15 }).map((_, i) => {
        const x = ((Math.sin(i * 32.7) * 0.5 + 0.5) * 100);
        const y = ((Math.cos(i * 44.1) * 0.5 + 0.5) * 100);
        const size = 3 + (i % 5);
        return (
          <div key={i} style={{ position: 'absolute', left: x + '%', top: y + '%', width: size, height: size, borderRadius: '50%', background: '#3b82f6', opacity: 0.15 + Math.sin(t * 2 + i) * 0.1, boxShadow: '0 0 8px #3b82f6' }} />
        );
      })}
      <div style={{ zIndex: 10, textAlign: 'center', opacity, padding: '0 50px' }}>
        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', letterSpacing: '8px' }}>{eyebrow}</span>
        <h1 style={{ fontSize: '50px', fontWeight: 800, marginTop: '20px', color: '#f8fafc', fontFamily: 'Georgia, serif', letterSpacing: (1 + progress * 6) + 'px', lineHeight: '1.3' }}>{title}</h1>
      </div>
      {/* Resting membrane voltage meter */}
      <div style={{ position: 'absolute', bottom: '15%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #3b82f6', borderRadius: '12px', padding: '12px 24px', fontFamily: 'monospace', color: '#3b82f6' }}>
        RESTING POTENTIAL: -70 mV
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: Ion Channel Deflection Diagram ──
const IonDiagram: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ background: '#090d16', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 50px', overflow: 'hidden' }}>
      <div style={{ width: '100%', border: '2px solid #3b82f6', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.8)', padding: '28px', fontFamily: 'monospace' }}>
        <div style={{ color: '#3b82f6', fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '28px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          <div style={{ flex: 1 }}><div style={{ color: '#93c5fd', fontSize: '13px' }}>SODIUM CHANNELS</div><div style={{ color: '#fbbf24', fontSize: '18px', fontWeight: 'bold' }}>OPEN</div></div>
          <div style={{ flex: 1 }}><div style={{ color: '#93c5fd', fontSize: '13px' }}>VOLTAGE SPIKE</div><div style={{ color: '#ef4444', fontSize: '18px', fontWeight: 'bold' }}>+40 mV</div></div>
        </div>
      </div>
      <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '24px' }}>
        <svg width="100%" height="100%" viewBox="0 0 400 500" style={{ borderRadius: '16px', background: 'rgba(15, 23, 42, 0.6)' }}>
          {/* Outer membrane barrier */}
          <rect x="0" y="220" width="400" height="60" fill="#1e293b" opacity="0.8" />
          <line x1="0" y1="220" x2="400" y2="220" stroke="#3b82f6" strokeWidth="2" />
          <line x1="0" y1="280" x2="400" y2="280" stroke="#3b82f6" strokeWidth="2" />
          
          {/* Ion channels with gate state */}
          <rect x="170" y="210" width="60" height="80" rx="6" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
          {/* Gates slide open */}
          <line x1="170" y1="250" x2={t > 1.5 ? "150" : "195"} y2="250" stroke="#fbbf24" strokeWidth="4" />
          <line x1="230" y1="250" x2={t > 1.5 ? "250" : "205"} y2="250" stroke="#fbbf24" strokeWidth="4" />

          {/* Sodium ions flowing */}
          {Array.from({ length: 8 }).map((_, i) => {
            const flowProgress = t > 1.5 ? ((t - 1.5) * 120 + i * 40) % 250 : 0;
            const iy = 100 + flowProgress;
            if (iy > 290 && flowProgress === 0) return null;
            return (
              <circle key={i} cx="200" cy={iy} r="6" fill="#fbbf24" opacity={iy > 270 ? 0.3 : 1} />
            );
          })}

          <text x="200" y="195" fill="#fbbf24" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">EXTRACELLULAR Na+ IONS</text>
          <text x="200" y="320" fill="#3b82f6" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">INTRACELLULAR INFLUX</text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Action Potential Axon Sim ──
const ActionPotentialSim: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
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

    // Draw myelinated axon tube
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.moveTo(80, cy);
    ctx.lineTo(width - 80, cy);
    ctx.stroke();

    // Draw node gaps (Nodes of Ranvier)
    const nodeCount = 5;
    const nodeSpacing = (width - 240) / (nodeCount - 1);
    
    // Draw myelin sheath segments
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 32;
    for (let i = 0; i < nodeCount - 1; i++) {
      const sx = 120 + i * nodeSpacing + 20;
      const ex = 120 + (i + 1) * nodeSpacing - 20;
      ctx.beginPath();
      ctx.moveTo(sx, cy);
      ctx.lineTo(ex, cy);
      ctx.stroke();
    }

    // Action potential pulse (glowing spark jumping between nodes)
    const nodeSpeed = 3.5; // Nodes per second
    const currentNode = Math.min(nodeCount - 1, t * nodeSpeed);
    const pulseX = 120 + currentNode * nodeSpacing;

    // Pulse glow
    const pGrd = ctx.createRadialGradient(pulseX, cy, 5, pulseX, cy, 50);
    pGrd.addColorStop(0, '#ef4444');
    pGrd.addColorStop(0.3, '#fbbf24');
    pGrd.addColorStop(1, 'transparent');
    ctx.fillStyle = pGrd;
    ctx.beginPath();
    ctx.arc(pulseX, cy, 50, 0, Math.PI * 2);
    ctx.fill();

    // Spark dots
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(pulseX, cy, 10, 0, Math.PI * 2);
    ctx.fill();

    // Voltage spike waves expanding
    const nodeIdx = Math.floor(currentNode);
    const nodeX = 120 + nodeIdx * nodeSpacing;
    const waveR = ((t * nodeSpeed) % 1) * 60;
    ctx.strokeStyle = `rgba(239, 68, 68, ${1 - waveR / 60})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(nodeX, cy, waveR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, width - 80, height - 80);
  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#090d16' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#3b82f6', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: Neurotransmitter Synapse Summary ──
const SynapseSummary: React.FC<{ title: string; eyebrow: string }> = ({ title, eyebrow }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  // Vesicle paths
  const vesicles = useRef<Array<{ x: number; y: number; r: number; progress: number }>>([]);
  if (vesicles.current.length === 0) {
    for (let i = 0; i < 5; i++) {
      vesicles.current.push({
        x: 340 + i * 100,
        y: 450,
        r: 15,
        progress: 0
      });
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2 + 100;

    // Draw pre-synaptic terminal (top bulb)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4;
    ctx.fillStyle = 'rgba(21, 26, 46, 0.6)';
    ctx.beginPath();
    ctx.arc(cx, cy - 200, 250, 0, Math.PI);
    ctx.stroke();
    ctx.fill();

    // Draw post-synaptic terminal (bottom receptor membrane)
    ctx.beginPath();
    ctx.arc(cx, cy + 250, 230, Math.PI, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    // Vesicles moving down and fusing
    vesicles.current.forEach((v, i) => {
      const vProgress = Math.min(1, t / 3 + i * 0.1);
      const vy = cy - 200 + vProgress * 200;

      if (vProgress < 0.95) {
        // Draw round vesicle containing neurotransmitters
        ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(v.x, vy, v.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Little chemical dots inside
        ctx.fillStyle = '#10b981';
        for (let d = 0; d < 4; d++) {
          ctx.beginPath();
          ctx.arc(v.x - 6 + (d % 2) * 12, vy - 6 + Math.floor(d / 2) * 12, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Fusion: release neurotransmitters into synaptic cleft
        const burstT = t - (vProgress - i * 0.1) * 3;
        ctx.fillStyle = '#10b981';
        for (let p = 0; p < 8; p++) {
          const angle = Math.PI / 4 + (p / 8) * Math.PI * 0.8;
          const dist = burstT * 60 + p * 3;
          if (dist < 150) {
            const px = v.x + Math.cos(angle) * dist;
            const py = cy + Math.sin(angle) * dist;
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    });

  }, [frame, width, height, fps, t]);

  return (
    <AbsoluteFill style={{ background: '#090d16', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 50px' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }} />
      <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '28px', zIndex: 10 }}>
        <div>
          <div style={{ color: '#3b82f6', fontSize: '22px', fontWeight: 'bold', letterSpacing: '4px', fontFamily: 'monospace' }}>{eyebrow}</div>
          <div style={{ color: '#f8fafc', fontSize: '40px', fontWeight: 800, marginTop: '10px', fontFamily: 'Georgia, serif' }}>{title}</div>
        </div>
        <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid rgba(59, 130, 246, 0.15)', paddingBottom: '20px' }}>
          <span style={{ color: '#3b82f6', fontSize: '28px', fontWeight: 'bold', fontFamily: 'monospace' }}>01</span>
          <div>
            <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold' }}>SYNAPTIC TRANSMISSION</h3>
            <p style={{ color: '#93c5fd', fontSize: '17px', marginTop: '6px', lineHeight: 1.4 }}>Electrical pulses trigger vesicle fusion, releasing chemical messengers across the synapse.</p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const DnaVisual: React.FC<{ sceneId: string; title: string; eyebrow: string; theme: string }> = ({ sceneId, title, eyebrow }) => {
  // Let's reuse this file/routing block or export a specific NeuronFireVisual mapping
  return null;
};

export const NeuronFireVisual: React.FC<{ sceneId: string; title: string; eyebrow: string; theme: string }> = ({ sceneId, title, eyebrow }) => {
  switch (sceneId) {
    case 'intro': return <RestTitle title={title} eyebrow={eyebrow} />;
    case 'diagram': return <IonDiagram title={title} eyebrow={eyebrow} />;
    case 'simulation': return <ActionPotentialSim title={title} eyebrow={eyebrow} />;
    case 'summary': return <SynapseSummary title={title} eyebrow={eyebrow} />;
    default: return <RestTitle title={title} eyebrow={eyebrow} />;
  }
};
