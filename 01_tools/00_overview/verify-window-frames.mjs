import fs from 'node:fs';

const packet = fs.readFileSync('Getting Started.html', 'utf-8');
const start = packet.indexOf('id="frame-lenses"');
const sdocStart = packet.indexOf('srcdoc="', start) + 8;
const closeIframe = packet.indexOf('"></iframe>', sdocStart);
const srcdoc = packet.slice(sdocStart, closeIframe);
const decoded = srcdoc.replace(/&quot;/g, '"').replace(/&amp;/g, '&');

// Helper: find payload by id and return its raw text (between tags)
function extractPayload(src, id) {
  const open = `<script type="text/html" id="${id}">`;
  const s = src.indexOf(open);
  if (s === -1) return null;
  // Find the matching </script> (base64 has no < or > so just find first close)
  const e = src.indexOf('</script>', s + open.length);
  if (e === -1) return null;
  return src.slice(s + open.length, e).trim();
}

function atobNode(b64) {
  return Buffer.from(b64, 'base64').toString('utf-8');
}

console.log('=== Packet file size:', (packet.length / 1024).toFixed(1), 'KB ===\n');

// Step 1: Lens-catalog modal script
const lcBodyEnd = decoded.lastIndexOf('</body>');
const lcScriptClose = decoded.lastIndexOf('</script>', lcBodyEnd);
const lcScriptOpen = decoded.lastIndexOf('<script>', lcScriptClose);
const lcScript = decoded.slice(lcScriptOpen + '<script>'.length, lcScriptClose);
console.log('STEP 0: Lens-catalog modal script');
try { new Function(lcScript); console.log('  PARSES: OK ('+lcScript.length+' chars)'); }
catch (e) { console.log('  PARSES: FAIL :', e.message); }

// Step 1: Click "View Example" on First Look
console.log('\nSTEP 1: click View Example on First Look');
const flB64 = extractPayload(decoded, 'example-first-look');
console.log('  first-look base64 payload:', flB64.length, 'chars');
const flHtml = atobNode(flB64);
console.log('  first-look decoded HTML:', flHtml.length, 'chars');
console.log('  has <!DOCTYPE html>:', flHtml.includes('<!DOCTYPE html>'));
console.log('  ends with </html>:', flHtml.trim().endsWith('</html>'));
console.log('  has lens-grid cards:', (flHtml.match(/class="lens-grid"/g) || []).length);
console.log('  has growth items:', (flHtml.match(/<div class="num">\d<\/div>/g) || []).length);
console.log('  has scale-badges:', (flHtml.match(/scale-badge/g) || []).length);
console.log('  has capacity-track:', flHtml.includes('capacity-track'));
console.log('  has lens-chip title:', flHtml.includes('id="modal-lens-name"'));

// First-look's OWN modal script parses?
const flBodyEnd2 = flHtml.lastIndexOf('</body>');
const flScriptClose = flHtml.lastIndexOf('</script>', flBodyEnd2);
const flScriptOpen = flHtml.lastIndexOf('<script>', flScriptClose);
const flScript = flHtml.slice(flScriptOpen + '<script>'.length, flScriptClose);
try { new Function(flScript); console.log('  first-look modal script PARSES: OK ('+flScript.length+' chars)'); }
catch (e) { console.log('  first-look modal script PARSES: FAIL :', e.message); }

// Step 2: Inside first-look, click "Preview Reel"
console.log('\nSTEP 2: click Preview Reel inside first-look modal');
const reelB64 = extractPayload(flHtml, 'example-reel');
console.log('  reel base64 (nested in first-look):', reelB64.length, 'chars');
const reelHtml = atobNode(reelB64);
console.log('  reel decoded HTML:', reelHtml.length, 'chars');
console.log('  has <!DOCTYPE html>:', reelHtml.includes('<!DOCTYPE html>'));
console.log('  ends with </html>:', reelHtml.trim().endsWith('</html>'));
console.log('  has .slide:', (reelHtml.match(/class="slide/g) || []).length, 'slides');

// Reel's own carousel script parses?
const reelScriptMatch = reelHtml.match(/<script>\s*\(\(\)\s*=>\s*\{/);
if (reelScriptMatch) {
  const rsClose = reelHtml.indexOf('</script>', reelScriptMatch.index);
  const rsBody = reelHtml.slice(reelScriptMatch.index + '<script>'.length, rsClose);
  try { new Function(rsBody); console.log('  reel carousel script PARSES: OK'); }
  catch (e) { console.log('  reel carousel script PARSES: FAIL :', e.message); }
}

// Step 3: Verify every lens preview renders cleanly (top-level)
console.log('\nSTEP 3: All top-level lens payloads');
const lenses = ['example-reel', 'example-explainer', 'example-session-narrative', 'example-product-website', 'example-pitch', 'example-share'];
for (const lens of lenses) {
  // Search in decoded AFTER first-look payload to get the lens-catalog's own copy
  const afterFl = decoded.indexOf('</script>', decoded.indexOf('example-first-look'));
  const open = `<script type="text/html" id="${lens}">`;
  const s = decoded.indexOf(open, afterFl);
  if (s === -1) { console.log('  ', lens, 'NOT FOUND'); continue; }
  const e = decoded.indexOf('</script>', s + open.length);
  const b64 = decoded.slice(s + open.length, e).trim();
  const html = atobNode(b64);
  const ok = html.includes('<!DOCTYPE html>') && html.trim().endsWith('</html>');
  console.log('  ', lens, '→', html.length, 'chars', ok ? 'OK' : 'INCOMPLETE');
}
