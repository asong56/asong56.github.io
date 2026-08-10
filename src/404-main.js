'use strict';

/* ═══════════════════════════════════════════════════════════
   404-main.js — entry point only.
   Reads config.yml's not_found block, then hands off to
   the typewriter and the project loader. No rendering logic
   lives here.
═══════════════════════════════════════════════════════════ */
const DEFAULT_404_CFG = {
  intro_lines: [
    'looking for that page...',
    '— not here.',
    "here's something else instead.",
  ],
  type_speed: 55,
  line_pause: 400,
  dissolve_duration: 1400,
};

(async function init() {
  let cfg = {};
  try {
    const raw = await fetch('config.yml').then(r => r.text());
    cfg = parseYaml(raw);
  } catch (e) {
    console.warn('config.yml not found, using defaults', e);
  }

  const nf = Object.assign({}, DEFAULT_404_CFG, cfg.not_found || {});
  nf.intro_lines = Array.isArray(nf.intro_lines) ? nf.intro_lines : DEFAULT_404_CFG.intro_lines;
  nf.type_speed  = Number(nf.type_speed)  || DEFAULT_404_CFG.type_speed;
  nf.line_pause  = Number(nf.line_pause)  || DEFAULT_404_CFG.line_pause;
  nf.dissolve_duration = Number(nf.dissolve_duration) || DEFAULT_404_CFG.dissolve_duration;

  runIntro(nf);          // src/404-typewriter.js
  initWanderButton();    // src/404-projects.js
  loadHiddenProjects();  // src/404-projects.js
})();
