'use strict';

/* ═══════════════════════════════════════════════════════════
   site-connect.js — renders the "Connect" footer section
   and its terminal printer effect. Single responsibility.
═══════════════════════════════════════════════════════════ */
function renderConnect(user, extraLinks) {
  const list = $('connect-list');
  list.innerHTML = '';

  const all = [
    { label: 'GitHub', href: user ? user.html_url : '#' },
    ...(extraLinks || []),
  ];

  all.forEach(({ label, href }) => {
    const li = el('li');
    li.appendChild(el('a', { href, target: '_blank', rel: 'noopener' }, label));
    list.appendChild(li);
  });

  typePrompt(all.map(l => l.label.toLowerCase()));
}

/* printer effect: types the link list into the $ prompt line */
function typePrompt(labels) {
  const output = $('prompt-output');
  const line   = 'echo ' + labels.join(' ');
  let i = 0;
  (function type() {
    output.textContent = line.slice(0, i);
    i++;
    if (i <= line.length) setTimeout(type, 28);
  })();
}
