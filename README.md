# MULTUM.AI — Creative Intelligence Website

Immersive dark / liquid-glass landing page for MULTUM.AI using Next.js, React, Three.js / R3F, GSAP, ScrollTrigger and Lenis.

## 1. Install

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 2. Add the real hero video

The design intentionally expects the existing hero video at:

`public/videos/hero.mp4`

Replace that file with the original video. The code keeps the video as one continuous background layer and does not split the person/hand into independent elements.

Optional poster:

`public/images/video-poster.jpg`

## 3. Configure real links

Copy `.env.example` to `.env.local` and fill in the real approved links:

- Instagram
- Telegram
- offer
- privacy policy
- terms
- contact email

Do not invent production URLs.

## 4. Architecture

- `components/VideoBackdrop.tsx` — one persistent video + one black scroll-controlled overlay.
- `components/NeuralScene.tsx` — lazy-loaded R3F scene isolated from the DOM.
- `components/WorksCarousel.tsx` — one carousel controlled by category tabs and arrows.
- `components/Pricing.tsx` — BASIC / ULTRA / ULTIMATE with content modal and course selection.
- `components/LeadForm.tsx` — single-contact-method form.
- `components/FAQ.tsx` — glass accordion.
- `components/MagneticButton.tsx` — desktop magnetic interaction; disabled on coarse pointers.
- `components/LenisProvider.tsx` — smooth scrolling.
- `lib/data.ts` — editable content.

## 5. Performance rules used

- WebGL is isolated from normal DOM layout.
- R3F uses capped DPR and no expensive bloom/postprocessing.
- `antialias: false` and `powerPreference: default` are used for Safari/iOS stability.
- Magnetic interaction is disabled on touch/coarse pointers.
- `prefers-reduced-motion` is respected.
- The video is not transformed to make room for text.
- The dark overlay is a single persistent layer and never stacks per section.
- Glass is CSS backdrop-filter, not a full-screen WebGL distortion pass.

## 6. Production checklist

Before publishing:

1. Put the original hero video in `public/videos/hero.mp4`.
2. Replace the placeholder social/document URLs.
3. Connect the lead form to the real CRM/API.
4. Connect referral-code validation to the approved referral rules.
5. Replace procedural work visuals with approved project images if desired.
6. Test Safari iOS, Chrome mobile, tablet and desktop.
7. Run a production build:

```bash
npm run build
npm run start
```
