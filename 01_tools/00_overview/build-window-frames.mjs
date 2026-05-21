// Build the Local Intelligence Packet's own window — a bundled HTML file demonstrating
// the packet using its own machinery (Company Website lens pattern).
//
// Run from anywhere: node 01_tools/00_overview/build-window-frames.mjs
// Output: Getting Started.html (packet root, two levels up from this script)
//
// Flags:
//   --force    bypass drift-protection preflight (use after reconciling sources)

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));   // 01_tools/00_overview/
const TOOLS_ROOT = path.resolve(__dirname, '..');                  // 01_tools/
const PACKET_ROOT = path.resolve(__dirname, '..', '..');           // Local Brain/
const LENSES_DIR = path.join(TOOLS_ROOT, '01_lenses');
const OUT = path.join(PACKET_ROOT, 'Getting Started.html');
const MANIFEST = path.join(__dirname, 'BUILD-MANIFEST.yaml');

const FORCE = process.argv.includes('--force');

// ─── Drift protection ───────────────────────────────────────────────────────
// Getting Started.html has been regenerated from stale source files multiple
// times, clobbering the user's inline edits (2026-04-21: +25KB in welcome,
// -15KB in workflow, +6KB in about had accumulated in the output but never
// made it back to source). This preflight aborts if the output was touched
// more recently than the manifest's last-built timestamp — a signal that
// someone edited Getting Started.html directly and the source files may
// not yet reflect those changes. Run with --force to override.
function sha1(s) { return crypto.createHash('sha1').update(s).digest('hex'); }
function readManifest() {
  if (!fs.existsSync(MANIFEST)) return null;
  const txt = fs.readFileSync(MANIFEST, 'utf-8');
  const m = {};
  for (const line of txt.split('\n')) {
    const km = line.match(/^([a-z-]+):\s*(.*)$/i);
    if (km) m[km[1]] = km[2].trim().replace(/^["']|["']$/g, '');
  }
  return m;
}
function preflight() {
  const manifest = readManifest();
  if (!fs.existsSync(OUT)) return; // first build
  const outStat = fs.statSync(OUT);
  const outMtime = outStat.mtime.getTime();
  if (!manifest || !manifest['last-built']) {
    console.error('\n⚠  No BUILD-MANIFEST.yaml found next to Getting Started.html.');
    console.error('   Output exists but was not built by the manifest-aware build.');
    console.error('   It may contain edits that would be lost by rebuild.');
    console.error(`   Current output mtime: ${outStat.mtime.toISOString()}`);
    console.error('');
    console.error('   If source files (welcome/workflow/about/lens-catalog) are CURRENT,');
    console.error('   rerun with --force to build and create a manifest.');
    console.error('   If not, reconcile source first (extract srcdocs from the output).');
    if (!FORCE) process.exit(1);
    return;
  }
  const lastBuilt = new Date(manifest['last-built']).getTime();
  const driftMs = outMtime - lastBuilt;
  if (driftMs > 5000) {
    const driftMin = Math.round(driftMs / 60000);
    console.error(`\n⚠  Getting Started.html was modified ${driftMin} min after last build.`);
    console.error(`   Last built: ${manifest['last-built']}`);
    console.error(`   Output mtime: ${outStat.mtime.toISOString()}`);
    console.error('');
    console.error('   Someone likely edited the output directly. Rebuilding will clobber');
    console.error('   those edits unless the source files have been reconciled first.');
    console.error('');
    console.error('   Next steps:');
    console.error('   1. Inspect the output for frame-level differences from current source.');
    console.error('   2. If the output has edits to preserve: extract frame srcdocs, write');
    console.error('      back to source files, THEN rerun with --force.');
    console.error('   3. If edits are stale or undesired: rerun with --force to overwrite.');
    if (!FORCE) process.exit(1);
  }
}
// ────────────────────────────────────────────────────────────────────────────

// CANONICAL FRAME SHAPE — 4 tabs. Do NOT add Setup or Get Started back unless
// the user explicitly asks. The welcome frame IS the getting-started content.
// Changed 2026-04-21 after discovering rebuilds were repeatedly restoring a
// stale 6-tab shape that had been pruned in the canonical Getting Started.html.
const FRAMES = [
  { id: 'frame-welcome',     file: path.join(LENSES_DIR, 'welcome.html'),      label: 'Getting Started' },
  { id: 'frame-lenses',      file: path.join(__dirname, 'lens-catalog.html'),  label: 'Lenses' },
  { id: 'frame-workflow',    file: path.join(LENSES_DIR, 'workflow.html'),     label: 'Workflows' },
  { id: 'frame-about',       file: path.join(LENSES_DIR, 'about.html'),        label: 'About' },
];

function escapeForSrcdoc(html) {
  return html.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

// Example frames embedded as <template> content inside the lens catalog
// (so View buttons in the catalog can preview each lens in a modal)
const EXAMPLE_FRAMES = {
  EXAMPLE_PITCH:              path.join(LENSES_DIR, '_examples', 'example-pitch.html'),
};

// Depth-first resolver: each payload file gets its own nested placeholders resolved
// (each recursive child base64-encoded) BEFORE the payload itself is encoded.
function resolveFile(filePath, stack = new Set()) {
  if (stack.has(filePath)) {
    console.warn(`  WARN: circular include for ${filePath} — returning empty`);
    return '';
  }
  if (!fs.existsSync(filePath)) {
    console.warn(`  WARN: missing file ${filePath}`);
    return '';
  }
  stack.add(filePath);
  let content = fs.readFileSync(filePath, 'utf-8');
  for (const [token, childPath] of Object.entries(EXAMPLE_FRAMES)) {
    const placeholder = `{{${token}}}`;
    if (!content.includes(placeholder)) continue;
    const childResolved = resolveFile(childPath, stack);
    const childB64 = Buffer.from(childResolved, 'utf-8').toString('base64');
    content = content.split(placeholder).join(childB64);
  }
  stack.delete(filePath);
  return content;
}

function injectExamples(html) {
  let out = html;
  for (const [token, filePath] of Object.entries(EXAMPLE_FRAMES)) {
    const placeholder = `{{${token}}}`;
    if (!out.includes(placeholder)) continue;
    if (!fs.existsSync(filePath)) {
      console.warn(`  WARN: example missing for ${token} — leaving placeholder`);
      continue;
    }
    const resolved = resolveFile(filePath);
    const b64 = Buffer.from(resolved, 'utf-8').toString('base64');
    out = out.split(placeholder).join(b64);
  }
  return out;
}

// Run preflight BEFORE loading any source — if we're about to clobber user
// edits, abort early rather than waste cycles building.
preflight();

const frameSrcdocs = FRAMES.map(f => {
  let html = fs.readFileSync(f.file, 'utf-8');
  if (f.id === 'frame-lenses') html = injectExamples(html);
  return { ...f, srcdoc: escapeForSrcdoc(html), sourceHash: sha1(html) };
});

const shareableHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Local Intelligence Packet</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Aldrich&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root {
  --font-display: "Plus Jakarta Sans", system-ui, sans-serif;
  --font-retro: "Aldrich", monospace;
  --font-mono: "JetBrains Mono", monospace;
  --ink: #1f1d1a;
  --ink-soft: #44403c;
  --ink-muted: #6e6760;
  --paper: #faf6ee;
  --paper-warm: #f5eede;
  --paper-deep: #ece1c7;
  --sage: #6fa67f;
  --sage-deep: #1f5028;
  --sage-soft: #dcebd7;
  --butter: #f5d88e;
  --rule: #d8cfb8;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; overflow: hidden; }
body { font-family: var(--font-display); background: var(--paper); color: var(--ink); -webkit-font-smoothing: antialiased; display: flex; flex-direction: column; }

.skip-link { position: absolute; top: -40px; left: 0; padding: 8px 16px; background: var(--sage-deep); color: #fff; font-family: var(--font-mono); font-size: 12px; z-index: 2000; text-decoration: none; transition: top 0.2s; }
.skip-link:focus { top: 0; }

.nav-bar {
  display: flex; align-items: stretch; justify-content: space-between;
  height: 60px; min-height: 60px;
  background: rgba(250, 246, 238, 0.96); backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--rule);
  padding: 0 20px;
  position: relative; z-index: 100;
  gap: 12px;
}
.brand-block { display: flex; align-items: center; }
.brand { font-family: var(--font-display); font-weight: 700; font-size: 1.05rem; letter-spacing: -0.01em; color: var(--ink); text-decoration: none; }
.brand:hover, .brand:focus { text-decoration: none; }
.brand .accent { color: var(--sage-deep); }

.nav-right { display: flex; align-items: stretch; gap: 24px; }
.tab-bar { display: flex; align-items: stretch; gap: 2px; }
.tab-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 0 14px;
  font-family: var(--font-display); font-size: 14px; font-weight: 600;
  color: var(--ink-soft);
  background: transparent; border: none;
  border-bottom: 2.5px solid transparent;
  cursor: pointer;
  transition: color 0.18s, border-color 0.18s, background 0.18s;
  white-space: nowrap; text-decoration: none;
}
.tab-btn:hover { color: var(--ink); background: rgba(31, 29, 26, 0.05); }
.tab-btn:focus-visible { outline: 2px solid var(--sage-deep); outline-offset: -2px; border-radius: 2px; }
.tab-btn.active { color: var(--sage-deep); border-bottom-color: var(--sage-deep); }

.cta-btn {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--font-display); font-weight: 700; font-size: 13px;
  padding: 8px 14px; margin: auto 0;
  border-radius: 6px;
  border: 2px solid var(--ink); background: var(--sage); color: var(--ink);
  cursor: pointer; text-decoration: none;
  box-shadow: 2px 2px 0 var(--ink);
  transition: transform 120ms ease, box-shadow 120ms ease;
  white-space: nowrap; align-self: center;
}
.cta-btn:hover { transform: translate(-1px, -1px); box-shadow: 3px 3px 0 var(--ink); text-decoration: none; }
.cta-btn:active { transform: translate(1px, 1px); box-shadow: 0 0 0 var(--ink); }

.menu-toggle { display: none; align-items: center; justify-content: center; width: 40px; height: 40px; background: transparent; border: 1.5px solid var(--ink); border-radius: 6px; cursor: pointer; margin: auto 0; align-self: center; }
.menu-toggle .bars { display: flex; flex-direction: column; gap: 4px; }
.menu-toggle .bars span { display: block; width: 18px; height: 2px; background: var(--ink); border-radius: 2px; }

.mobile-sheet { display: none; position: absolute; top: 60px; left: 0; right: 0; background: var(--paper); border-bottom: 1px solid var(--rule); box-shadow: 0 12px 32px -8px rgba(31, 29, 26, 0.22); padding: 12px; z-index: 90; }
.mobile-sheet[data-open="true"] { display: block; }
.mobile-sheet button, .mobile-sheet a { display: block; width: 100%; text-align: left; padding: 14px 16px; font-family: var(--font-display); font-size: 15px; font-weight: 600; color: var(--ink); background: transparent; border: none; border-radius: 6px; text-decoration: none; cursor: pointer; }
.mobile-sheet button.active { color: var(--sage-deep); background: var(--sage-soft); }
.mobile-sheet button:hover, .mobile-sheet a:hover { background: rgba(31, 29, 26, 0.05); }
.mobile-sheet .cta-row { margin-top: 10px; padding: 12px; border-top: 1px solid var(--rule); }

.frame-container { flex: 1; position: relative; overflow: hidden; background: var(--paper); }
.frame-container iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; background: var(--paper); display: none; }
.frame-container iframe.active { display: block; }

@media (max-width: 720px) {
  .nav-bar { padding: 0 14px; height: 56px; min-height: 56px; }
  .nav-right { display: none; }
  .menu-toggle { display: flex; }
  .brand { font-size: 1rem; }
  .mobile-sheet { top: 56px; }
}
</style>
</head>
<body>

<a href="#frame-container" class="skip-link">Skip to content</a>

<header class="nav-bar">
  <div class="brand-block">
    <a href="#" class="brand" id="brand-link" aria-label="Local Intelligence Packet — home">Local Intelligence<span class="accent"> Packet</span></a>
  </div>

  <div class="nav-right">
    <nav class="tab-bar" role="tablist" aria-label="Packet pages">
${FRAMES.map((f, i) => `      <button class="tab-btn${i === 0 ? ' active' : ''}" role="tab" data-frame="${f.id}" aria-selected="${i === 0 ? 'true' : 'false'}">${f.label}</button>`).join('\n')}
    </nav>

    <a href="#" class="cta-btn" id="cta-start">Get Started <span aria-hidden="true">→</span></a>
  </div>

  <button class="menu-toggle" id="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-sheet">
    <span class="bars"><span></span><span></span><span></span></span>
  </button>
</header>

<div class="mobile-sheet" id="mobile-sheet" data-open="false">
${FRAMES.map((f, i) => `  <button data-frame="${f.id}"${i === 0 ? ' class="active"' : ''}>${f.label}</button>`).join('\n')}
  <div class="cta-row">
    <a href="#" class="cta-btn" id="cta-start-mobile" style="display:flex; justify-content:center; width:100%;">Get Started →</a>
  </div>
</div>

<div class="frame-container" id="frame-container">
${frameSrcdocs.map((f, i) => `  <iframe id="${f.id}" ${i === 0 ? 'class="active" ' : ''}role="tabpanel" loading="${i === 0 ? 'eager' : 'lazy'}" srcdoc="${f.srcdoc}"></iframe>`).join('\n')}
</div>

<script>
(function() {
  const desktopTabs = Array.from(document.querySelectorAll('.tab-bar .tab-btn[data-frame]'));
  const mobileBtns = Array.from(document.querySelectorAll('#mobile-sheet button[data-frame]'));
  const frames = Array.from(document.querySelectorAll('.frame-container iframe'));
  const brandLink = document.getElementById('brand-link');
  const cta = document.getElementById('cta-start');
  const ctaMobile = document.getElementById('cta-start-mobile');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileSheet = document.getElementById('mobile-sheet');

  function switchFrame(frameId) {
    frames.forEach(f => f.classList.toggle('active', f.id === frameId));
    desktopTabs.forEach(t => {
      const isActive = t.dataset.frame === frameId;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    mobileBtns.forEach(b => b.classList.toggle('active', b.dataset.frame === frameId));
    closeMobileSheet();
    const f = document.getElementById(frameId);
    if (f && f.contentWindow) { try { f.contentWindow.scrollTo(0, 0); } catch (e) {} }
  }
  function openMobileSheet() { mobileSheet.dataset.open = "true"; menuToggle.setAttribute('aria-expanded', 'true'); }
  function closeMobileSheet() { mobileSheet.dataset.open = "false"; menuToggle.setAttribute('aria-expanded', 'false'); }
  function toggleMobileSheet() { if (mobileSheet.dataset.open === "true") closeMobileSheet(); else openMobileSheet(); }

  desktopTabs.forEach(t => t.addEventListener('click', () => switchFrame(t.dataset.frame)));
  mobileBtns.forEach(b => b.addEventListener('click', () => switchFrame(b.dataset.frame)));
  brandLink.addEventListener('click', (e) => { e.preventDefault(); switchFrame('frame-welcome'); });
  cta.addEventListener('click', (e) => { e.preventDefault(); switchFrame('frame-welcome'); });
  ctaMobile.addEventListener('click', (e) => { e.preventDefault(); switchFrame('frame-welcome'); });
  menuToggle.addEventListener('click', (e) => { e.stopPropagation(); toggleMobileSheet(); });

  document.addEventListener('click', (e) => {
    if (!mobileSheet.contains(e.target) && e.target !== menuToggle && !menuToggle.contains(e.target)) closeMobileSheet();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileSheet(); });

  // Allow iframe pages to request a frame switch (e.g. CTAs in the welcome page)
  window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'switchFrame' && e.data.frameId) {
      switchFrame(e.data.frameId);
    }
  });
})();
</script>

</body>
</html>
`;

fs.writeFileSync(OUT, shareableHtml, 'utf-8');
const sizeKB = (Buffer.byteLength(shareableHtml, 'utf-8') / 1024).toFixed(1);
console.log(`Wrote ${OUT}`);
console.log(`Size: ${sizeKB} KB`);
console.log(`Frames bundled: ${FRAMES.length}`);
FRAMES.forEach(f => console.log(`  - ${f.label}: ${path.relative(__dirname, f.file)}`));

// ─── Write manifest ─────────────────────────────────────────────────────────
// Records what this build produced so the next run's preflight can detect
// whether someone edited the output file directly.
const now = new Date().toISOString();
const outHashFinal = sha1(shareableHtml);
const manifestLines = [
  '# BUILD-MANIFEST.yaml — DO NOT EDIT BY HAND',
  '# Written by build-window-frames.mjs. If Getting Started.html has been',
  '# edited directly (mtime newer than last-built), the next build will abort.',
  '# See 01_tools/00_overview/BUILD-MANIFEST.md for reconciliation steps.',
  `last-built: ${now}`,
  `output-size: ${Buffer.byteLength(shareableHtml, 'utf-8')}`,
  `output-sha1: ${outHashFinal}`,
  'frames:',
  ...frameSrcdocs.map(f =>
    `  - { id: ${f.id}, label: "${f.label}", source: "${path.relative(PACKET_ROOT, f.file)}", source-sha1: ${f.sourceHash} }`
  ),
  'examples:',
  ...Object.entries(EXAMPLE_FRAMES).map(([token, fp]) => {
    const exists = fs.existsSync(fp);
    const sh = exists ? sha1(fs.readFileSync(fp, 'utf-8')) : 'MISSING';
    return `  - { token: ${token}, source: "${path.relative(PACKET_ROOT, fp)}", source-sha1: ${sh} }`;
  }),
  ''
];
fs.writeFileSync(MANIFEST, manifestLines.join('\n'), 'utf-8');
console.log(`Wrote ${MANIFEST}`);

// Touch OUT's mtime to match the manifest timestamp so preflight doesn't
// false-positive on the next build (filesystem mtime can drift by ms).
const manifestMtime = new Date(now);
fs.utimesSync(OUT, manifestMtime, manifestMtime);
