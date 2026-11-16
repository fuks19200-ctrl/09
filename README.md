# MULTUM.AI — Creative Intelligence Website

Immersive dark / liquid-glass landing page for MULTUM.AI using Next.js, React, Three.js / R3F, GSAP, ScrollTrigger and Lenis.

## Install

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Project media

The cinematic background sequence is stored in:

- `public/videos/bloom-bg-1.mp4`
- `public/videos/bloom-bg-2.mp4`
- `public/videos/bloom-bg-3.mp4`

Poster/background images:

- `public/images/bg-1.jpg`
- `public/images/bg-2.jpg`
- `public/images/bg-3.jpg`

Project visuals:

- `public/images/01-ai-character.png`
- `public/images/02-ai-product.png`
- `public/images/03-ai-3d.png`
- `public/images/04-ai-visual.png`
- `public/images/05-ai-automation.png`

## Architecture

- `components/VideoBackdrop.tsx` — one persistent cinematic background system with three timeline clips.
- `components/LenisProvider.tsx` — Lenis smooth scrolling synchronized with GSAP ScrollTrigger.
- `components/NeuralScene.tsx` / `NeuralSceneInner.tsx` — isolated R3F scene with capped DPR and adaptive performance.
- `components/WorksCarousel.tsx` — project carousel using the real media in `public/images`.
- `components/Pricing.tsx` — BASIC / ULTRA / ULTIMATE program cards.
- `components/LeadForm.tsx` — lead form UI; connect it to the production CRM/API before launch.
- `components/FAQ.tsx` — glass accordion.
- `components/MagneticButton.tsx` — desktop magnetic interaction; disabled on coarse pointers.
- `lib/data.ts` — editable content.

## Performance principles

The site follows a performance-first creative-development approach:

- Keep the main thread free from unnecessary work during scroll.
- Prefer `transform` and `opacity` for animation.
- Avoid React state updates on every animation frame.
- Keep WebGL isolated from normal DOM layout.
- Cap device pixel ratio and reduce 3D particle/geometry cost on smaller devices.
- Use R3F performance monitoring and adaptive DPR when the 3D scene is active.
- Avoid expensive post-processing and full-screen WebGL distortion unless the visual value justifies the GPU cost.
- Respect `prefers-reduced-motion`.
- Lazy-load project images.
- Load only the first cinematic video eagerly; later clips use metadata until needed.
- On coarse/mobile pointers, use the cinematic poster sequence instead of continuously seeking video frames.
- Keep Safari/iOS behavior conservative.

## GitHub Pages

The site is exported statically with Next.js:

`next.config.ts` uses `output: 'export'`.

Deployment is handled by:

`.github/workflows/deploy.yml`

The repository Pages source must remain **GitHub Actions**.

The custom domain configured in GitHub Pages is:

`multum.online`

GitHub Pages custom-domain configuration is controlled from repository Settings → Pages. With a custom GitHub Actions publishing workflow, GitHub states that a repository CNAME file is not required; it is retained here only as a compatibility marker.

## Production checklist

Before launch:

1. Connect the lead form to the real CRM/API.
2. Replace placeholder social/legal/contact environment variables.
3. Verify `multum.online` DNS and HTTPS.
4. Test Safari desktop, Safari iOS, Chrome mobile, tablet and desktop.
5. Check scroll/input responsiveness in Chrome DevTools Performance and Safari Web Inspector.
6. Run:

```bash
npm run build
```
