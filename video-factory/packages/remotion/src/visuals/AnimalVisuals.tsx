import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

// ==========================================
// V021: OCTOPUS HEARTS (BLUE COPPER BLOOD)
// ==========================================
const OctopusHearts: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Pulse size calculations
    const pulse = 1.0 + Math.sin(t * Math.PI * 2.5) * 0.12;

    // Draw Three Hearts (blue outline circles)
    ctx.lineWidth = 4;

    // 1. Systemic Heart (center)
    ctx.strokeStyle = '#0284c7';
    ctx.fillStyle = 'rgba(2, 132, 199, 0.2)';
    ctx.beginPath();
    ctx.arc(cx, cy - 30, 45 * pulse, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // 2. Branchial Heart Left
    ctx.strokeStyle = '#38bdf8';
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.beginPath();
    ctx.arc(cx - 120, cy + 40, 30 * pulse, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // 3. Branchial Heart Right
    ctx.beginPath();
    ctx.arc(cx + 120, cy + 40, 30 * pulse, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Blue copper blood flows
    ctx.fillStyle = '#0ea5e9';
    for (let i = 0; i < 15; i++) {
      const bx = cx - 120 + ((i * 12 + t * 40) % 240);
      const by = cy + Math.sin(bx * 0.05 + t * 3) * 15;
      ctx.beginPath();
      ctx.arc(bx, by, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('BRANCHIAL HEARTS (GILLS)', cx - 180, cy + 120);
    ctx.fillText('SYSTEMIC HEART (BODY)', cx - 75, cy - 100);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#02070f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #38bdf8', background: 'rgba(56,189,248,0.1)', boxShadow: '0 0 20px rgba(56,189,248,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#38bdf8', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #38bdf8', padding: '20px' }}>
            <div style={{ color: '#38bdf8', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>HEART CONFIGURATION</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>3 Hearts (2 Branchial, 1 Systemic)</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #0284c7', padding: '20px' }}>
            <div style={{ color: '#0284c7', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>BLOOD CHEMISTRY</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Blue Hemocyanin (Copper-Based Carrier)</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#02070f' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#38bdf8', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V022: TARDIGRADE TUN (SPACE SHIELDS)
// ==========================================
const TardigradeTun: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Space background radiation lines
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 15; i++) {
      const lineX = cx - 300 + i * 40 + Math.sin(t * 10) * 10;
      ctx.beginPath();
      ctx.moveTo(lineX, cy - 200);
      ctx.lineTo(lineX + 50, cy + 200);
      ctx.stroke();
    }

    // Microscope viewer circle
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 140, 0, Math.PI * 2);
    ctx.stroke();

    // Tardigrade tun shape (curled barrel) in center
    ctx.fillStyle = '#d8b4fe';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 60, 45, 10 * Math.PI / 180, 0, Math.PI * 2);
    ctx.fill();

    // Legs curled
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(cx - 30, cy + 30, 10, 15);
    ctx.fillRect(cx - 10, cy + 32, 10, 15);
    ctx.fillRect(cx + 10, cy + 30, 10, 15);

    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('DESICCATED TUN FORM', cx - 80, cy + 180);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#08010b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #a855f7', background: 'rgba(168,85,247,0.1)', boxShadow: '0 0 20px rgba(168,85,247,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#a855f7', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #a855f7', padding: '20px' }}>
            <div style={{ color: '#a855f7', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>SPACE RESISTANCE</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Survives vacuum & solar radiation spikes</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #d8b4fe', padding: '20px' }}>
            <div style={{ color: '#d8b4fe', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>SURVIVAL PHYSIOLOGY</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Cryptobiosis (Desiccated Tun State)</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#08010b' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#a855f7', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V023: CRAB BLUE BLOOD (AMOEBOBCYTE TEST)
// ==========================================
const CrabBlueBlood: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Test vial structure
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.strokeRect(cx - 80, cy - 100, 160, 220);

    // Blue copper blood inside vial gelating
    const gelFactor = Math.min(1.0, t / 4);
    ctx.fillStyle = `rgba(6, 182, 212, ${0.4 + gelFactor * 0.45})`;
    ctx.fillRect(cx - 78, cy + 118 - 140, 156, 140);

    // Gel lines (cross-hatching representing clotting networks)
    if (t > 2) {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.moveTo(cx - 70, cy - 20 + i * 20); ctx.lineTo(cx + 70, cy - 40 + i * 20);
        ctx.moveTo(cx - 60 + i * 25, cy - 80); ctx.lineTo(cx - 60 + i * 25, cy + 110);
      }
      ctx.stroke();
    }

    // Endotoxin molecules (yellow dots) falling in
    ctx.fillStyle = '#eab308';
    for (let i = 0; i < 10; i++) {
      const ex = cx - 60 + i * 12;
      const ey = cy - 120 + ((t * 80 + i * 15) % 180);
      ctx.beginPath();
      ctx.arc(ex, ey, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('LAL GELATION CLOT ASSAY', cx - 105, cy + 160);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#020a0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #06b6d4', background: 'rgba(6,182,212,0.1)', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#06b6d4', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #06b6d4', padding: '20px' }}>
            <div style={{ color: '#06b6d4', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>ENDOTOXIN SENSITIVITY</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Gel reaction detects parts-per-trillion pathogens</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #0891b2', padding: '20px' }}>
            <div style={{ color: '#0891b2', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>ECOLOGICAL IMPACT</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Conservation concerns driving synthetic assays</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#020a0f' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#06b6d4', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V024: SHRIMP VISION (POLARISED BANDS)
// ==========================================
const ShrimpVision: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Draw Mantis Shrimp eye outline in center
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx - 80, cy, 60, 0, Math.PI * 2);
    ctx.arc(cx + 80, cy, 60, 0, Math.PI * 2);
    ctx.stroke();

    // 16 color receptor bands expanding sideways
    const bandsCount = 16;
    for (let i = 0; i < bandsCount; i++) {
      const hue = (i * (360 / bandsCount) + t * 40) % 360;
      ctx.fillStyle = `hsla(${hue}, 80%, 50%, 0.85)`;
      ctx.fillRect(cx - 180 + i * 22, cy + 90, 18, 30);
    }

    ctx.fillStyle = '#eab308';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('16 PHOTORECEPTOR CHANNELS', cx - 110, cy + 160);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#0a0902', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #eab308', background: 'rgba(234,179,8,0.1)', boxShadow: '0 0 20px rgba(234,179,8,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#eab308', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #eab308', padding: '20px' }}>
            <div style={{ color: '#eab308', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>PHOTORECEPTORS</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>12 - 16 Color Channels (Humans hold 3)</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #facc15', padding: '20px' }}>
            <div style={{ color: '#facc15', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>POLARIZATION CHANNELS</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Detects circular polarized light fields</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#0a0902' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#eab308', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V025: CROCODILE BITE (FORCE PRESSURE)
// ==========================================
const CrocodileBite: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Jaw structure template snapping
    const snap = t > 2 ? 0 : Math.sin(t * 10) * 20;

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 6;

    // Upper jaw
    ctx.save();
    ctx.translate(cx, cy - 30);
    ctx.rotate(-snap * Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(-120, -10); ctx.lineTo(120, -10); ctx.lineTo(100, -30);
    ctx.stroke();
    ctx.restore();

    // Lower jaw
    ctx.save();
    ctx.translate(cx, cy + 30);
    ctx.rotate(snap * Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(-120, 10); ctx.lineTo(120, 10); ctx.lineTo(100, 30);
    ctx.stroke();
    ctx.restore();

    // Force scale ticking up
    const force = t > 2 ? 16460 : Math.floor(t * 8230);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`${force} N`, cx - 50, cy + 120);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#050a06', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #10b981', background: 'rgba(16,185,129,0.1)', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#10b981', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #10b981', padding: '20px' }}>
            <div style={{ color: '#10b981', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>MAX BITE FORCE</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>16,460 Newtons (3,700 lbf)</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #059669', padding: '20px' }}>
            <div style={{ color: '#059669', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>ANIMAL WEIGHT REF</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Matches T. Rex modeling estimates</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#050a06' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#10b981', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V026: GECKO SETAE (VAN DER WAALS FORCE)
// ==========================================
const GeckoSetae: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Draw microscopic spatulae hair branching
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 160, cy);
    ctx.lineTo(cx, cy);

    // branches
    ctx.lineTo(cx + 80, cy - 40);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + 80, cy + 40);
    ctx.stroke();

    // Van der Waals force coupling lines to wall surface (green glow lines)
    ctx.strokeStyle = 'rgba(16, 185, 129, ' + (0.3 + Math.sin(t * 10) * 0.2) + ')';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      ctx.moveTo(cx + 80, cy - 40 + i * 10);
      ctx.lineTo(cx + 150, cy - 40 + i * 10);
    }
    ctx.stroke();

    // Wall surface
    ctx.fillStyle = '#475569';
    ctx.fillRect(cx + 150, cy - 100, 30, 200);

    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('VAN DER WAALS MOLECULAR GRIP', cx - 110, cy + 140);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#02080a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #06b6d4', background: 'rgba(6,182,212,0.1)', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#06b6d4', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #06b6d4', padding: '20px' }}>
            <div style={{ color: '#06b6d4', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>NANOSTRUCTURES</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Setae hairs split into hundreds of spatulae</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #22d3ee', padding: '20px' }}>
            <div style={{ color: '#22d3ee', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>BINDING EFFECT</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Electromagnetic Van der Waals attraction</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#02080a' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#06b6d4', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V027: AXOLOTL REGROWTH (CELL BLASTEMA)
// ==========================================
const AxolotlRegrow: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Draw Axon limb shape regrowing
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.ellipse(cx - 60, cy, 120, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    const regrow = Math.min(1.0, t / 4);

    // Regrowing foot digits
    ctx.fillStyle = '#f472b6';
    for (let i = 0; i < 4; i++) {
      const rx = cx + 60 + i * 15 * regrow;
      const ry = cy - 20 + i * 12 * regrow;
      ctx.beginPath();
      ctx.arc(rx, ry, 10 * regrow, 0, Math.PI * 2);
      ctx.fill();
    }

    // Blastema dividing cells indicators (flashing pink/green rings)
    ctx.strokeStyle = '#db2777';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx + 60, cy, 30 * (1 - regrow * 0.5), 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#db2777';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('BLASTEMA CAP PROLIFERATION', cx - 110, cy + 120);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#090206', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #db2777', background: 'rgba(219,39,119,0.1)', boxShadow: '0 0 20px rgba(219,39,119,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#db2777', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #db2777', padding: '20px' }}>
            <div style={{ color: '#db2777', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>REGENERATION TARGET</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Rebuilds limbs, spinal cord & brain parts</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #f472b6', padding: '20px' }}>
            <div style={{ color: '#f472b6', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>CELLULAR PROCESS</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Blastema Stem Cell Proliferation</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#090206' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#db2777', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V028: WOODPECKER HAMMER (DECEL PEAKS)
// ==========================================
const WoodpeckerHammer: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Wood surface
    ctx.fillStyle = '#854d0e';
    ctx.fillRect(cx + 120, cy - 150, 40, 300);

    // Beak head colliding (rotates/strikes wood)
    const strike = Math.sin(t * 12) > 0.8;
    const beakX = strike ? cx + 120 : cx + 20;

    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(beakX - 100, cy);
    ctx.lineTo(beakX, cy);
    ctx.stroke();

    // Deceleration peak graph indicator
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 150, cy + 180);
    ctx.lineTo(cx - 80, cy + 180);
    if (strike) {
      ctx.lineTo(cx - 60, cy + 100);
      ctx.lineTo(cx - 40, cy + 180);
    }
    ctx.lineTo(cx + 80, cy + 180);
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('1,200 G IMPACT FORCE PEAK', cx - 110, cy + 220);

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
            <div style={{ color: '#f97316', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>DECELERATION LIMIT</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Experiences 1,200 Gs without compression</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #fb923c', padding: '20px' }}>
            <div style={{ color: '#fb923c', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>SKULL BIOMECHANICS</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Stiff hammer configuration (No absorption)</div>
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
// V029: ANT LIFT (SCALING RATIO)
// ==========================================
const AntLift: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Draw ant holding massive leaf
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(cx - 60, cy + 40); ctx.lineTo(cx, cy + 40);
    ctx.stroke();

    // Leaf (giant green shape)
    const leafOffset = Math.sin(t * 4) * 8;
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(cx, cy - 40 + leafOffset, 120, 60, -10 * Math.PI / 180, 0, Math.PI * 2);
    ctx.fill();

    // Ant legs holding it up
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy + 40); ctx.lineTo(cx - 40, cy - 10 + leafOffset);
    ctx.moveTo(cx + 10, cy + 40); ctx.lineTo(cx + 10, cy - 10 + leafOffset);
    ctx.stroke();

    ctx.fillStyle = '#eab308';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('LIFTS 50x BODY WEIGHT', cx - 80, cy + 120);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#090802', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #eab308', background: 'rgba(234,179,8,0.1)', boxShadow: '0 0 20px rgba(234,179,8,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#eab308', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #eab308', padding: '20px' }}>
            <div style={{ color: '#eab308', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>LIFT CAPACITY</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Lifts up to 50 times its body mass</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #facc15', padding: '20px' }}>
            <div style={{ color: '#facc15', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>PHYSICAL LAW</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Muscle Strength scales with area, Mass with volume</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#090802' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#eab308', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V030: ROACH SPIRACLE (DECAPITATION SURVIVAL)
// ==========================================
const RoachSpiracle: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Draw stylized insect body shape
    ctx.fillStyle = '#7c2d12';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 80, 160, 0, 0, Math.PI * 2);
    ctx.fill();

    // Spiracles along body margins (glowing cyan dots showing respiration)
    ctx.fillStyle = '#22d3ee';
    for (let i = 0; i < 6; i++) {
      const sy = cy - 120 + i * 48;
      ctx.beginPath();
      ctx.arc(cx - 75, sy, 5, 0, Math.PI * 2);
      ctx.arc(cx + 75, sy, 5, 0, Math.PI * 2);
      ctx.fill();

      // Breathing air lines
      const breathProgress = (t * 2 + i) % 1;
      ctx.strokeStyle = `rgba(34, 211, 238, ${1 - breathProgress})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx - 75, sy, 5 + breathProgress * 20, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('BODY SPIRACLES OXYGEN PORTALS', cx - 125, cy + 200);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#090602', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #ea580c', background: 'rgba(234,88,12,0.1)', boxShadow: '0 0 20px rgba(234,88,12,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#ea580c', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #ea580c', padding: '20px' }}>
            <div style={{ color: '#ea580c', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>BREATHING MECHANISM</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Spiracles distribute oxygen without mouth/nose</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #f97316', padding: '20px' }}>
            <div style={{ color: '#f97316', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>LIMITING FACTORS</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Eventually succumbs to dehydration or mold</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#090602' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#ea580c', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// MASTER EXPORTER
// ==========================================
export const AnimalVisuals: React.FC<{ projectId: string; sceneId: string; title: string; eyebrow: string; theme: string }> = ({ projectId, sceneId, title, eyebrow }) => {
  switch (projectId) {
    case 'octopus-hearts-blue': return <OctopusHearts sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'tardigrade-space-survival': return <TardigradeTun sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'crab-blood-endotoxin': return <CrabBlueBlood sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'shrimp-vision-photoreceptors': return <ShrimpVision sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'croc-bite-force': return <CrocodileBite sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'gecko-setae-adhesion': return <GeckoSetae sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'axolotl-regrow-blastema': return <AxolotlRegrow sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'woodpecker-hammer-decel': return <WoodpeckerHammer sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'ant-lift-scaling': return <AntLift sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'roach-spiracles-survival': return <RoachSpiracle sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    default: return <OctopusHearts sceneId={sceneId} title={title} eyebrow={eyebrow} />;
  }
};
