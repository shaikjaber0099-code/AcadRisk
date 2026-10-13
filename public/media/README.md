# AcadRisk Media Assets & Video Loops

This directory houses background videos and high-fidelity poster fallbacks for AcadRisk.
If video files are absent, the web application automatically displays animated CSS and SVG gradient fallbacks without broken media elements or console errors.

## Expected Media Assets (Higgsfield Generation)

1. **`hero-loop.mp4`** (16:9, 1080p, 8-10 seconds, seamless loop)
   - Prompt: Futuristic university library at dusk, holographic charts floating above wooden study desks, students studying, glowing blue and violet particles, shallow depth of field, slow cinematic dolly-in.
   - Fallback Poster: `hero-poster.svg`

2. **`data-stream.mp4`** (Seamless loop, 10-15 seconds)
   - Prompt: Abstract flowing data streams, nodes, and algorithmic vectors in bioluminescent indigo, violet, and electric cyan across a deep navy obsidian background.
   - Fallback Poster: `data-stream-poster.svg`

3. **`risk-alert.mp4`** (4-5 seconds loop)
   - Prompt: A student risk telemetry card dynamically transitioning its chromatic glow from emerald green to amber warning, then pulsing crimson red, followed by an actionable pedagogical intervention card gliding into focus.
   - Fallback Poster: `risk-alert-poster.svg`

## Browser & Accessibility Compliance
All videos are rendered using:
`<video autoplay muted loop playsinline preload="metadata" poster="...">`
and conditionally pause or convert to static glassmorphic states when `prefers-reduced-motion: reduce` is detected.
