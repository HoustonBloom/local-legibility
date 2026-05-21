#!/usr/bin/env node
// YAML frontmatter audit v2 - bare minimum schema.
// Fields: type, name (optional), for: [human/ai/both], visibility, status, subject.
// No example: field (discoverable from folder). canon type renamed to instructions.
//
// Run from the packet root: `node 01_tools/04_workflows/yaml-audit/yaml-audit.mjs`
// PACKET defaults to the parent of the script's parent (i.e. the packet root).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKET = process.env.PACKET || path.resolve(__dirname, '..', '..', '..');

function determineYaml(filepath) {
  const rel = path.relative(PACKET, filepath).replace(/\\/g, '/');
  const base = path.basename(rel, '.md');

  // Leave SKILL.md alone (Claude Code harness format)
  if (base === 'SKILL') return null;

  // Templates
  if (base === '_template') {
    const forMap = {
      '01_lenses': 'lens', '02_atmospheres': 'atmosphere', '05_contacts': 'person', '03_design-system': 'style-source',
    };
    for (const [dir, subject] of Object.entries(forMap)) {
      if (rel.includes(`/${dir}/`)) {
        return { type: 'template', subject, for: ['human', 'ai'], visibility: 'local' };
      }
    }
    return { type: 'template', for: ['human', 'ai'], visibility: 'local' };
  }

  if (base === 'window-manifest-template') {
    return { type: 'template', subject: 'window', for: ['human', 'ai'], visibility: 'local' };
  }

  // ABOUT-* (instructions/orientation docs)
  if (base.startsWith('ABOUT-')) {
    const subjMap = {
      'OVERVIEW': 'overview', 'OUTBOX': 'outbox', 'CONTACTS': 'contacts',
      'LENSES': 'lenses', 'ATMOSPHERES': 'atmospheres', 'WORKFLOWS': 'workflows',
      'DESIGN-SYSTEM': 'design-system', 'VAULT-CANON': 'vault-canon', 'ACTIVITY': 'activity',
      'INBOX': 'inbox',
    };
    const key = base.replace('ABOUT-', '');
    return {
      type: 'instructions',
      subject: subjMap[key] || key.toLowerCase(),
      for: ['human', 'ai'],
      visibility: 'local',
    };
  }

  // ADDING-* (workflow docs)
  if (base.startsWith('ADDING-')) {
    const rest = base.replace('ADDING-', '').toLowerCase();
    let subject;
    if (rest === 'a-lens') subject = 'lens';
    else if (rest === 'an-atmosphere') subject = 'atmosphere';
    else if (rest === 'components') subject = 'component';
    else subject = rest;
    return { type: 'workflow', subject, for: ['human', 'ai'], visibility: 'local' };
  }

  // CUTS-SPEC.md
  if (base === 'CUTS-SPEC') {
    return { type: 'spec', subject: 'cuts', for: ['human', 'ai'], visibility: 'local' };
  }

  // ADAPTER-PROMPT.md
  if (base === 'ADAPTER-PROMPT') {
    return { type: 'prompt', subject: 'adapter', for: ['human', 'ai'], visibility: 'local' };
  }

  // Lens spec (01_lenses/<name>.md, not underscore-prefixed)
  if (rel.match(/^01_tools\/01_lenses\/[^_/]+\.md$/)) {
    const name = base.toLowerCase().replace(/ /g, '-');
    const exampleHtml = `_examples/example-${name}.html`;
    const hasExample = fs.existsSync(path.join(PACKET, '01_tools/01_lenses', exampleHtml));
    return {
      type: 'lens',
      name,
      for: ['human', 'ai'],
      visibility: 'local',
      status: hasExample ? 'active' : 'pending',
    };
  }

  // Atmosphere spec
  if (rel.match(/^01_tools\/02_atmospheres\/[^_/]+\.md$/)) {
    const name = base.toLowerCase();
    const exampleHtml = `_examples/${name}.html`;
    const hasExample = fs.existsSync(path.join(PACKET, '01_tools/02_atmospheres', exampleHtml));
    return {
      type: 'atmosphere',
      name,
      for: ['human', 'ai'],
      visibility: 'local',
      status: hasExample ? 'active' : 'pending',
    };
  }

  // Style source in 03_design-system/
  if (rel.match(/^01_tools\/03_design-system\/[^A_][^.]*\.md$/)) {
    return { type: 'style-source', name: base, for: ['ai'], visibility: 'local' };
  }

  return null;
}

function renderYaml(obj) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) {
      lines.push(`${k}: [${v.join(', ')}]`);
    } else {
      lines.push(`${k}: ${v}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

function parseFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!fmMatch) return { body: content };
  return { body: fmMatch[2] };
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'local-brain-preview' || entry.name === '_examples') continue;
      walk(full, out);
    } else if (entry.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

const files = walk(PACKET);
let changed = 0;
let skipped = 0;

for (const f of files) {
  const { body } = parseFile(f);
  const newYaml = determineYaml(f);
  if (newYaml === null) { skipped++; continue; }
  fs.writeFileSync(f, renderYaml(newYaml) + '\n' + body, 'utf-8');
  changed++;
}

console.log(`Changed ${changed} files, skipped ${skipped}`);
