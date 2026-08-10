'use strict';

/* ═══════════════════════════════════════════════════════════
   site-thought.js — renders the "Latest thought" section.
   Single responsibility: one section, one function.
═══════════════════════════════════════════════════════════ */
function renderThought(thought) {
  if (!thought) {
    $('thought-date').textContent    = '';
    $('thought-title').textContent   = 'No notes found';
    $('thought-preview').textContent = 'Set notes_api in config.yml to a GitHub folder of .md files.';
    $('thought-link').style.display  = 'none';
    return;
  }

  const timeEl = $('thought-date');
  timeEl.textContent = fmtDate(thought.date);
  timeEl.setAttribute('datetime', isoDate(thought.date));

  $('thought-title').textContent   = thought.title;
  $('thought-preview').textContent = thought.preview;

  const linkEl = $('thought-link');
  linkEl.href = thought.link;
  if (thought.link.startsWith('http')) linkEl.setAttribute('target', '_blank');
}
