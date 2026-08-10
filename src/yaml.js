'use strict';

/* ═══════════════════════════════════════════════════════════
   yaml.js — tiny YAML parser (subset: only what config.yml needs)
   Single responsibility: parse text → object. Nothing else.
═══════════════════════════════════════════════════════════ */
function parseYaml(text) {
  const lines  = text.split('\n');
  const result = {};
  const stack  = [{ obj: result, indent: -1 }];
  const clean  = (s) => s.replace(/#.*$/, '').trimEnd();

  let i = 0;
  while (i < lines.length) {
    const raw  = lines[i];
    const line = clean(raw);
    if (!line.trim()) { i++; continue; }

    const indent  = raw.length - raw.trimStart().length;
    const trimmed = line.trim();

    if (trimmed.startsWith('- ')) {
      const val = trimmed.slice(2).trim().replace(/^["']|["']$/g, '');
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
      const parent  = stack[stack.length - 1].obj;
      const keys    = Object.keys(parent);
      const lastKey = keys[keys.length - 1];
      if (lastKey && !Array.isArray(parent[lastKey])) parent[lastKey] = [];
      if (lastKey) parent[lastKey].push(val);
      i++;
      continue;
    }

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) { i++; continue; }

    const key = trimmed.slice(0, colonIdx).trim();
    const val = trimmed.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
    const parent = stack[stack.length - 1].obj;

    if (val === '') {
      parent[key] = {};
      stack.push({ obj: parent[key], indent });
    } else {
      parent[key] = val;
    }
    i++;
  }
  return result;
}
