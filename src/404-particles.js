'use strict';

/* ═══════════════════════════════════════════════════════════
   404-particles.js — canvas particle dissolve effect only.
   Single responsibility: the intro text scattering into dots.
═══════════════════════════════════════════════════════════ */
function startParticles(duration) {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');
  const dpr    = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width  = window.innerWidth  * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width  = window.innerWidth  + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.scale(dpr, dpr);

  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;

  canvas.classList.add('active');

  const COUNT = 160;
  const particles = Array.from({ length: COUNT }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.6 + Math.random() * 2.2;
    const size  = 1 + Math.random() * 2.4;
    const l     = Math.floor(40 + Math.random() * 35);
    return {
      x: cx + (Math.random() - 0.5) * 360,
      y: cy + (Math.random() - 0.5) * 140,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.3,
      size,
      alpha: 0.55 + Math.random() * 0.4,
      color: `oklch(${l}% 0.01 260)`,
    };
  });

  let startTime = null;

  function frame(ts) {
    if (!startTime) startTime = ts;
    const t = Math.min((ts - startTime) / duration, 1);

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.018;
      p.alpha *= 0.985;

      ctx.globalAlpha = p.alpha * (1 - t);
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      canvas.classList.remove('active');
    }
  }

  requestAnimationFrame(frame);
}
