'use client';

import { useEffect, useRef } from 'react';

type LenisScrollEvent = CustomEvent<{ scroll: number }>;

export default function VideoBackdrop() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = root?.querySelector<HTMLCanvasElement>('.backdrop__canvas');
    if (!root || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    const videos = Array.from(root.querySelectorAll<HTMLVideoElement>('.backdrop__video'));
    if (videos.length !== 3) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 700px)');
    const durations = [0, 0, 0];
    const posters = [1, 2, 3].map((n) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = `/images/bg-${n}.jpg`;
      return image;
    });

    let progress = 0;
    let target = 0;
    let lastScroll = window.scrollY;
    let raf = 0;
    let drawRaf = 0;
    let seekTimer = 0;
    let seekRaf = 0;
    let activeIndex = 0;
    let loaded = [false, false, false];
    let timeline: Array<[number, number]> = [];
    let dirty = true;
    let running = false;

    const clamp = (value: number, min = 0, max = 1) =>
      Math.max(min, Math.min(max, value));

    const documentTop = (el: HTMLElement) =>
      el.getBoundingClientRect().top + lastScroll;

    const activeVideo = (value: number) =>
      value < 1 / 3 ? 0 : value < 2 / 3 ? 1 : 2;

    const refreshSceneAnchors = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const section = (selector: string) => document.querySelector<HTMLElement>(selector);
      const focal = (selector: string) => {
        const el = section(selector);
        if (!el) return 0;
        return documentTop(el) + (el.offsetHeight - window.innerHeight) * 0.5;
      };

      const courses = section('#courses');
      if (!courses) return;

      const raw: Array<[number, number]> = [
        [0, 0],
        [focal('#method'), 0.105],
        [focal('#about'), 0.19],
        [documentTop(courses) - window.innerHeight * 0.2, 7 / 24],
        [documentTop(courses) + courses.offsetHeight - window.innerHeight * 0.3, 8.35 / 24],
        [focal('#contact'), 0.53],
        [focal('#faq'), 0.65],
        [Math.min(max - window.innerHeight * 0.2, focal('.section--bottom')), 0.82],
        [max, 1],
      ];

      timeline = [];
      for (const [position, frame] of raw) {
        const y = Math.max(0, Math.min(max, position));
        if (timeline.length && y <= timeline[timeline.length - 1][0]) {
          if (frame === 1) timeline[timeline.length - 1] = [max, 1];
          continue;
        }
        timeline.push([y, frame]);
      }
      if (!timeline.length || timeline[timeline.length - 1][0] < max) {
        timeline.push([max, 1]);
      }
    };

    const filmProgress = (scrollY: number) => {
      if (!timeline.length) return 0;
      for (let i = 1; i < timeline.length; i += 1) {
        const [end, to] = timeline[i];
        const [start, from] = timeline[i - 1];
        if (scrollY <= end) {
          return from + (to - from) * clamp((scrollY - start) / Math.max(1, end - start));
        }
      }
      return 1;
    };

    const resize = () => {
      const rect = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, mobile.matches ? 1 : 1.25);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      dirty = true;
      scheduleDraw();
    };

    const draw = () => {
      drawRaf = 0;
      if (!dirty) return;

      const index = activeIndex;
      const video = videos[index];
      const poster = posters[index];

      let source: CanvasImageSource | null = null;
      if (video.readyState >= 2 && video.videoWidth > 0) source = video;
      else if (poster.complete && poster.naturalWidth > 0) source = poster;
      if (!source) return;

      const dpr = Math.min(window.devicePixelRatio || 1, mobile.matches ? 1 : 1.25);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const sourceWidth = video.videoWidth || poster.naturalWidth || 1920;
      const sourceHeight = video.videoHeight || poster.naturalHeight || 1080;
      const sourceAspect = sourceWidth / sourceHeight;
      const canvasAspect = width / Math.max(1, height);

      let drawWidth = width;
      let drawHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      if (sourceAspect > canvasAspect) {
        drawWidth = height * sourceAspect;
        offsetX = (width - drawWidth) / 2;
      } else {
        drawHeight = width / sourceAspect;
        offsetY = (height - drawHeight) / 2;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#090609';
      ctx.fillRect(0, 0, width, height);
      try {
        ctx.drawImage(source, offsetX, offsetY, drawWidth, drawHeight);
        dirty = false;
      } catch {
        // Keep the existing frame if the browser is between video seeks.
      }
    };

    const scheduleDraw = () => {
      dirty = true;
      if (drawRaf) return;
      drawRaf = requestAnimationFrame(draw);
    };

    const ensureVideoLoaded = (index: number) => {
      if (mobile.matches || loaded[index]) return;
      loaded[index] = true;
      const video = videos[index];
      video.preload = 'metadata';
      video.load();
    };

    const unloadVideo = (index: number) => {
      if (index === activeIndex || !loaded[index]) return;
      const video = videos[index];
      video.pause();
      video.removeAttribute('src');
      video.load();
      loaded[index] = false;
      durations[index] = 0;
    };

    const seekToProgress = (force = false) => {
      if (mobile.matches || reducedMotion.matches) return;

      const index = activeIndex;
      const video = videos[index];
      const duration = durations[index] || video.duration || 0;
      if (!duration || video.seeking || video.readyState < 1) return;

      const start = index === 0 ? 0 : index === 1 ? 1 / 3 : 2 / 3;
      const local = clamp((progress - start) / (1 / 3));
      const time = local * Math.max(0, duration - 0.05);
      const lastTime = Number(video.dataset.lastSeek || -1);

      if (!force && Math.abs(lastTime - time) < 0.14) return;

      video.dataset.lastSeek = String(time);
      try {
        video.currentTime = time;
      } catch {
        // Metadata may not be ready yet.
      }
    };

    const setActiveScene = (nextIndex: number) => {
      if (nextIndex === activeIndex) return;

      const previous = activeIndex;
      activeIndex = nextIndex;
      ensureVideoLoaded(nextIndex);
      scheduleDraw();
      window.clearTimeout(seekTimer);
      seekTimer = window.setTimeout(() => seekToProgress(true), 70);
      if (previous !== nextIndex) window.setTimeout(() => unloadVideo(previous), 1200);
    };

    const updateTarget = (scrollY: number) => {
      lastScroll = Math.max(0, scrollY);
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      target = filmProgress(clamp(lastScroll / maxScroll) * maxScroll);

      const nextIndex = activeVideo(target);
      setActiveScene(nextIndex);

      const darkness = clamp(
        (lastScroll - window.innerHeight * 0.35) /
          Math.max(1, window.innerHeight * 0.55),
      );
      const shade = root.querySelector<HTMLElement>('.backdrop__shade');
      const readability = root.querySelector<HTMLElement>('.backdrop__readability');
      if (shade) shade.style.opacity = String(0.55 * darkness);
      if (readability) readability.style.opacity = String(1 - darkness);

      if (!mobile.matches) {
        ensureVideoLoaded(activeIndex);
        seekToProgress();
      }
      scheduleDraw();

      const moving = Math.abs(target - progress) > 0.00008;
      running = moving;
      if (moving && !raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      raf = 0;
      const diff = target - progress;
      progress += diff * 0.075;
      if (Math.abs(diff) < 0.00008) {
        progress = target;
        running = false;
        scheduleDraw();
        return;
      }

      if (!mobile.matches) {
        if (seekRaf) cancelAnimationFrame(seekRaf);
        seekRaf = requestAnimationFrame(() => {
          seekRaf = 0;
          seekToProgress();
        });
      }
      scheduleDraw();
      raf = requestAnimationFrame(tick);
    };

    const onNativeScroll = () => updateTarget(window.scrollY);
    const onLenisScroll = (event: LenisScrollEvent) => updateTarget(event.detail.scroll);

    const onMediaChange = () => {
      if (mobile.matches) {
        videos.forEach((video) => {
          video.pause();
          video.removeAttribute('src');
          video.load();
        });
        loaded = [false, false, false];
        resize();
        activeIndex = 0;
        progress = target;
        scheduleDraw();
      } else {
        ensureVideoLoaded(activeIndex);
        seekToProgress(true);
        scheduleDraw();
      }
    };

    videos.forEach((video, index) => {
      video.loop = false;
      video.autoplay = false;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'none';

      video.addEventListener('loadedmetadata', () => {
        durations[index] = video.duration || 10;
        if (index === activeIndex) seekToProgress(true);
        scheduleDraw();
      });
      video.addEventListener('loadeddata', scheduleDraw);
      video.addEventListener('seeked', scheduleDraw);
    });

    posters.forEach((poster) => poster.addEventListener('load', scheduleDraw));

    refreshSceneAnchors();
    target = filmProgress(lastScroll);
    progress = target;
    activeIndex = activeVideo(target);
    resize();

    if (!mobile.matches) ensureVideoLoaded(activeIndex);
    updateTarget(lastScroll);

    window.addEventListener('resize', () => {
      refreshSceneAnchors();
      resize();
      updateTarget(lastScroll);
    }, { passive: true });

    window.addEventListener('scroll', onNativeScroll, { passive: true });
    window.addEventListener('multum-lenis-scroll', onLenisScroll as EventListener);
    mobile.addEventListener('change', onMediaChange);

    const observer = new ResizeObserver(() => {
      refreshSceneAnchors();
      scheduleDraw();
    });
    observer.observe(document.querySelector('main') || root);

    const fontsReady = document.fonts?.ready.then(() => {
      refreshSceneAnchors();
      updateTarget(lastScroll);
      scheduleDraw();
    });

    return () => {
      window.removeEventListener('scroll', onNativeScroll);
      window.removeEventListener('multum-lenis-scroll', onLenisScroll as EventListener);
      mobile.removeEventListener('change', onMediaChange);
      if (raf) cancelAnimationFrame(raf);
      if (seekRaf) cancelAnimationFrame(seekRaf);
      if (drawRaf) cancelAnimationFrame(drawRaf);
      window.clearTimeout(seekTimer);
      observer.disconnect();
      void fontsReady;
      videos.forEach((video) => {
        video.pause();
        video.removeAttribute('src');
        video.load();
      });
    };
  }, []);

  return (
    <div ref={rootRef} className="backdrop" aria-hidden="true">
      <div className="backdrop__readability" />
      <canvas className="backdrop__canvas" />
      <video className="backdrop__video" muted playsInline preload="none">
        <source src="/videos/bloom-bg-1.mp4" type="video/mp4" />
      </video>
      <video className="backdrop__video" muted playsInline preload="none">
        <source src="/videos/bloom-bg-2.mp4" type="video/mp4" />
      </video>
      <video className="backdrop__video" muted playsInline preload="none">
        <source src="/videos/bloom-bg-3.mp4" type="video/mp4" />
      </video>
      <div className="backdrop__shade" />
      <div className="backdrop__grain" />
      <div className="backdrop__vignette" />
    </div>
  );
}
