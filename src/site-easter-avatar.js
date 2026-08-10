'use strict';

/* ═══════════════════════════════════════════════════════════
   site-easter-avatar.js — click-the-avatar-3x secret.
   index.txt §16. Single responsibility: this one easter egg.
═══════════════════════════════════════════════════════════ */
function initAvatarEasterEgg() {
  const avatar = $('gh-avatar');
  let clicks = 0;
  let resetTimer = null;

  avatar.addEventListener('click', () => {
    clicks++;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => { clicks = 0; }, 1500);

    if (clicks >= 3) {
      clicks = 0;
      showAvatarSecret();
    }
  });
}

function showAvatarSecret() {
  const overlay = el('section', {
    class: 'avatar-secret-overlay',
    role: 'dialog',
    'aria-label': 'Secret message',
  });
  const msg = el('p', { class: 'avatar-secret-text' }, 'you found the secret. hi. 👋');
  overlay.appendChild(msg);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}
