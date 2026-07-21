import React, { useRef, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

// ==========================================
// V031: CHALLENGER DEEP (PLATE SUBDUCTION)
// ==========================================
const ChallengerDeep: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Subduction plate boundary profile
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(100, cy - 140);
    ctx.lineTo(cx - 30, cy - 20);
    // Trench bend
    ctx.quadraticCurveTo(cx - 10, cy, cx - 30, cy + 30);
    ctx.lineTo(cx - 150, cy + 180);
    ctx.stroke();

    // Overriding plate
    ctx.beginPath();
    ctx.moveTo(width - 100, cy - 20);
    ctx.lineTo(cx + 20, cy - 20);
    ctx.lineTo(cx + 40, cy + 80);
    ctx.stroke();

    // Depth gauge
    const depth = t > 2 ? 10994 : Math.floor(t * 5497);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(`${depth} METERS`, cx - 60, cy - 80);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#02040a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #38bdf8', background: 'rgba(56,189,248,0.1)', boxShadow: '0 0 20px rgba(56,189,248,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#38bdf8', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #38bdf8', padding: '20px' }}>
            <div style={{ color: '#38bdf8', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>MAX DEPTH REACHED</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>10,994 meters (36,070 ft)</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #0ea5e9', padding: '20px' }}>
            <div style={{ color: '#0ea5e9', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>HYDROSTATIC PRESSURE</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>1,086 Bar (1,000x Atmospheric)</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#02040a' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#38bdf8', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V032: EVEREST TRENCH (SCALE METRICS)
// ==========================================
const EverestTrench: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Draw Ocean boundary box
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 4;
    ctx.strokeRect(cx - 160, cy - 200, 320, 360);

    // Ocean water level lines
    ctx.fillStyle = 'rgba(2, 132, 199, 0.2)';
    ctx.fillRect(cx - 158, cy - 198, 316, 356);

    // Everest mountain shape (overlaying into bottom)
    const everestHeight = Math.min(260, t * 75);
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(cx, cy + 158 - everestHeight);
    ctx.lineTo(cx - 100, cy + 158);
    ctx.lineTo(cx + 100, cy + 158);
    ctx.closePath();
    ctx.fill();

    // Snowcap
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(cx, cy + 158 - everestHeight);
    ctx.lineTo(cx - 30, cy + 158 - everestHeight * 0.7);
    ctx.lineTo(cx + 30, cy + 158 - everestHeight * 0.7);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('EVEREST SUMMIT', cx - 60, cy + 190);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#020509', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #0284c7', background: 'rgba(2,132,199,0.1)', boxShadow: '0 0 20px rgba(2,132,199,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#0284c7', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #0284c7', padding: '20px' }}>
            <div style={{ color: '#0284c7', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>EVEREST SUMMIT HEIGHT</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>8,848 meters (29,029 ft)</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #38bdf8', padding: '20px' }}>
            <div style={{ color: '#38bdf8', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>REMAINING WATER COUPLING</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>2,146 meters above Everest summit</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#020509' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#0284c7', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V033: ICE MELT (GLOBAL SEA LEVEL)
// ==========================================
const IceMelt: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Draw Continent outlines
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 140, 140, 0, 0, Math.PI * 2);
    ctx.fill();

    // Coastal rising blue water overlay shrinking the continent size
    const melt = Math.min(1.0, t / 4);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 4 + melt * 25;
    ctx.beginPath();
    ctx.arc(cx, cy, 140 - melt * 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('COASTAL SHORELINE DISPLACEMENT', cx - 120, cy + 180);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#02070c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #0284c7', background: 'rgba(2,132,199,0.1)', boxShadow: '0 0 20px rgba(2,132,199,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#0284c7', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #0284c7', padding: '20px' }}>
            <div style={{ color: '#0284c7', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>SEA LEVEL INCrease</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Roughly 70 meters (230 ft) rise</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #38bdf8', padding: '20px' }}>
            <div style={{ color: '#38bdf8', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>ICE VOLUME SOURCE</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>90% stored in Antarctic ice sheets</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#02070c' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#0284c7', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V034: LIGHTNING SUN (PLASMA TEMP)
// ==========================================
const LightningSun: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // LEFT: Lightning (snaking plasma bolt)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - 150, cy - 150);
    ctx.lineTo(cx - 120 + Math.sin(t * 10) * 15, cy - 50);
    ctx.lineTo(cx - 160 + Math.cos(t * 12) * 15, cy + 50);
    ctx.lineTo(cx - 130, cy + 150);
    ctx.stroke();

    // RIGHT: Sun (yellow surface outline)
    ctx.save();
    ctx.translate(cx + 150, cy);
    const sunGrd = ctx.createRadialGradient(0, 0, 5, 0, 0, 80);
    sunGrd.addColorStop(0, '#fff');
    sunGrd.addColorStop(0.5, '#f59e0b');
    sunGrd.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGrd;
    ctx.beginPath();
    ctx.arc(0, 0, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('LIGHTNING: 30,000°C', cx - 210, cy + 180);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('SUN: 5,500°C', cx + 40, cy + 180);

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
            <div style={{ color: '#f97316', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>LIGHTNING TEMPERATURE</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>30,000°C (5x Hotter than Sun surface)</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #fb923c', padding: '20px' }}>
            <div style={{ color: '#fb923c', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>SUN SURFACE VALUE</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Approx 5,500°C (Photosphere)</div>
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
// V035: CORIOLIS EQUATOR (ZERO DEFLECTION)
// ==========================================
const CoriolisEquator: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Equator baseline line
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(50, cy); ctx.lineTo(width - 50, cy);
    ctx.stroke();

    // Wind vectors (straight lines crossing at equator, spirals further north)
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    // Straight winds crossing equator
    for (let i = 0; i < 4; i++) {
      const lineX = cx - 120 + i * 80;
      ctx.beginPath();
      ctx.moveTo(lineX, cy - 40); ctx.lineTo(lineX, cy + 40);
      ctx.stroke();
    }

    // Spirals in northern hemisphere (cy - 120)
    ctx.strokeStyle = '#38bdf8';
    ctx.save();
    ctx.translate(cx, cy - 100);
    ctx.rotate(t * 2);
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, Math.PI);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('EQUATOR (ZERO CORIOLIS FORCE)', cx - 130, cy + 80);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#020509', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #0284c7', background: 'rgba(2,132,199,0.1)', boxShadow: '0 0 20px rgba(2,132,199,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#0284c7', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #0284c7', padding: '20px' }}>
            <div style={{ color: '#0284c7', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>CORIOLIS DEFLECTION</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Essentially zero at the Equator</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #38bdf8', padding: '20px' }}>
            <div style={{ color: '#38bdf8', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>STORM PATTERN IMPACT</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Prevents atmospheric rotation development</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#020509' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#0284c7', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V036: KRAKATOA SOUND (PRESSURE WAVE)
// ==========================================
const KrakatoaSound: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Draw central volcano eruption coordinates
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(cx, cy, 15, 0, Math.PI * 2);
    ctx.fill();

    // Sound shockwave circles spreading globally
    for (let i = 0; i < 3; i++) {
      const radius = ((t * 80 + i * 80) % 240);
      ctx.strokeStyle = `rgba(239, 68, 68, ${Math.max(0, 1 - radius / 240)})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('1883 GLOBAL PRESSURE WAVE', cx - 110, cy + 220);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#090204', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #ef4444', background: 'rgba(239,68,68,0.1)', boxShadow: '0 0 20px rgba(239,68,68,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#ef4444', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #ef4444', padding: '20px' }}>
            <div style={{ color: '#ef4444', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>HEARD RANGE</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>4,800 kilometers (3,000 miles) away</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #f43f5e', padding: '20px' }}>
            <div style={{ color: '#f43f5e', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>BAROMETER TRACKING</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Pressure waves circled Earth 4 times</div>
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
// V037: VOLCANO ASH (GLOBAL AEROSOLS)
// ==========================================
const VolcanoAsh: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Tectonic hemisphere grid
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 140, 0, Math.PI * 2);
    ctx.stroke();

    // Ash particles circulating in wind vector loops
    ctx.fillStyle = '#fb923c';
    for (let i = 0; i < 25; i++) {
      const angle = (i * 15 + t * 40) * Math.PI / 180;
      const radius = 100 + Math.sin(i * 12) * 35;
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.arc(px, py, 3 + (i % 2), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#f97316';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('AEROSOLS HEMISPHERE VECTOR', cx - 110, cy + 220);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#080502', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #f97316', background: 'rgba(249,115,22,0.1)', boxShadow: '0 0 20px rgba(249,115,22,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#f97316', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #f97316', padding: '20px' }}>
            <div style={{ color: '#f97316', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>AEROSOL TRANSPORT</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Sulfur particles circulate globally in stratospheric winds</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #fb923c', padding: '20px' }}>
            <div style={{ color: '#fb923c', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>CLIMATE INFLUENCE</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Reflects solar radiation, causing cooling</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#080502' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#f97316', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V038: SAHARA DESERT (AREA SCALE)
// ==========================================
const SaharaDesert: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Draw Sahara outline boundary (sandy yellow polygon)
    ctx.fillStyle = 'rgba(234, 179, 8, 0.2)';
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - 150, cy - 80);
    ctx.lineTo(cx + 150, cy - 100);
    ctx.lineTo(cx + 120, cy + 80);
    ctx.lineTo(cx - 130, cy + 60);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Morph overlay of US shape
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - 140, cy - 70, 280, 140);

    ctx.fillStyle = '#eab308';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('SAHARA AREA COMPARED TO US', cx - 110, cy + 140);

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
            <div style={{ color: '#eab308', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>DESERT AREA VALUE</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>9.2 Million square kilometers</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #facc15', padding: '20px' }}>
            <div style={{ color: '#facc15', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>COMPARATIVE SIZE</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Roughly equal to entire US or China</div>
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
// V039: ANTARCTIC LAKES (RADAR DISCOVERY)
// ==========================================
const AntarcticLakes: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Draw thick Ice sheet block (white/grey)
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(cx - 150, cy - 140, 300, 180);

    // Radar scanning line (scans downward to detect subglacial water)
    const scanY = cy - 140 + ((t * 90) % 240);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 150, scanY); ctx.lineTo(cx + 150, scanY);
    ctx.stroke();

    // Subglacial liquid lake (deep blue) at the very bottom
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(cx - 150, cy + 40, 300, 80);

    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('SUBGLACIAL LIQUID WATER LAKE', cx - 110, cy + 160);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#020509', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #0284c7', background: 'rgba(2,132,199,0.1)', boxShadow: '0 0 20px rgba(2,132,199,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#0284c7', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #0284c7', padding: '20px' }}>
            <div style={{ color: '#0284c7', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>LAKE VOSTOK DEPTH</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Located beneath 4 kilometers of ice</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #38bdf8', padding: '20px' }}>
            <div style={{ color: '#38bdf8', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>LIQUID RETENTION</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Kept liquid by ice pressure & geothermal heat</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#020509' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#0284c7', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// V040: AUSTRALIA DRIFT (GPS SHIFT)
// ==========================================
const AustraliaDrift: React.FC<{ sceneId: string; title: string; eyebrow: string }> = ({ sceneId, title, eyebrow }) => {
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

    // Draw Australia shape drifting northeast
    const driftX = t * 15;
    const driftY = -t * 15;

    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(cx + driftX, cy + driftY, 110, 80, 0, 0, Math.PI * 2);
    ctx.fill();

    // Target crosshair (original location)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('DRIFT PATHWAY: +7 CM/YEAR', cx - 110, cy + 120);

  }, [frame, width, height, t, sceneId]);

  if (sceneId === 'summary') {
    return (
      <AbsoluteFill style={{ background: '#020509', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 50px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #0284c7', background: 'rgba(2,132,199,0.1)', boxShadow: '0 0 20px rgba(2,132,199,0.3)' }} />
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#0284c7', fontSize: '22px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '4px' }}>{eyebrow}</span>
          <h2 style={{ color: '#f8fafc', fontSize: '38px', fontWeight: 800, marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</h2>
        </div>
        <div style={{ width: '100%', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #0284c7', padding: '20px' }}>
            <div style={{ color: '#0284c7', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>DRIFT RATE</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>7 centimeters per year northeast</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid #38bdf8', padding: '20px' }}>
            <div style={{ color: '#38bdf8', fontSize: '15px', fontFamily: 'monospace', fontWeight: 'bold' }}>GPS ALIGNMENT</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginTop: '4px' }}>Requires coordinate adjustments over time</div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: '#020509' }}>
      <canvas ref={canvasRef} width={1080} height={1920} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', zIndex: 10 }}>
        <div style={{ color: '#0284c7', fontSize: '22px', fontWeight: 'bold' }}>{eyebrow}</div>
        <div style={{ color: '#f8fafc', fontSize: '30px', fontWeight: 'bold', marginTop: '8px', fontFamily: 'Georgia, serif' }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// MASTER EXPORTER
// ==========================================
export const EarthEnvironmentVisuals: React.FC<{ projectId: string; sceneId: string; title: string; eyebrow: string; theme: string }> = ({ projectId, sceneId, title, eyebrow }) => {
  switch (projectId) {
    case 'challenger-deep-ocean': return <ChallengerDeep sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'everest-trench-scale': return <EverestTrench sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'ice-melt-sea-level': return <IceMelt sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'lightning-sun-temp': return <LightningSun sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'coriolis-equator-storm': return <CoriolisEquator sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'krakatoa-sound-pressure': return <KrakatoaSound sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'volcano-ash-aerosols': return <VolcanoAsh sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'sahara-desert-scale': return <SaharaDesert sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'antarctic-lakes-radar': return <AntarcticLakes sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    case 'australia-drift-gps': return <AustraliaDrift sceneId={sceneId} title={title} eyebrow={eyebrow} />;
    default: return <ChallengerDeep sceneId={sceneId} title={title} eyebrow={eyebrow} />;
  }
};
