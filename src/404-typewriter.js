'use strict';

/* ═══════════════════════════════════════════════════════════
   404-typewriter.js — types config-driven lines into the
   intro overlay, then hands off to the particle dissolve.
   Single responsibility: text animation only.
═══════════════════════════════════════════════════════════ */
function runIntro(nf) {
  const intro = document.getElementById('intro');
  const term  = document.getElementById('intro-terminal');

  const lines = nf.intro_lines;
  let lineIdx = 0;
  let charIdx = 0;

  function typeNextChar() {
    const line = lines[lineIdx];

    if (charIdx <= line.length) {
      const built = lines.slice(0, lineIdx).join('\n') +
                    (lineIdx > 0 ? '\n' : '') +
                    line.slice(0, charIdx);
      term.textContent = built;
      term.appendChild(cursorEl());
      charIdx++;
      setTimeout(typeNextChar, nf.type_speed);
      return;
    }

    lineIdx++;
    charIdx = 0;

    if (lineIdx < lines.length) {
      setTimeout(typeNextChar, nf.line_pause);
    } else {
      setTimeout(() => finishIntro(intro, nf), nf.line_pause);
    }
  }

  function cursorEl() {
    const c = document.createElement('i');
    c.id = 'intro-cursor';
    c.setAttribute('aria-hidden', 'true');
    return c;
  }

  typeNextChar();
}

function finishIntro(intro, nf) {
  startParticles(nf.dissolve_duration); // defined in 404-particles.js

  const exitDelay = Math.max(300, nf.dissolve_duration * 0.4);
  setTimeout(() => {
    intro.classList.add('done');
    intro.addEventListener('animationend', () => intro.remove(), { once: true });
  }, exitDelay);
}
