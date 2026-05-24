---
type: reference
date: 2026-05-14
project: Cuts System
status: active
visibility: local
tags: [reference, cuts, player, audio, accessibility, agent-instructions]
last-updated: 2026-05-19
version: 1.7
---

# Canonical Audio Player for Cuts

This is the canonical source for the audio player that every cut frame should embed. The player is browser-native (Web Speech API) and runs entirely client-side: no API key, no network, no cost. Voice quality is OS-dependent.

When you build a new cut frame, you MUST embed this player. Copy the three blocks below into the frame's HTML at the marked positions. The player auto-detects navigable sections (masthead plus every `<section class="cluster">`) and works without further configuration.

When you need to update the player (fix a bug, add a feature), update this file first, then re-embed into existing frames as needed. Existing frames keep working with their embedded copy; updates only flow to frames the user asks you to refresh.

> [!warning] Hard rule: re-read this file every time you embed
> **Before embedding the player into a new frame or back-porting it into an existing frame, ALWAYS re-read this file to check the current canonical version.** Do not assume the player code you embedded earlier in the same session is still canonical. Parallel sessions can bump the canonical version between two of your own writes. In-memory player code has a shelf-life of one tool turn.
>
> The check is mechanical: read the `version:` field in the frontmatter and the topmost changelog entry. Then grep the frame you wrote for `// --- Cuts Audio Player vX.Y ---` and confirm the version matches. If the canonical version has changed between two of your own writes, you have to re-patch every frame you wrote at the prior version.
>
> Rule added 2026-05-19 after a session shipped a v1.5 frame while canonical was already at v1.6. The v1.6 bump fixed a "plays then stops randomly" bug the user had explicitly reported. The buggy frame was the one the user was about to load up and listen to.

---

## Why inline, not external

Cuts are designed to be shared as standalone HTML files. A reader may receive the frame as an email attachment, a Signal file send, or a single file download. External CSS/JS dependencies break that. So the player is inlined into every frame. The cost is duplication; the value is portability.

When the player changes, frames already in the wild keep working with their old player. New frames pick up the new version automatically because the building agent reads this file.

---

## Section navigation conventions

The player's previous-section and next-section buttons jump between elements that meet either of these conditions:

- The `<header class="masthead">` block at the top of the document (treated as the introduction)
- Any `<section class="cluster">` element with an `<h2>` heading inside it

If your frame uses different section markup, either adapt the markup to match this convention, or modify the `gatherSectionedText()` function in the player JS to use a different selector.

Cuts that have only one continuous body (no sections) should still embed the player. The previous/next buttons will be no-ops, but the play/pause and slider continue to work.

---

## Where each block goes in the frame

1. **CSS block** &middot; paste inside the `<style>` block in the document `<head>`, after any reset/base styles and before any frame-specific overrides.
2. **HTML block** &middot; paste at the top of the body content, after the masthead (or any title block) and before the main reading content. The player is intended to be visible from the start.
3. **JS block** &middot; paste inside a `<script>` block just before `</body>`, or at the end of an existing script block in the frame. The player initializes itself on load.

The player relies on CSS custom properties (the `--paper`, `--ink`, `--accent`, `--rule` set used throughout the cuts system). If your frame uses different design tokens, either define those CSS variables in `:root` or adapt the player styles to your frame's tokens.

---

## CSS block

```css
/* --- Cuts Audio Player v1.4 --- */
/* Reserve bottom space so the floating sticky-bottom player never covers content.
   Scoped to pages that actually have the player via :has(). */
body:has(.audio-bar) { padding-bottom: 120px; }
html:has(.audio-bar) { scroll-padding-bottom: 120px; }
.audio-bar {
  position: relative;
  margin: 0 0 22px;
  padding: 14px 16px;
  background: var(--paper-deep, #efe7d3);
  border: 1px solid var(--rule, #d6cdb8);
  border-radius: 10px;
}
.audio-bar .close-btn {
  position: absolute;
  top: 6px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: var(--ink-soft, #524b40);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  z-index: 1;
  transition: background 0.15s, color 0.15s;
}
.audio-bar.is-floating .close-btn { display: inline-flex; }
.audio-bar .close-btn:hover { background: var(--rule, #d6cdb8); color: var(--ink, #1c1813); }
.audio-bar .close-btn:focus-visible { outline: 2px solid var(--accent, #3c5a3a); outline-offset: 2px; }
.audio-bar.is-floating.is-dismissed { display: none; }
.audio-bar .player-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}
.audio-bar .player-row + .player-row {
  margin-top: 10px;
}
.audio-bar .slider-row { gap: 12px; }
.audio-bar .button-row {
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  row-gap: 10px;
}
.audio-bar .play-btn,
.audio-bar .nav-btn {
  background: var(--ink, #1c1813);
  color: var(--btn-fg, var(--paper, #f6f1e6));
  border: none;
  border-radius: 50%;
  cursor: pointer;
  -webkit-appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  line-height: 1;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  transition: transform 0.1s, background 0.15s;
}
.audio-bar .play-btn { width: 56px; height: 56px; min-width: 56px; font-size: 20px; }
.audio-bar .nav-btn { width: 44px; height: 44px; min-width: 44px; font-size: 14px; background: var(--ink-soft, #524b40); }
.audio-bar .nav-btn:hover { background: var(--ink, #1c1813); }
.audio-bar .play-btn:hover { background: var(--accent, #3c5a3a); }
.audio-bar .play-btn:active,
.audio-bar .nav-btn:active { transform: scale(0.94); }
.audio-bar .play-btn:focus-visible,
.audio-bar .nav-btn:focus-visible { outline: 2px solid var(--accent, #3c5a3a); outline-offset: 2px; }
.audio-bar .play-btn .icon-pause { display: none; }
.audio-bar .play-btn[data-playing="true"] .icon-play { display: none; }
.audio-bar .play-btn[data-playing="true"] .icon-pause { display: inline; }
.audio-bar .speed-pill {
  background: transparent;
  border: 1px solid var(--rule, #d6cdb8);
  color: var(--ink, #1c1813);
  border-radius: 16px;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 10px;
  min-width: 50px;
  min-height: 32px;
  -webkit-appearance: none;
  transition: background 0.15s, color 0.15s;
  font-variant-numeric: tabular-nums;
}
.audio-bar .speed-pill:hover { background: var(--ink, #1c1813); color: var(--btn-fg, var(--paper, #f6f1e6)); border-color: var(--ink, #1c1813); }
.audio-bar .speed-pill:active { transform: scale(0.95); }
.audio-bar .progress {
  flex: 1 1 auto;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  background: transparent;
  cursor: pointer;
  margin: 0;
  padding: 12px 0;
  min-width: 0;
}
.audio-bar .progress::-webkit-slider-runnable-track {
  height: 6px;
  background: linear-gradient(to right, var(--accent, #3c5a3a) 0%, var(--accent, #3c5a3a) var(--p, 0%), var(--rule, #d6cdb8) var(--p, 0%), var(--rule, #d6cdb8) 100%);
  border-radius: 3px;
}
.audio-bar .progress::-moz-range-track { height: 6px; background: var(--rule, #d6cdb8); border-radius: 3px; }
.audio-bar .progress::-moz-range-progress { height: 6px; background: var(--accent, #3c5a3a); border-radius: 3px; }
.audio-bar .progress::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--ink, #1c1813);
  margin-top: -6px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.25);
}
.audio-bar .progress::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--ink, #1c1813);
  border: none;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.25);
}
.audio-bar .time {
  font-variant-numeric: tabular-nums;
  font-size: 12px;
  color: var(--ink-soft, #524b40);
  min-width: 44px;
  white-space: nowrap;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
}
.audio-bar .time-current { text-align: left; }
.audio-bar .time-remaining { text-align: right; }
.audio-bar .voice-picker {
  background: var(--surface, var(--paper, #f6f1e6));
  border: 1px solid var(--rule, #d6cdb8);
  color: var(--ink, #1c1813);
  border-radius: 16px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  min-height: 32px;
  max-width: 180px;
  cursor: pointer;
  -webkit-appearance: menulist;
  appearance: menulist;
}
/* Sticky-bottom behavior · when user scrolls past the player it floats to the bottom of the viewport */
.audio-bar-sentinel {
  height: 1px;
  margin-bottom: -1px;
  pointer-events: none;
}
.audio-bar.is-floating {
  position: fixed;
  bottom: 12px;
  left: 12px;
  right: 12px;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
  z-index: 50;
  box-shadow: 0 6px 22px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.12);
  background: var(--surface, var(--paper, #f6f1e6));
  animation: cuts-player-float-in 0.18s ease-out;
}
@keyframes cuts-player-float-in {
  from { transform: translateY(10px); opacity: 0.4; }
  to { transform: translateY(0); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .audio-bar.is-floating { animation: none; }
}
/* --- end Cuts Audio Player v1.4 --- */
```

---

## HTML block

Paste this near the top of the document body, after the masthead/title and before the main reading content.

```html
<!-- Cuts Audio Player v1.4 -->
<div class="audio-bar ui" aria-label="Read aloud controls">
  <button class="close-btn" data-action="dismiss" aria-label="Dismiss floating player" type="button">&times;</button>
  <div class="player-row button-row">
    <select class="voice-picker" data-role="voice" aria-label="Voice"></select>
    <button class="speed-pill" data-action="cycle-speed" aria-label="Speed" data-role="speed-pill">0.95&times;</button>
    <button class="nav-btn" data-action="prev" aria-label="Previous section">
      <span aria-hidden="true">&#9198;</span>
    </button>
    <button class="play-btn" data-action="toggle" aria-label="Play" data-playing="false">
      <span class="icon-play" aria-hidden="true">&#9654;</span>
      <span class="icon-pause" aria-hidden="true">&#10073;&#10073;</span>
    </button>
    <button class="nav-btn" data-action="next" aria-label="Next section">
      <span aria-hidden="true">&#9197;</span>
    </button>
  </div>
  <div class="player-row slider-row">
    <span class="time time-current" data-role="time-current">0:00</span>
    <input type="range" class="progress" min="0" max="1000" value="0" step="1" aria-label="Reading progress" data-role="progress">
    <span class="time time-remaining" data-role="time-remaining">-0:00</span>
  </div>
</div>
<!-- end Cuts Audio Player v1.4 -->
```

---

## JS block

Paste this inside a `<script>` block just before `</body>`.

The `STORAGE_KEY` constant is namespaced by frame slug. **When you embed the player into a new frame, replace `cut-default` with the frame's slug** (e.g. `20260514_thesis-prior-art-onepager-explainer`). This isolates each frame's saved position so the reader can have different positions in different cuts simultaneously.

```javascript
// --- Cuts Audio Player v1.7 ---
(function () {
  const audioBar = document.querySelector('.audio-bar');
  if (!audioBar) return;
  const playBtn = audioBar.querySelector('button[data-action="toggle"]');
  const prevBtn = audioBar.querySelector('button[data-action="prev"]');
  const nextBtn = audioBar.querySelector('button[data-action="next"]');
  const closeBtn = audioBar.querySelector('button[data-action="dismiss"]');
  const speedPill = audioBar.querySelector('[data-role="speed-pill"]');
  const progressEl = audioBar.querySelector('[data-role="progress"]');
  const timeCurEl = audioBar.querySelector('[data-role="time-current"]');
  const timeRemEl = audioBar.querySelector('[data-role="time-remaining"]');
  const voiceSel = audioBar.querySelector('[data-role="voice"]');
  // Status element is optional in v1.2+ (status text removed from default layout).
  // Fallback to no-op object so all statusEl.textContent assignments are safe.
  const statusEl = audioBar.querySelector('[data-role="status"]') || { textContent: '' };

  // v1.6: errors that are NORMAL browser interruptions, not real failures.
  // The Chrome 15-second keep-alive workaround triggers pause/resume cycles;
  // audio routing changes (headphone plug/unplug, system sound change), brief
  // focus shifts, and queued-utterance transitions all fire onerror with one
  // of these types. v1.5 and earlier dumped the user to "tap play to resume"
  // on any error, which made long playback look broken. v1.6 keeps going.
  const RECOVERABLE_ERRORS = new Set([
    'interrupted', 'canceled', 'cancelled', 'audio-busy',
    'synthesis-failed', 'synthesis-unavailable'
  ]);

  // REPLACE 'cut-default' with this frame's slug when embedding
  const STORAGE_KEY = 'cuts-player-state:cut-default';
  const WPM = 165;
  const SPEEDS = [0.85, 0.95, 1.0, 1.1, 1.2];

  let chunks = [];
  let chunkWords = [];
  let prefixWords = [];
  let totalWords = 0;
  let sectionInfo = [];
  let chunkSection = [];
  let chunkIndex = 0;
  let isPlaying = false;
  let isUserScrubbing = false;
  // v1.5: replaces the programmaticCancel boolean. Each utterance carries its
  // own generation id; stale onstart/onend/onerror callbacks from cancelled
  // utterances are ignored absolutely (no time window).
  let currentUtterId = 0;
  let voices = [];
  let selectedVoice = null;
  let speed = 0.95;
  let failsafeTimer = null;
  let keepAliveTimer = null;
  // v1.7: when keep-alive runs pause()/resume() to defeat Chrome's 15-second
  // freeze, the active utterance fires onerror with 'interrupted'. v1.6's
  // recoverable-error advance would then SKIP a chunk every 9 seconds.
  // This flag is set immediately before pause() and cleared a short window
  // after resume(); onerror checks the flag and ignores keep-alive-caused
  // interruptions entirely (no advance, no fail).
  let keepAliveJustFired = false;

  function gatherSectionedText() {
    const sections = [];
    const masthead = document.querySelector('header.masthead');
    if (masthead) {
      sections.push({ name: 'Introduction', shortName: 'Intro', text: extractTextFromNode(masthead) });
    }
    document.querySelectorAll('section.cluster').forEach(sec => {
      const h2 = sec.querySelector('h2');
      const name = h2 ? h2.textContent.trim() : 'Section';
      sections.push({ name: name, shortName: name.replace(/^\d+\.\s*/, ''), text: extractTextFromNode(sec) });
    });
    if (!sections.length) {
      // No standard markers found. Treat the whole container as one section.
      const container = document.querySelector('.container') || document.body;
      sections.push({ name: 'Document', shortName: 'Document', text: extractTextFromNode(container) });
    }
    return sections;
  }

  function extractTextFromNode(node) {
    const skip = new Set(['SCRIPT', 'STYLE', 'svg', 'SVG']);
    const parts = [];
    function walk(n) {
      if (!n) return;
      if (n.nodeType === Node.TEXT_NODE) {
        const t = n.textContent.replace(/\s+/g, ' ').trim();
        if (t) parts.push(t);
        return;
      }
      if (n.nodeType !== Node.ELEMENT_NODE) return;
      if (skip.has(n.tagName)) return;
      if (n.classList && (n.classList.contains('audio-bar') || n.classList.contains('to-top') || n.classList.contains('toc') || n.classList.contains('section-end') || n.classList.contains('method-note'))) return;
      if (n.tagName === 'FOOTER') return;
      for (const child of n.childNodes) walk(child);
    }
    walk(node);
    return parts.join(' ');
  }

  function buildChunks(text) {
    const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text];
    const out = [];
    let buf = '';
    for (const s of sentences) {
      if ((buf + s).length > 200) {
        if (buf) out.push(buf.trim());
        buf = s;
      } else {
        buf += s;
      }
    }
    if (buf) out.push(buf.trim());
    return out;
  }

  function wordCount(s) { return s.split(/\s+/).filter(Boolean).length; }

  function ensureChunks() {
    if (chunks.length) return;
    const sections = gatherSectionedText();
    chunks = []; chunkWords = []; chunkSection = []; sectionInfo = [];
    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      const startChunk = chunks.length;
      const secChunks = buildChunks(sec.text);
      for (const c of secChunks) {
        chunks.push(c);
        chunkSection.push(i);
        chunkWords.push(wordCount(c));
      }
      sectionInfo.push({ name: sec.name, shortName: sec.shortName, startChunk: startChunk });
    }
    totalWords = chunkWords.reduce((a, b) => a + b, 0);
    prefixWords = [];
    let acc = 0;
    for (const w of chunkWords) { prefixWords.push(acc); acc += w; }
  }

  function formatTime(seconds, negative) {
    if (!isFinite(seconds) || seconds < 0) seconds = 0;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return (negative ? '-' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function currentSectionIdx() {
    if (!chunkSection.length) return 0;
    if (chunkIndex >= chunks.length) return sectionInfo.length - 1;
    return chunkSection[chunkIndex] || 0;
  }

  // v1.5: helpers for word-fraction conversion (used by saveState/restore and scrub)
  function currentWordFrac() {
    if (!totalWords) return 0;
    const wordsDone = (chunkIndex < prefixWords.length) ? prefixWords[chunkIndex] : totalWords;
    return wordsDone / totalWords;
  }

  function chunkIndexForWordFrac(frac) {
    if (!prefixWords.length) return 0;
    const targetWord = frac * totalWords;
    let i = 0;
    for (; i < prefixWords.length; i++) { if (prefixWords[i] > targetWord) break; }
    return Math.max(0, Math.min(chunks.length - 1, i - 1));
  }

  function updateProgressUI() {
    if (!totalWords) {
      progressEl.value = 0;
      progressEl.style.setProperty('--p', '0%');
      timeCurEl.textContent = '0:00';
      timeRemEl.textContent = '-0:00';
      return;
    }
    const frac = currentWordFrac();
    if (!isUserScrubbing) progressEl.value = Math.round(frac * 1000);
    progressEl.style.setProperty('--p', (frac * 100).toFixed(1) + '%');
    const total = (totalWords / WPM) * 60 / Math.max(speed, 0.1);
    const elapsed = total * frac;
    timeCurEl.textContent = formatTime(elapsed);
    timeRemEl.textContent = formatTime(total - elapsed, true);
  }

  function updateSpeedPill() { speedPill.textContent = speed + '×'; }

  function saveState() {
    try {
      // v1.5: wordFrac stored alongside chunkIndex so position survives content
      // edits to the frame. On restore, if totalChunks no longer matches the
      // saved value, wordFrac is used to approximate the prior position.
      const state = {
        chunkIndex,
        totalChunks: chunks.length,
        wordFrac: currentWordFrac(),
        voice: selectedVoice ? selectedVoice.name : '',
        speed,
        ts: Date.now()
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
    } catch (e) {}
  }

  function loadState() {
    let raw = null;
    try { raw = sessionStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (!raw) { try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) {} }
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function setPlayingState(playing) {
    isPlaying = playing;
    playBtn.dataset.playing = playing ? 'true' : 'false';
    playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  }

  // v1.5: cancel and bump the generation counter so any in-flight utterance's
  // callbacks become stale and are ignored. Replaces the programmaticCancel
  // boolean which had a 100ms reset window that could race with slow onerror.
  function stopSpeechHard() {
    if (failsafeTimer) { clearTimeout(failsafeTimer); failsafeTimer = null; }
    currentUtterId++;
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }

  function startKeepAlive() {
    if (keepAliveTimer) clearInterval(keepAliveTimer);
    keepAliveTimer = setInterval(() => {
      if (!isPlaying) return;
      try {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          // v1.7: flag the self-pause so onerror knows to ignore the
          // 'interrupted' event that fires from this cycle.
          keepAliveJustFired = true;
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
          setTimeout(() => { keepAliveJustFired = false; }, 250);
        }
      } catch (e) {}
    }, 9000);
  }

  function stopKeepAlive() {
    if (keepAliveTimer) { clearInterval(keepAliveTimer); keepAliveTimer = null; }
  }

  function playNextChunk() {
    if (chunkIndex >= chunks.length) {
      setPlayingState(false);
      stopKeepAlive();
      statusEl.textContent = 'Done. Tap play to start over.';
      chunkIndex = 0;
      saveState();
      updateProgressUI();
      return;
    }
    const text = chunks[chunkIndex];
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = speed;
    utter.pitch = 1.0;
    if (selectedVoice) utter.voice = selectedVoice;

    // v1.5: tag this utterance with its generation id; callbacks check it
    // before doing anything so a stale event from a cancelled utterance
    // cannot mutate state.
    const myId = ++currentUtterId;
    utter._cutsId = myId;

    let chunkAdvanced = false;
    const advanceNow = () => {
      if (chunkAdvanced) return;
      if (utter._cutsId !== currentUtterId) return; // stale generation
      chunkAdvanced = true;
      if (failsafeTimer) { clearTimeout(failsafeTimer); failsafeTimer = null; }
      chunkIndex++;
      saveState();
      updateProgressUI();
      if (isPlaying) playNextChunk();
    };

    utter.onstart = () => {
      if (utter._cutsId !== currentUtterId) return; // stale generation
      statusEl.textContent = 'Reading. Position saves as you go.';
      updateProgressUI();
    };
    utter.onend = advanceNow;
    utter.onerror = (event) => {
      // v1.5: ignore errors from stale (already-cancelled) utterances absolutely.
      if (utter._cutsId !== currentUtterId) return;
      if (chunkAdvanced) return;
      // v1.7: if the keep-alive pause/resume cycle just fired, the
      // 'interrupted' error is from OUR pause, not a real interruption.
      // Ignore it entirely (no advance, no fail). The utterance continues
      // after the resume(). This was the root cause of "voices got worse":
      // v1.6 advanced on every keep-alive cycle, skipping a chunk every
      // 9 seconds during long playback.
      const errTypeKA = (event && event.error) ? event.error : '';
      if (keepAliveJustFired && (errTypeKA === 'interrupted' || errTypeKA === 'canceled' || errTypeKA === 'cancelled' || errTypeKA === '')) {
        return;
      }
      // v1.6: most errors are recoverable interruptions, not real failures.
      // Treat them as "this chunk got cut off, advance and keep reading"
      // instead of stopping playback. This was the root cause of "audio plays
      // then stops randomly and won't continue past the issue": Chrome's
      // keep-alive pause/resume cycle, audio routing changes, and focus
      // shifts all fire onerror with one of the RECOVERABLE_ERRORS types,
      // which v1.5 and earlier let kill the whole playback.
      const errType = (event && event.error) ? event.error : '';
      if (errType === '' || RECOVERABLE_ERRORS.has(errType)) {
        advanceNow();
        return;
      }
      // Only truly unrecoverable errors (not-allowed, network, voice-unavailable,
      // text-too-long, language-unavailable, invalid-argument, audio-hardware)
      // actually stop the player. Surface the error type so it can be diagnosed
      // from the status line rather than the silent v1.5 message.
      chunkAdvanced = true;
      if (failsafeTimer) { clearTimeout(failsafeTimer); failsafeTimer = null; }
      setPlayingState(false);
      stopKeepAlive();
      statusEl.textContent = 'Audio error (' + errType + '). Tap play to resume.';
      saveState();
    };

    const estDurationMs = (wordCount(text) / WPM) * 60 / Math.max(speed, 0.1) * 1000;
    failsafeTimer = setTimeout(() => {
      if (!chunkAdvanced && isPlaying) advanceNow();
    }, Math.max(estDurationMs * 3, 8000));

    try { window.speechSynthesis.speak(utter); } catch (e) {
      setPlayingState(false);
      stopKeepAlive();
      statusEl.textContent = 'Could not start audio. Try a different voice.';
    }
  }

  function startPlayback() {
    ensureChunks();
    if (!chunks.length) { statusEl.textContent = 'No readable text on this page.'; return; }
    if (chunkIndex >= chunks.length) chunkIndex = 0;
    stopSpeechHard();
    setPlayingState(true);
    statusEl.textContent = 'Loading audio...';
    startKeepAlive();
    // v1.5: 120ms (was 80ms) gives the speech queue more time to clear before
    // restart, reducing cancel/start races on slower browsers.
    setTimeout(() => { if (isPlaying) playNextChunk(); }, 120);
  }

  function pausePlayback() {
    setPlayingState(false);
    stopSpeechHard();
    stopKeepAlive();
    saveState();
    statusEl.textContent = 'Paused. Position saved.';
  }

  function applySettingsLive() {
    // v1.7: do NOT cancel the current utterance on voice or speed change.
    // The current chunk finishes at the old settings (1 to 2 seconds), then
    // playNextChunk creates the next utterance which picks up selectedVoice
    // and speed via closure capture. This stops voice/speed changes from
    // restarting the current chunk's sentence from its beginning, which was
    // the v1.6 behavior. Scrub and section-jump still cancel because the
    // user explicitly asked to move position; settings changes do not.
    updateProgressUI();
  }

  function jumpToSection(idx) {
    ensureChunks();
    idx = Math.max(0, Math.min(sectionInfo.length - 1, idx));
    chunkIndex = sectionInfo[idx].startChunk;
    saveState();
    updateProgressUI();
    statusEl.textContent = 'At ' + sectionInfo[idx].shortName;
    if (isPlaying) {
      stopSpeechHard();
      setTimeout(() => { if (isPlaying) playNextChunk(); }, 120);
    }
  }

  playBtn.addEventListener('click', () => {
    if (isPlaying) pausePlayback(); else startPlayback();
  });
  prevBtn.addEventListener('click', () => {
    ensureChunks();
    const cur = currentSectionIdx();
    const startOfCur = sectionInfo[cur].startChunk;
    if (chunkIndex - startOfCur > 1) jumpToSection(cur);
    else jumpToSection(cur - 1);
  });
  nextBtn.addEventListener('click', () => {
    ensureChunks();
    jumpToSection(currentSectionIdx() + 1);
  });

  progressEl.addEventListener('input', (e) => {
    ensureChunks();
    isUserScrubbing = true;
    const frac = parseInt(e.target.value, 10) / 1000;
    progressEl.style.setProperty('--p', (frac * 100).toFixed(1) + '%');
    chunkIndex = chunkIndexForWordFrac(frac);
    const total = (totalWords / WPM) * 60 / Math.max(speed, 0.1);
    const elapsed = total * frac;
    timeCurEl.textContent = formatTime(elapsed);
    timeRemEl.textContent = formatTime(total - elapsed, true);
  });
  progressEl.addEventListener('change', () => {
    isUserScrubbing = false;
    saveState();
    if (isPlaying) {
      stopSpeechHard();
      setTimeout(() => { if (isPlaying) playNextChunk(); }, 120);
    }
  });
  progressEl.addEventListener('mouseup', () => { isUserScrubbing = false; });
  progressEl.addEventListener('touchend', () => { isUserScrubbing = false; });
  progressEl.addEventListener('pointerup', () => { isUserScrubbing = false; });

  speedPill.addEventListener('click', () => {
    const i = SPEEDS.indexOf(speed);
    speed = SPEEDS[(i + 1) % SPEEDS.length];
    updateSpeedPill();
    saveState();
    updateProgressUI();
    applySettingsLive();
  });

  function bestVoice(list) {
    const enLangs = list.filter(v => /^en(-|_|$)/i.test(v.lang));
    const candidates = enLangs.length ? enLangs : list;
    const priorities = [
      v => /enhanced|premium|natural|neural|siri/i.test(v.name),
      v => /samantha|karen|daniel|moira|tessa|fiona|allison|ava/i.test(v.name),
      v => /google.*us|google.*uk/i.test(v.name),
      v => /microsoft.*aria|microsoft.*jenny|microsoft.*guy/i.test(v.name),
      v => v.default,
      v => true
    ];
    for (const test of priorities) { const m = candidates.find(test); if (m) return m; }
    return candidates[0] || list[0] || null;
  }

  function populateVoices() {
    voices = window.speechSynthesis.getVoices() || [];
    if (!voices.length) return;
    voiceSel.innerHTML = '';
    voices.sort((a, b) => {
      const aEn = /^en(-|_|$)/i.test(a.lang) ? 0 : 1;
      const bEn = /^en(-|_|$)/i.test(b.lang) ? 0 : 1;
      if (aEn !== bEn) return aEn - bEn;
      return a.name.localeCompare(b.name);
    });
    for (const v of voices) {
      const opt = document.createElement('option');
      opt.value = v.name;
      opt.textContent = v.name + ' (' + v.lang + ')' + (v.default ? ' [default]' : '');
      voiceSel.appendChild(opt);
    }
    const saved = loadState();
    if (saved && saved.voice) {
      const match = voices.find(v => v.name === saved.voice);
      if (match) selectedVoice = match;
    }
    if (!selectedVoice) selectedVoice = bestVoice(voices);
    if (selectedVoice) voiceSel.value = selectedVoice.name;
  }

  voiceSel.addEventListener('change', () => {
    selectedVoice = voices.find(v => v.name === voiceSel.value) || null;
    saveState();
    applySettingsLive();
  });

  if (!('speechSynthesis' in window)) {
    [playBtn, prevBtn, nextBtn, speedPill, progressEl].forEach(el => { if (el) el.disabled = true; });
    statusEl.textContent = 'Browser text-to-speech is not supported in this browser.';
  } else {
    populateVoices();
    if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = populateVoices;
    }
  }

  // v1.5: restore prefers chunkIndex if totalChunks matches; if the document
  // has been re-rendered with more or fewer chunks since the last visit, fall
  // back to wordFrac so the reader lands at approximately their last position
  // instead of getting dumped back to chunk 0.
  (function restorePosition() {
    const saved = loadState();
    if (!saved) { ensureChunks(); updateProgressUI(); updateSpeedPill(); return; }
    ensureChunks();
    if (typeof saved.speed === 'number' && SPEEDS.indexOf(saved.speed) >= 0) speed = saved.speed;
    let restoredViaFrac = false;
    if (saved.totalChunks === chunks.length && typeof saved.chunkIndex === 'number') {
      chunkIndex = Math.max(0, Math.min(chunks.length - 1, saved.chunkIndex));
    } else if (typeof saved.wordFrac === 'number' && saved.wordFrac > 0) {
      chunkIndex = chunkIndexForWordFrac(saved.wordFrac);
      restoredViaFrac = true;
    } else {
      chunkIndex = 0;
    }
    updateProgressUI();
    updateSpeedPill();
    if (restoredViaFrac) {
      statusEl.textContent = 'Content changed since last visit. Restored to approximate position.';
    } else if (chunkIndex > 0) {
      const pct = totalWords ? Math.round((prefixWords[chunkIndex] / totalWords) * 100) : 0;
      statusEl.textContent = 'Resumed at ' + pct + '%. Tap play to continue.';
    }
  })();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      saveState();
      if (isPlaying) {
        setPlayingState(false);
        stopKeepAlive();
        stopSpeechHard();
        statusEl.textContent = 'Paused (screen locked or tab hidden). Tap play to resume.';
      }
    }
  });

  window.addEventListener('beforeunload', saveState);

  // Dismiss button (v1.3): when the user clicks the X in the floating state, hide the
  // floating player until they scroll back to its natural position (which clears is-dismissed).
  // Null-safe so older v1.2 markup without the close button keeps working.
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      audioBar.classList.add('is-dismissed');
    });
  }

  // Sticky-bottom: when the user scrolls past the player, float it to the bottom of the viewport
  (function setupStickyBottom() {
    if (!('IntersectionObserver' in window)) return; // Graceful no-op on older browsers
    const sentinel = document.createElement('div');
    sentinel.className = 'audio-bar-sentinel';
    sentinel.setAttribute('aria-hidden', 'true');
    audioBar.parentNode.insertBefore(sentinel, audioBar);
    let isFloating = false;
    const observer = new IntersectionObserver(([entry]) => {
      const sentinelAboveViewport = entry.boundingClientRect.top < 0;
      if (!entry.isIntersecting && sentinelAboveViewport) {
        if (!isFloating) {
          audioBar.classList.add('is-floating');
          isFloating = true;
        }
      } else if (entry.isIntersecting) {
        if (isFloating) {
          audioBar.classList.remove('is-floating');
          audioBar.classList.remove('is-dismissed');
          isFloating = false;
        }
      }
    }, { threshold: 0 });
    observer.observe(sentinel);
  })();
})();
// --- end Cuts Audio Player v1.7 ---
```

---

## Required CSS variables in the frame

The player styles reference these CSS variables. They have fallback defaults so the player works even without them, but cuts using the standard design tokens should already define these in `:root`:

```css
--paper       /* page background, default #f6f1e6 */
--paper-deep  /* component background, default #efe7d3 */
--ink         /* primary text/buttons, default #1c1813 */
--ink-soft    /* secondary text, default #524b40 */
--ink-faint   /* tertiary text, default #8a8275 */
--rule        /* borders, default #d6cdb8 */
--accent      /* accent color, default #3c5a3a */

/* v1.4 additions · OPTIONAL, only needed if your frame inverts the light/dark palette */
--btn-fg      /* button icon color · the color that sits ON --ink elements
                 (button icons, speed-pill hover text). Defaults to --paper.
                 Override only in dark-mode cuts where --paper is a translucent or
                 dark value that would not contrast with the light --ink button. */
--surface     /* secondary surface bg · used for voice-picker background and the
                 floating sticky-bottom player background. Defaults to --paper.
                 Override only in dark-mode cuts where you want surfaces to be a
                 slight-elevation dark color rather than the same color as --paper. */
```

### Why v1.4 added --btn-fg and --surface

In v1.3 the variable `--paper` served two distinct roles: (a) the color of button icons (foreground on light-colored ink buttons), and (b) the background of secondary surfaces (voice picker, floating bar). In light mode these are the same color, so one variable worked. In a dark-mode mapping they are different colors:

- Button icon needs to be DARK (contrast against a light --ink button background).
- Surface bg needs to be a SLIGHT-ELEVATION DARK COLOR (distinguishable from the page background, not the same as the dark icon).

v1.4 splits these into `--btn-fg` and `--surface`, both defaulting to `--paper` for backward compatibility. Dark-mode cuts can override the two independently.

## Dark mode mapping (recipe)

If your frame uses an inverted (dark) palette, set the variables like this:

```css
:root {
  --paper: rgba(255,255,255,0.06);          /* translucent light, for --paper-deep panels to read */
  --paper-deep: rgba(255,255,255,0.10);     /* component bg · slightly lighter translucent panel */
  --ink: #F5F1E8;                            /* light · primary fg / button bg */
  --ink-soft: #C9C0AB;                       /* slightly muted light */
  --rule: rgba(255,255,255,0.22);            /* visible light border on dark */
  --accent: #8FB39F;                         /* sage or whatever your accent is */
  --btn-fg: #1A2028;                         /* SOLID DARK · button icon contrast against light --ink button */
  --surface: #1A2028;                        /* SOLID DARK · slight-elevation surface for voice picker and floating bar */
}
```

The key principle: in dark mode, `--btn-fg` and `--surface` should be SOLID dark colors (not translucent). `--paper` and `--paper-deep` can be translucent because they only affect inline-panel backgrounds where translucency reads as a layered card.

---

## What the player does and does not do

**Does:**
- Reads the document top to bottom using browser-native Web Speech API
- Lets the user pick from installed system voices (auto-selects the best-quality one available)
- Lets the user cycle through five reading speeds (0.85x, 0.95x, 1.0x, 1.1x, 1.2x)
- Lets the user scrub the progress slider to jump to any position
- Lets the user jump to the previous or next section via the back/forward buttons
- Saves position to sessionStorage and localStorage after every chunk, so a phone-sleep interruption resumes from roughly where it stopped
- Works around the Chrome 15-second speechSynthesis pause bug via a keep-alive loop
- Falls back gracefully if the browser does not support Web Speech (player buttons are disabled)
- Sticks to the bottom of the viewport when the user scrolls past it, so pause and scrub stay reachable
- Surfaces a dismiss (&times;) button in the floating sticky-bottom state so the reader can hide the player when it's in the way of content; scrolling back to the player's natural position restores it for the next floating activation

**Does not:**
- Use a cloud TTS service. Voice quality is bounded by what the OS provides. iOS Siri voices are generally good; Windows voices are variable. For cloud-quality narration, that is a separate upgrade requiring an API key and additional infrastructure.
- Persist progress across different frames (the STORAGE_KEY is per-frame)
- Auto-resume on screen wake. iOS Safari kills the speech queue when the screen locks; the user must tap play to continue. The position is preserved so they resume where they left off.
- Continue reading when the tab is hidden. The player pauses on `visibilitychange` to match the underlying browser behavior.

---

## Changelog

**v1.7 &middot; 2026-05-19**

Two bugs caught during long playback: voice and speed changes restarted the current chunk from its beginning, and "voices got worse" turned out to be the v1.6 advance-on-recoverable-error behavior interacting badly with the keep-alive cycle.

The first bug: v1.5 and v1.6 both implemented `applySettingsLive` as `stopSpeechHard()` + 120ms timeout + `playNextChunk()`. That cancelled the current utterance and restarted at the same `chunkIndex`. Since each chunk is a sentence or two grouped to ~200 chars, the user heard the current sentence start over from its beginning every time they changed voice or speed.

v1.7 makes `applySettingsLive` a no-op for active playback. The current chunk finishes at the old voice and speed (1 to 2 seconds), then `playNextChunk` creates the next utterance which picks up `selectedVoice` and `speed` via closure capture. Voice and speed changes feel smooth and apply to the next sentence rather than restarting the current one. Scrub and section-jump still cancel because those are explicit position-change actions; settings changes are not.

The second bug: v1.6's `RECOVERABLE_ERRORS` advance-on-interruption was supposed to handle real interruptions (audio routing changes, focus shifts). What it actually did under steady-state long playback was advance the chunk every 9 seconds, because the keep-alive cycle that defeats Chrome's 15-second freeze calls `pause()` and `resume()` every 9 seconds, and that pause itself fires `onerror` with `'interrupted'` on the active utterance. v1.6 treated that as a recoverable interruption and advanced. The audible result was one sentence skipped every 9 seconds throughout the entire document. The user reported this as "voices got worse"; the voice quality was unchanged, but every nine seconds a chunk vanished, which made the reading feel choppy and degraded.

v1.7 adds a `keepAliveJustFired` boolean. The flag is set immediately before `pause()` and cleared 250ms after `resume()`. The `onerror` handler checks the flag first: if it is true and the error is `'interrupted'` or `'canceled'` or empty, the handler returns without advancing or failing. The keep-alive pause/resume cycle becomes invisible to `onerror`. Real interruptions still get the v1.6 advance behavior because the flag is not set when they fire.

Tradeoff: the 250ms window assumes `onerror` from the pause/resume fires within that window. Browser behavior varies; if a slower browser fires onerror past 250ms, v1.7 would still advance on that one event. The 250ms is generous and should cover Chrome, Safari, and Firefox under normal conditions; if a specific environment shows skipped chunks under v1.7, widen the window before reverting.

Only the JS block changed in v1.7. CSS and HTML are unchanged from v1.4. Existing v1.5 and v1.6 frames can adopt v1.7 by swapping the JS block alone.

First v1.7 install: a long-form thesis frame plus five sibling chapters. Canonical-re-check rule (added at the top of this file after the v1.5-vs-v1.6 ship miss) was followed for this update: every frame's player block grepped after writing to confirm the v1.7 marker landed.

**v1.6 &middot; 2026-05-19**

A recurring bug seen by long-form listeners. Reported as: "plays then stops randomly and won't play past the issue." v1.5 fixed the scrub-related stop with the `currentUtterId` generation counter, but a separate failure mode kept manifesting on long playback: the player would die mid-sentence at apparently random points and refuse to continue without a tap on play.

Root cause: the v1.5 `utter.onerror` handler dumped the user to "Audio interrupted. Tap play to resume." on ANY error event from `SpeechSynthesisUtterance`. That was too aggressive. Browsers fire `onerror` with type `interrupted` or `canceled` (or `audio-busy`, or empty) for many NORMAL conditions during long playback:

- The Chrome 15-second keep-alive workaround calls `speechSynthesis.pause()` then `resume()` every 9 seconds. The pause/resume itself can fire `onerror` on the active utterance with `interrupted`.
- Audio routing changes (headphones plugged in or out, system default audio device switched, Bluetooth disconnect) interrupt the queue.
- Brief focus shifts (notification, system dialog) interrupt the queue.
- Voice queue transitions between chunks can fire spurious `interrupted` events on the just-finishing utterance.

In every case v1.5 stopped the whole playback. The user had no idea why; the speech just died and the player sat there.

v1.6 keeps a set `RECOVERABLE_ERRORS = {'interrupted', 'canceled', 'cancelled', 'audio-busy', 'synthesis-failed', 'synthesis-unavailable'}`. When `onerror` fires:

- If `event.error` is empty or in the recoverable set → call `advanceNow()` and keep going. The current chunk is treated as "got cut off, move to the next one."
- Only on truly unrecoverable errors (`not-allowed`, `network`, `voice-unavailable`, `text-too-long`, `language-unavailable`, `invalid-argument`, `audio-hardware`) does the player stop. The status line now includes the error type (`'Audio error (network). Tap play to resume.'`) so diagnosis is possible from the UI instead of requiring devtools.

Tradeoff: a chunk that hits a recoverable error gets skipped without warning. The user might miss one sentence. Acceptable because the alternative (v1.5's behavior) is the whole playback dying silently, which is worse. If the same chunk keeps erroring, the player burns through chunks at ~120ms each, so worst case it cycles through the rest of the document in a few seconds; the user can scrub back to where the audio actually stopped.

Only the JS block changed. CSS and HTML are unchanged from v1.4. Existing frames can adopt v1.6 by swapping the JS block alone. The two version markers (`--- Cuts Audio Player v1.6 ---` / `--- end Cuts Audio Player v1.6 ---`) flank only the JS.

First v1.6 install: a long-form reference frame where v1.5's silent-death was reproducible.

**v1.5 &middot; 2026-05-19**

Two production bugs reported by long-form listeners. Audio sometimes stopped after scrubbing to a new position. Position reset to the top instead of the saved spot after the frame had content added to it. v1.5 patches both at the JS layer; CSS and HTML blocks are unchanged from v1.4 so existing frames can adopt v1.5 by swapping only the JS block (or just the four behaviors below).

Three changes to the JS:

- Replaced the `programmaticCancel` boolean (which had a 100ms reset window) with a monotonic `currentUtterId` generation counter. Each utterance is tagged with its id at creation; `onstart`, `onend`, and `onerror` all check the id against the current generation and bail if the utterance is stale. There is no time window, so a slow `onerror` from a cancelled utterance can no longer race past the reset and flip `isPlaying=false` after a scrub. This was the root cause of "audio stopped when I skipped to a new position."
- Saved state now carries `wordFrac` (a 0 to 1 fraction of total words) alongside `chunkIndex` and `totalChunks`. On restore, if `totalChunks` no longer matches the saved value (the frame's content has changed since the last visit), the player uses `wordFrac` to land at the same approximate position instead of resetting to chunk 0. The status bar surfaces "Content changed since last visit. Restored to approximate position." when this path runs. Existing frames with old v1.4 saved state (no `wordFrac`) still reset to 0 on the first content-changed load, then start saving the new state shape going forward.
- The three cancel-and-restart `setTimeout` delays (startPlayback, applySettingsLive, jumpToSection, scrub change) all moved from 80ms to 120ms. This gives the browser's speech queue more time to clear before the next utterance starts, reducing the cancel/start race on slower browsers.

Two small cleanups: `updateProgressUI` now uses a shared `currentWordFrac()` helper instead of recomputing inline; the scrub `input` handler uses `chunkIndexForWordFrac(frac)` instead of an inline loop. Behavior is identical; the helpers are reused in saveState and restorePosition for the wordFrac work.

Back-ported into in-flight long-form frames at the time of the bump. Other frames already in the wild keep working with their embedded v1.4 player; only refresh when the user asks.

**v1.4 &middot; 2026-05-18**

Split the dual-use `--paper` variable so dark-mode cuts can map button icon color independently of surface background color. v1.3 used `var(--paper)` in four places: button icon color (play/nav buttons), speed-pill hover text color, voice-picker background, floating-bar background. In light mode all four want the same color (the page paper tone). In dark mode the first two want a SOLID DARK contrast color (against the light --ink button) and the last two want a SLIGHT-ELEVATION DARK SURFACE color (distinguishable from the page background). With one variable they could not be the same color in dark mode, causing invisible icons when the dark-mode mapping made --paper translucent.

v1.4 introduces two new variables:
- `--btn-fg` (used at the button icon color site and the speed-pill hover text color site). Defaults to `var(--paper, #f6f1e6)`.
- `--surface` (used at the voice-picker background site and the floating-bar background site). Defaults to `var(--paper, #f6f1e6)`.

Existing v1.3 frames are unaffected: the defaults preserve v1.3 behavior, and the player.md update only changes new frames going forward. v1.3 frames that have the player already embedded keep working with their embedded copy unless the user explicitly asks for a refresh.

Triggered by a playground frame whose player showed invisible button icons because the dark-mode mapping set `--paper: rgba(245,241,232,0.06)` (translucent white). The translucent value worked for the inline-bar background (which uses `--paper-deep`, not directly affected) but produced near-transparent icons on the white button surface. Documentation now includes a "Dark mode mapping (recipe)" section with the right pattern.

**v1.3 &middot; 2026-05-17**

Added a dismiss button (`&times;`) that appears in the player's sticky-bottom floating state. Clicking it adds `.is-dismisse