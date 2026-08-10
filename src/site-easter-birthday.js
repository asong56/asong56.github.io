'use strict';

/* ═══════════════════════════════════════════════════════════
   site-easter-birthday.js — first-visit-on-birthday confetti.
   index.txt §15. Single responsibility: this one easter egg.
═══════════════════════════════════════════════════════════ */
function initBirthdayConfetti() {
  const BIRTHDAY_MONTH_DAY = '01-01'; // MM-DD — set to actual birthday
  const today = new Date();
  const md = String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

  if (md !== BIRTHDAY_MONTH_DAY) return;
  if (localStorage.getItem('birthday-confetti-shown')) return;

  localStorage.setItem('birthday-confetti-shown', '1');
  fireConfetti(3);
}

function fireConfetti(bursts) {
  for (let b = 0; b < bursts; b++) {
    setTimeout(() => confettiBurst(), b * 450);
  }
}

function confettiBurst() {
  const canvas = el('canvas', { class: 'confetti-canvas' });
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const colors = ['#b5602f', '#5c574d', '#8a8377', '#1c1a16'];
  const particles = Array.from({ length: 60 }, () => ({
    x: canvas.width / 2 + (Math.random() - 0.5) * 200,
    y: canvas.height / 3,
    vx: (Math.random() - 0.5) * 8,
    vy: Math.random() * -6 - 2,
    size: 4 + Math.random() * 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI,
  }));

  let start = null;
  function frame(ts) {
    if (!start) start = ts;
    const t = ts - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.25; p.rot += 0.1;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });
    if (t < 2200) requestAnimationFrame(frame);
    else canvas.remove();
  }
  requestAnimationFrame(frame);
}
