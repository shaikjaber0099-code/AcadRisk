# Higgsfield Video Generation Prompts for AcadRisk

These production prompts are formulated for Higgsfield AI (or compatible video generation engines like Runway Gen-3 / Sora) to generate background motion assets for AcadRisk.

---

## 1. Hero Ambient Loop (`hero-loop.mp4`)

- **Format**: 16:9 widescreen, 1080p / 4K, 60fps, 8-10 seconds, seamless loop.
- **Camera Movement**: Slow cinematic dolly-in, steady camera crane forward, subtle floating perspective.
- **Lighting**: Twilight interior ambient lighting, warm desk reading lamps contrasted with cool bioluminescent blue and violet holographic emissions.
- **Visual Description**:
  > "A cinematic architectural interior of a state-of-the-art futuristic university library at dusk. Deep wooden mahogany and frosted glass study pods. University students are seated intently studying. Floating 3D holographic analytics charts, trend lines, and geometric risk distribution lattices hover softly 2 feet above tables in glowing violet, indigo, and cyan luminescence. Swirls of subtle blue/violet ambient micro-particles float lazily through the volumetric light rays. Shallow depth of field (f/1.8), bokeh background, photorealistic 8k, Unreal Engine 5 render aesthetic, slow steady dolly-in, perfectly seamless looping."
- **Negative Prompt**:
  > "jerky motion, sudden cuts, glitching, cartoonish, low resolution, oversaturated neon, distorted faces, text artifacts, strobe lights."

---

## 2. Abstract Data Stream Background (`data-stream.mp4`)

- **Format**: 16:9 or vertical responsive, 10-15 seconds, seamless infinite loop.
- **Camera Movement**: Slow continuous orbital tracking shot through abstract space.
- **Lighting**: Dark navy `#070b14` obsidian void, glowing electric indigo (`#6366f1`), ultraviolet (`#8b5cf6`), and cyber cyan (`#06b6d4`).
- **Visual Description**:
  > "Macro view of abstract, organic data streams and computational nodes flowing horizontally and curving elegantly through deep navy obsidian space. Fine glowing fiber-optic threads connect glowing data clusters. Subtle light pulses travel along pathways at varying gentle speeds. Clean, sophisticated edtech data visualization aesthetic. Volumetric fog, glass prism refractions, 60fps silky smooth fluid simulation, ultra-clean mathematical beauty, loop seamlessly."
- **Negative Prompt**:
  > "explosions, chaotic motion, harsh bright flashes, noise, pixelation, low-framerate, abrupt transitions."

---

## 3. Dynamic Risk Alert Clip (`risk-alert.mp4`)

- **Format**: 16:9 or 4:3 card container, 4-5 seconds loop.
- **Camera Movement**: Centered fixed frame with dynamic 3D depth tilt.
- **Lighting & Transitions**:
  > "A sleek glassmorphic student analytics telemetry card on a dark navy backdrop. The card's glowing status border and biometric indicator fluidly transition from calm emerald green (Low Risk) to pulsing amber yellow (Moderate Warning), before shifting into a vivid crimson red pulse (High Risk). As the red warning stabilizes, a secondary frosted glass panel containing structured pedagogical recommendations smoothly slides in from the right edge with a soft luminous violet accent. High-end motion design, Apple UI animation polish, 60fps."
- **Negative Prompt**:
  > "stuttering, harsh pixelated edges, low framerate, abrupt color snaps without gradient easing."

---

## 4. Poster Fallbacks Specification

If offline or running without video codecs, the application relies on:
- `/public/media/hero-poster.svg`
- `/public/media/data-stream-poster.svg`
- `/public/media/risk-alert-poster.svg`

All video tags in AcadRisk follow standard accessibility and performance guidelines:
```html
<video 
  autoPlay 
  muted 
  loop 
  playsInline 
  preload="metadata" 
  poster="/media/hero-poster.svg"
  className="w-full h-full object-cover"
/>
```
Users with `prefers-reduced-motion` enabled are automatically served static glassmorphism states.
