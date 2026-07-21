/* global gsap */
(() => {
  const state = { data: null, project: null, timeline: null, currentCue: -1, paths: {}, canvasCtx: null, currentVisualType: null };
  const $ = s => document.querySelector(s);
  const scenes = () => Array.from(document.querySelectorAll('.scene'));

  function sceneAt(t) {
    return state.project.scenes.find(s => t >= s.start && t < s.end) || state.project.scenes.at(-1);
  }

  function setupSpectrum(id, bone) {
    const el = $(id);
    if (!el) return;
    el.innerHTML = '';
    for (let i = 0; i < 22; i++) {
      const b = document.createElement('i');
      const u = i / 21;
      const h = 22 + 55 * (.35 + .65 * Math.sin(i * .77 + 1.2) ** 2) + (bone ? 78 * Math.pow(1 - u, 1.8) : 0);
      b.style.height = `${Math.min(105, h)}px`;
      el.appendChild(b);
    }
  }

  function prepPath(selector, key) {
    const p = $(selector);
    if (!p) return;
    const len = p.getTotalLength();
    p.style.strokeDasharray = `${len}`;
    p.style.strokeDashoffset = `${len}`;
    state.paths[key] = { node: p, len };
  }

  function animatePath(tl, key, start, duration) {
    const p = state.paths[key];
    if (!p) return;
    tl.fromTo(p.node, { strokeDashoffset: p.len }, { strokeDashoffset: 0, duration, ease: 'power2.out', immediateRender: false }, start);
  }

  function buildTimeline() {
    const tl = gsap.timeline({ paused: true, defaults: { overwrite: false } });
    state.timeline = tl;

    if (state.project.generic) {
      // Generic Timeline Setup
      document.querySelectorAll('.scene:not(.generic-scene)').forEach(el => el.style.display = 'none');
      const gen = $('#generic-visuals');
      gsap.set(gen, { autoAlpha: 1 });
      
      // Simple visual scene ticks to trigger redraws
      state.project.scenes.forEach((s) => {
        tl.to({}, { duration: s.end - s.start }, s.start);
      });
    } else {
      // Legacy Voice Video Timeline
      scenes().forEach(el => gsap.set(el, { autoAlpha: 0, x: 0 }));
      state.project.scenes.forEach((s, i) => {
        const el = $(`#scene-${s.id}`);
        const enter = i ? Math.max(0, s.start - .18) : s.start;
        tl.fromTo(el, { autoAlpha: 0, x: 46 }, { autoAlpha: 1, x: 0, duration: .34, ease: 'power2.out', immediateRender: false }, enter);
        tl.to(el, { autoAlpha: 0, x: -34, duration: .24, ease: 'power2.in' }, Math.max(enter + .35, s.end - .24));
      });
      const lift = (selector, start, stagger = 0) => tl.fromTo(selector, { autoAlpha: 0, x: 28 }, { autoAlpha: 1, x: 0, duration: .48, stagger, ease: 'power2.out', immediateRender: false }, start);
      lift('#scene-hook .hook-copy', .18); lift('#scene-hook .portrait', .10);
      lift('#scene-routes .diagram-card', 5.26); lift('#scene-routes .equation', 5.48);
      lift('#scene-air .diagram-card', 10.88); lift('#scene-air .step-rail', 11.08);
      lift('#scene-bone .diagram-card', 17.06); lift('#scene-bone .step-rail', 17.26);
      lift('#scene-mix .compare-card', 25.52, .16); lift('#scene-microphone .mic-visual', 35.51);
      lift('#scene-chain .chain-wave', 41.93); lift('#scene-resolution .portrait', 43.62); lift('#scene-resolution .resolution-stack', 43.78);
      animatePath(tl, 'routesAir', 5.65, 1.6); animatePath(tl, 'routesBone', 7.20, 1.65);
      animatePath(tl, 'air', 11.22, 1.85); animatePath(tl, 'bone', 17.48, 2.05); animatePath(tl, 'micAir', 35.85, 1.45);
      tl.fromTo('.vibration-rings', { autoAlpha: 0, x: -18 }, { autoAlpha: .78, x: 0, duration: 1.2, ease: 'power2.out' }, 18.2);
      tl.fromTo('.chain-node', { autoAlpha: 0, y: 35 }, { autoAlpha: 1, y: 0, duration: .35, stagger: .18, ease: 'power2.out' }, 41.83);
    }
    tl.duration(state.project.format.duration);
  }

  function updateHeader(t) {
    const s = sceneAt(t);
    $('#eyebrow').textContent = s.eyebrow;
    $('#title').textContent = s.title;
    $('#progress-fill').style.width = `${Math.max(0, Math.min(100, t / state.project.format.duration * 100))}%`;
  }

  function captionCue(t) {
    return state.data.captions.findIndex(c => t >= c.start && t < c.end);
  }

  function updateCaption(t) {
    const idx = captionCue(t);
    const panel = $('#caption-panel');
    if (idx < 0) {
      panel.style.opacity = '0';
      state.currentCue = -1;
      return;
    }
    panel.style.opacity = '1';
    const cue = state.data.captions[idx];
    if (idx !== state.currentCue) {
      $('#caption-text').innerHTML = cue.words.map((w, i) => `<span data-word="${i}" class="${/air|bone|skull|inner|frequency|fuller|deeper|private/i.test(w.text) ? 'keyword' : ''}">${w.text}</span>`).join('');
      state.currentCue = idx;
    }
    let active = -1;
    cue.words.forEach((w, i) => {
      if (t >= w.start && t < w.end) active = i;
    });
    document.querySelectorAll('#caption-text span').forEach((el, i) => el.classList.toggle('active', i === active));
  }

  function drawWaveform(selector, t, color, ampScale = 1) {
    const canvas = $(selector);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.clientWidth, height = canvas.clientHeight, scale = canvas.width / width;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const frame = Math.min(state.data.waveform.length - 1, Math.max(0, Math.floor(t * state.project.format.fps)));
    const amp = (.18 + .82 * state.data.waveform[frame]) * ampScale;
    const gradient = ctx.createLinearGradient(0, height * .18, 0, height * .86);
    if (color === 'amber') {
      gradient.addColorStop(0, 'rgba(255,190,104,.98)');
      gradient.addColorStop(.5, 'rgba(255,171,76,.88)');
      gradient.addColorStop(1, 'rgba(5,34,53,.14)');
    } else {
      gradient.addColorStop(0, 'rgba(119,232,255,.98)');
      gradient.addColorStop(.5, 'rgba(39,214,255,.9)');
      gradient.addColorStop(1, 'rgba(5,38,58,.12)');
    }
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 5.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    const count = Math.round(width / 7);
    for (let i = 0; i < count; i++) {
      const x = i / (count - 1) * width;
      const env = Math.sin(Math.PI * i / (count - 1)) ** .45;
      const y = height / 2 + (Math.sin(i * .82 + t * 7.7) + .38*Math.sin(i * 1.91 - t * 4.2)) * height * .25 * amp * env;
      if (i === 0) ctx.moveTo(x,y);
      else ctx.lineTo(x,y);
    }
    ctx.stroke();
  }

  function moveDot(pathKey, dotSelector, t, speed, offset = 0) {
    const p = state.paths[pathKey];
    if (!p) return;
    const q = ((t * speed + offset) % 1 + 1) % 1;
    const pt = p.node.getPointAtLength(q * p.len);
    const el = $(dotSelector);
    if (el) el.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
  }

  /* Procedural Graphics for Generic Visuals */
  function drawGenericVisual(ctx, type, t, width, height) {
    ctx.clearRect(0, 0, width, height);
    
    // Fetch theme colors
    const bodyStyles = getComputedStyle(document.body);
    const cyan = bodyStyles.getPropertyValue('--cyan').trim() || '#27d6ff';
    const amber = bodyStyles.getPropertyValue('--amber').trim() || '#ffab4c';
    const line = bodyStyles.getPropertyValue('--line').trim() || '#45647b';
    const white = bodyStyles.getPropertyValue('--white').trim() || '#f5f9fc';

    if (type === 'waves') {
      // 1. Two Waves Cancelling / Interfering
      const midY = height / 2;
      const waveAmp = height * 0.18;
      
      // Wave 1 (Cyan)
      ctx.strokeStyle = cyan;
      ctx.lineWidth = 6;
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const y = midY - 60 + Math.sin(x * 0.015 + t * 6) * waveAmp * 0.7;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Wave 2 (Amber)
      ctx.strokeStyle = amber;
      ctx.lineWidth = 6;
      ctx.beginPath();
      // Interference phase shifts over time
      const phaseShift = Math.PI * (1 + 0.5 * Math.sin(t * 0.5));
      for (let x = 0; x < width; x++) {
        const y = midY + 60 + Math.sin(x * 0.015 + t * 6 + phaseShift) * waveAmp * 0.7;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Sum Wave (White)
      ctx.strokeStyle = white;
      ctx.lineWidth = 8;
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const y1 = Math.sin(x * 0.015 + t * 6) * waveAmp * 0.7;
        const y2 = Math.sin(x * 0.015 + t * 6 + phaseShift) * waveAmp * 0.7;
        if (x === 0) ctx.moveTo(x, midY + y1 + y2); else ctx.lineTo(x, midY + y1 + y2);
      }
      ctx.stroke();

    } else if (type === 'network') {
      // 2. Mycelium / Synapse Network nodes
      const nodes = [
        { x: width * 0.2, y: height * 0.3, label: 'Node A' },
        { x: width * 0.5, y: height * 0.2, label: 'Node B' },
        { x: width * 0.8, y: height * 0.4, label: 'Node C' },
        { x: width * 0.35, y: height * 0.65, label: 'Node D' },
        { x: width * 0.65, y: height * 0.75, label: 'Node E' }
      ];
      const links = [[0, 1], [0, 3], [1, 2], [1, 3], [2, 4], [3, 4]];

      // Draw Links
      ctx.strokeStyle = line;
      ctx.lineWidth = 4;
      links.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(nodes[a].x, nodes[a].y);
        ctx.lineTo(nodes[b].x, nodes[b].y);
        ctx.stroke();
      });

      // Animated Signals flowing along links
      ctx.fillStyle = cyan;
      links.forEach(([a, b], idx) => {
        const progress = ((t * 0.4 + idx * 0.15) % 1.0);
        const nx = nodes[a].x + (nodes[b].x - nodes[a].x) * progress;
        const ny = nodes[a].y + (nodes[b].y - nodes[a].y) * progress;
        ctx.beginPath();
        ctx.arc(nx, ny, 10, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Nodes
      nodes.forEach((n) => {
        ctx.fillStyle = '#0b2033';
        ctx.strokeStyle = white;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = white;
        ctx.font = 'bold 18px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.x, n.y - 36);
      });

    } else if (type === 'orbit') {
      // 3. Cosmic Gravity Well / Satellite orbits
      const cx = width / 2, cy = height / 2;
      
      // Gravity contours (expanding rings)
      ctx.strokeStyle = line;
      ctx.lineWidth = 2;
      for (let r = 80; r < 360; r += 50) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Gravitational warp visualizer lines
      ctx.strokeStyle = line;
      ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
        ctx.moveTo(cx + Math.cos(angle) * 60, cy + Math.sin(angle) * 60);
        ctx.lineTo(cx + Math.cos(angle) * 360, cy + Math.sin(angle) * 360);
      }
      ctx.stroke();

      // Core (Black hole / Earth)
      const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, 60);
      gradient.addColorStop(0, '#000000');
      gradient.addColorStop(0.7, cyan);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, 60, 0, Math.PI * 2);
      ctx.fill();

      // Orbiting Satellite/Time body
      const orbitRadius = 230;
      const sx = cx + Math.cos(t * 1.5) * orbitRadius;
      const sy = cy + Math.sin(t * 1.5) * orbitRadius;

      ctx.fillStyle = amber;
      ctx.beginPath();
      ctx.arc(sx, sy, 16, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = white;
      ctx.lineWidth = 3;
      ctx.stroke();

    } else if (type === 'flow') {
      // 4. Magnus effect airflow / fluid streamlines
      const spacing = 45;
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      ctx.strokeStyle = line;
      ctx.lineWidth = 3;
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const x = c * spacing;
          const y = r * spacing;
          // Magnus spin creates a vortex warp at center (cx, cy)
          const dx = x - width / 2;
          const dy = y - height / 2;
          const dist = Math.sqrt(dx*dx + dy*dy) + 1;
          const angle = Math.atan2(dy, dx);
          
          // Warp stream coordinates dynamically
          const warpStrength = 1500 / dist;
          const wx = x + Math.cos(angle + Math.PI/2) * warpStrength * Math.sin(t * 2);
          const wy = y + Math.sin(angle + Math.PI/2) * warpStrength * Math.cos(t * 2);

          if (c === 0) ctx.moveTo(wx, wy); else ctx.lineTo(wx, wy);
        }
        ctx.stroke();
      }

      // Spinning Cylinder
      ctx.fillStyle = amber;
      ctx.beginPath();
      ctx.arc(width/2, height/2, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = white;
      ctx.lineWidth = 5;
      ctx.stroke();

      // Spin indicator arrow
      ctx.strokeStyle = cyan;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(width/2, height/2, 70, t * 4, t * 4 + Math.PI * 1.2);
      ctx.stroke();

    } else if (type === 'particles') {
      // 5. Molecular lattice vibrations (Mpemba / Chemistry)
      const rows = 5, cols = 5;
      const xSpacing = width / (cols + 1);
      const ySpacing = height / (rows + 1);
      
      // Determine vibration intensity from active script segment
      const intensity = 3.5 + 4.5 * Math.sin(t * 3.5) ** 2;

      // Draw Bonds
      ctx.strokeStyle = line;
      ctx.lineWidth = 4;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x1 = xSpacing * (c + 1) + Math.sin(t * 12 + r * 5) * intensity;
          const y1 = ySpacing * (r + 1) + Math.cos(t * 10 + c * 4) * intensity;
          
          if (c < cols - 1) {
            const x2 = xSpacing * (c + 2) + Math.sin(t * 12 + r * 5) * intensity;
            const y2 = ySpacing * (r + 1) + Math.cos(t * 10 + (c + 1) * 4) * intensity;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
          if (r < rows - 1) {
            const x2 = xSpacing * (c + 1) + Math.sin(t * 12 + (r + 1) * 5) * intensity;
            const y2 = ySpacing * (r + 2) + Math.cos(t * 10 + c * 4) * intensity;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }

      // Draw Atoms
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = xSpacing * (c + 1) + Math.sin(t * 12 + r * 5) * intensity;
          const y = ySpacing * (r + 1) + Math.cos(t * 10 + c * 4) * intensity;

          ctx.fillStyle = (r + c) % 2 === 0 ? cyan : amber;
          ctx.beginPath();
          ctx.arc(x, y, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = white;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      }

    } else if (type === 'console') {
      // 6. Typographic Binary Terminal scrolling lines
      ctx.fillStyle = cyan;
      ctx.font = 'bold 26px "Courier New", Courier, monospace';
      ctx.textAlign = 'left';

      const lines = [
        `[SYSTEM EXECUTION DETECTED]`,
        `TIME_DILATION_RELATIVITY_SEC: ${t.toFixed(4)}`,
        `GRAVITY_WELL_CONSTANT: 9.80665`,
        `QUANTUM_ZENO_INTERVAL: ${Math.sin(t*5).toFixed(6)}`,
        `CORRECTION_VECTOR: [${Math.cos(t).toFixed(3)}, ${Math.sin(t).toFixed(3)}]`,
        `STATUS: SYNCHRONIZING CLOCKS...`,
        `SAT_GPS_DRIFT_COMPENSATION: +38.6 μs/day`,
        `DECAY_STATE: OBSERVATION_ACTIVE`
      ];

      const visibleLines = Math.floor(t * 2) % (lines.length + 1);
      for (let i = 0; i < visibleLines; i++) {
        ctx.fillText(`> ${lines[i % lines.length]}`, 60, 100 + i * 50);
      }
      // Blinking cursor
      if (Math.floor(t * 3) % 2 === 0) {
        ctx.fillRect(60 + (lines[visibleLines % lines.length] || '').length * 15.6, 100 + (visibleLines % lines.length) * 50 - 24, 15, 28);
      }
    }
  }

  function updateDynamic(t) {
    if (state.project.generic) {
      // Draw procedural generic visualizer
      const s = sceneAt(t);
      const canvas = $('#generic-canvas');
      if (canvas && s.visual) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width, height = canvas.height;
        drawGenericVisual(ctx, s.visual.type, t, width, height);
      }
      return;
    }

    // Legacy voice-recorder animations
    drawWaveform('#hook-wave-canvas', t, 'cyan');
    drawWaveform('#chain-wave-canvas', t, 'amber', .8);
    moveDot('routesAir', '#routes-air-dot', t, .28);
    moveDot('routesBone', '#routes-bone-dot', t, .25, .2);
    moveDot('air', '#air-dot', t, .30, .1);
    moveDot('bone', '#bone-dot', t, .28, .35);
    moveDot('micAir', '#mic-air-dot', t, .32, .1);
  }

  function visible(el) {
    const s = getComputedStyle(el);
    return s.visibility !== 'hidden' && Number(s.opacity) > .025 && el.getBoundingClientRect().width > 0;
  }

  function validateFrame() {
    const errors = [];
    const isHorizontal = state.project.format.width > state.project.format.height;
    const exclusionTop = isHorizontal ? 1079 : 1498;
    const rightSafe = isHorizontal ? 1919 : 900;
    document.querySelectorAll('[data-critical]').forEach(el => {
      if (!visible(el)) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > exclusionTop + .5) errors.push(`${el.id || el.className}: bottom ${r.bottom.toFixed(1)} > ${exclusionTop}`);
      if (r.right > rightSafe + .5) errors.push(`${el.id || el.className}: right ${r.right.toFixed(1)} > ${rightSafe}`);
      if (r.left < -.5 || r.top < -.5) errors.push(`${el.id || el.className}: outside viewport`);
      const zone = el.closest('#header-zone,#visual-zone,#caption-zone');
      if (zone) {
        const z = zone.getBoundingClientRect();
        if (r.top < z.top - .5 || r.bottom > z.bottom + .5) errors.push(`${el.id || el.className}: leaves ${zone.id}`);
      }
    });
    document.querySelectorAll('[data-text]').forEach(el => {
      if (visible(el) && (el.scrollWidth > el.clientWidth + 8 || el.scrollHeight > el.clientHeight + 8)) errors.push(`${el.id || el.className}: text overflow ${el.scrollWidth}×${el.scrollHeight} in ${el.clientWidth}×${el.clientHeight}`);
    });
    const cap = $('#caption-text');
    if (visible(cap)) {
      const lh = parseFloat(getComputedStyle(cap).lineHeight);
      if (cap.getBoundingClientRect().height > lh * 2.25) errors.push('caption exceeds two lines');
    }
    return errors;
  }

  window.initVideo = async payload => {
    state.project = payload.project;
    state.data = payload.processed;

    // Dynamically size viewport wrapper
    document.documentElement.style.setProperty('--video-width', `${state.project.format.width}px`);
    document.documentElement.style.setProperty('--video-height', `${state.project.format.height}px`);

    const isHorizontal = state.project.format.width > state.project.format.height;
    document.body.classList.toggle('horizontal-16-9', isHorizontal);
    document.body.classList.toggle('vertical-9-16', !isHorizontal);

    if (state.project.generic) {
      // Generic configuration
      document.body.className = `theme-${state.project.theme} ${isHorizontal ? 'horizontal-16-9' : 'vertical-9-16'}`;
      
      // Inject local drawing canvas inside stage sized to active aspect ratio
      const stage = $('#generic-stage');
      const cw = isHorizontal ? 1600 : 844;
      const ch = isHorizontal ? 700 : 760;
      stage.innerHTML = `<canvas id="generic-canvas" class="generic-canvas" width="${cw}" height="${ch}"></canvas>`;
      
      // Set footer rail
      const footer = $('#generic-footer');
      if (state.project.footer_rail) {
        footer.style.display = 'flex';
        footer.innerHTML = state.project.footer_rail.map(step => `<span>${step}</span>`).join('<b>›</b>');
      } else {
        footer.style.display = 'none';
      }

      // Hide all standard visual articles
      document.querySelectorAll('.scene:not(.generic-scene)').forEach(el => el.style.display = 'none');
      $('#generic-visuals').style.display = 'flex';
    } else {
      // Legacy Voice video setup
      $('#hero-image').src = payload.assetUrls.hero;
      $('#closing-image').src = payload.assetUrls.closing;
      setupSpectrum('#private-spectrum', true);
      setupSpectrum('#recording-spectrum', false);
      prepPath('#routes-air-path', 'routesAir');
      prepPath('#routes-bone-path', 'routesBone');
      prepPath('#air-main-path', 'air');
      prepPath('#bone-main-path', 'bone');
      prepPath('#mic-air-path', 'micAir');
    }

    await Promise.all(Array.from(document.images).map(img => img.decode().catch(() => {})));
    await document.fonts.ready;
    buildTimeline();
    window.renderAt(0);
    return true;
  };

  window.renderAt = t => {
    const clamped = Math.max(0, Math.min(state.project.format.duration - .0001, t));
    state.timeline.seek(clamped, false);
    updateHeader(clamped);
    updateCaption(clamped);
    updateDynamic(clamped);
    return true;
  };

  window.validateFrame = validateFrame;
  window.factoryReady = true;
})();
