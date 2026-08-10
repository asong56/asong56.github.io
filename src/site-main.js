'use strict';

/* ═══════════════════════════════════════════════════════════
   site-main.js — entry point only.
   Loads generated.json, then hands data to each single-
   purpose renderer. No rendering logic lives here.
═══════════════════════════════════════════════════════════ */
(async function init() {
  let data;
  try {
    data = await fetch('generated.json').then(r => r.json());
  } catch (e) {
    console.error('generated.json load failed', e);
    return;
  }

  applySeason();

  renderIdentity(data.github.user);
  renderCommits(data.github.repos);
  renderFeatured(data.github.repos, data.github.featured_ids);
  renderRecommended(data.hidden_pool);
  renderTicker(data.github.repos);

  renderThought(data.thought);
  renderMusic(data.music);
  renderConnect(data.github.user, data.links);

  initAvatarEasterEgg();
  initBirthdayConfetti();
})();
