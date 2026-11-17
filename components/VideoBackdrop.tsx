'use client';

import { useEffect, useRef } from 'react';

type LenisScrollEvent = CustomEvent<{ scroll: number; isScrolling?: boolean }>;

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
    let activeIndex = 0;
    let previousIndex = -1;
    let transitionStartedAt = 0;
    let transitionRaf = 0;
    let loaded = [false, false, false];
    let timeline: Array<[number, number]> = [];
    let dirty = true;
    let videoFrameCallbacks: number[] = [0, 0, 0];
    let scrollStopTimer = 0;
    let scrolling = false;

    const clamp = (value: number, min = 0, max = 1) =>
      Math.max(min, Math.min(max, value));

    const documentTop = (el: HTMLElement) =>
      el.getBoundingClientRect().top + lastScroll;

    const activeVideo = (value: number) =>
      value < 1 / 3 ? 0 : value < 2 / 3 ? 1 : 2;

    // The three 8-second films form one continuous visual sequence.
    // Clip 2 contains the hole later in the shot, so it must not restart
    // from its opening hand frame when the first film ends.
    const clipStartOffset = [0, 5.2, 0] as const;
    const transitionDuration = 180;

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

    const applySmoothMotion = () => {
      // The scroll position controls only a gentle camera move. We never seek
      // the video to a scroll frame, because currentTime scrubbing is what
      // creates the visible "Nokia / frame-by-frame" stutter.
      const scale = 1.045 + progress * 0.035;
      const x = (progress - 0.5) * -16;
      const y = (progress - 0.5) * -8;
      canvas.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      canvas.style.transformOrigin = '50% 50%';
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
      applySmoothMotion();
    };

    const draw = () => {
      drawRaf = 0;
      if (!dirty) return;

      const dpr = Math.min(window.devicePixelRatio || 1, mobile.matches ? 1 : 1.25);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const canvasAspect = width / Math.max(1, height);

      const drawSource = (index: number, alpha = 1) => {
        const video = videos[index];
        const poster = posters[index];
        const source: CanvasImageSource | null =
          !mobile.matches && video.readyState >= 2 && video.videoWidth > 0
            ? video
            : poster.complete && poster.naturalWidth > 0
              ? poster
              : null;
        if (!source) return false;

        const sourceWidth = video.videoWidth || poster.naturalWidth || 1920;
        const sourceHeight = video.videoHeight || poster.naturalHeight || 1080;
        const sourceAspect = sourceWidth / sourceHeight;
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

        ctx.globalAlpha = alpha;
        ctx.drawImage(source, offsetX, offsetY, drawWidth, drawHeight);
        return true;
      };

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#090609';
      ctx.fillRect(0, 0, width, height);

      try {
        if (previousIndex >= 0 && transitionStartedAt) {
          const t = clamp((performance.now() - transitionStartedAt) / transitionDuration);
          const eased = t * t * (3 - 2 * t);
          drawSource(previousIndex, 1 - eased);
          drawSource(activeIndex, eased);
          ctx.globalAlpha = 1;
          if (t < 1) {
            dirty = true;
            if (!transitionRaf) transitionRaf = requestAnimationFrame(() => {
              transitionRaf = 0;
              scheduleDraw();
            });
          } else {
            previousIndex = -1;
            transitionStartedAt = 0;
            dirty = false;
          }
        } else {
          drawSource(activeIndex, 1);
          ctx.globalAlpha = 1;
          dirty = false;
        }
      } catch {
        ctx.globalAlpha = 1;
        // Keep the last good frame.
      }
    };

    const scheduleDraw = () => {
      dirty = true;
      if (drawRaf) return;
      drawRaf = requestAnimationFrame(draw);
    };

    const stopVideoFrameLoop = (index: number) => {
      const video = videos[index];
      const id = videoFrameCallbacks[index];
      if (id && 'cancelVideoFrameCallback' in video) {
        try { (video as HTMLVideoElement & { cancelVideoFrameCallback?: (handle: number) => void }).cancelVideoFrameCallback?.(id); } catch {}
      }
      videoFrameCallbacks[index] = 0;
    };

    const scheduleVideoFrame = (index: number) => {
      if (mobile.matches) return;
      const video = videos[index];
      if (index !== activeIndex || video.paused) return;

      const request = (video as HTMLVideoElement & {
        requestVideoFrameCallback?: (callback: () => void) => number;
      }).requestVideoFrameCallback;

      if (request) {
        videoFrameCallbacks[index] = request.call(video, () => {
          if (index === activeIndex) {
            dirty = true;
            scheduleDraw();
            scheduleVideoFrame(index);
          }
        });
      } else {
        scheduleDraw();
        requestAnimationFrame(() => scheduleVideoFrame(index));
      }
    };

    const ensureVideoLoaded = (index: number) => {
      if (mobile.matches || loaded[index]) return;
      loaded[index] = true;
      const video = videos[index];
      video.preload = 'auto';
      video.load();
      if (scrolling) void video.play().catch(() => {});
      scheduleVideoFrame(index);
    };

    const unloadVideo = (index: number) => {
      if (index === activeIndex || !loaded[index]) return;
      const video = videos[index];
      stopVideoFrameLoop(index);
      video.pause();
      video.removeAttribute('src');
      video.load();
      loaded[index] = false;
    };

    const setActiveScene = (nextIndex: number) => {
      if (nextIndex === activeIndex) return;

      const previous = activeIndex;
      stopVideoFrameLoop(previous);
      previousIndex = previous;
      transitionStartedAt = performance.now();
      activeIndex = nextIndex;
      dirty = true;

      if (!mobile.matches) {
        ensureVideoLoaded(nextIndex);
        const nextVideo = videos[nextIndex];
        const startAt = clipStartOffset[nextIndex];
        const setStart = () => {
          try { nextVideo.currentTime = startAt; } catch {}
          if (scrolling) void nextVideo.play().catch(() => {});
          dirty = true;
          scheduleDraw();
          scheduleVideoFrame(nextIndex);
        };
        if (nextVideo.readyState >= 1) setStart();
        else nextVideo.addEventListener('loadedmetadata', setStart, { once: true });
      }

      scheduleDraw();
      window.setTimeout(() => unloadVideo(previous), 1400);
    };

    const stopPlaybackImmediately = () => {
      scrolling = false;
      if (scrollStopTimer) {
        window.clearTimeout(scrollStopTimer);
        scrollStopTimer = 0;
      }
      videos.forEach((video, index) => {
        video.pause();
        stopVideoFrameLoop(index);
      });
    };

    const updateTarget = (scrollY: number) => {
      lastScroll = Math.max(0, scrollY);
      scrolling = true;
      if (scrollStopTimer) window.clearTimeout(scrollStopTimer);
      scrollStopTimer = window.setTimeout(() => {
        scrolling = false;
        videos.forEach((video) => video.pause());
        stopVideoFrameLoop(activeIndex);
      }, 110);
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      target = filmProgress(clamp(lastScroll / maxScroll) * maxScroll);

      setActiveScene(activeVideo(target));

      const darkness = clamp(
        (lastScroll - window.innerHeight * 0.35) /
          Math.max(1, window.innerHeight * 0.55),
      );
      const shade = root.querySelector<HTMLElement>('.backdrop__shade');
      const readability = root.querySelector<HTMLElement>('.backdrop__readability');
      if (shade) shade.style.opacity = String(0.55 * darkness);
      if (readability) readability.style.opacity = String(1 - darkness);

      if (!mobile.matches && !reducedMotion.matches) {
        ensureVideoLoaded(activeIndex);
        void videos[activeIndex].play().catch(() => {});
        scheduleVideoFrame(activeIndex);
      }
      scheduleDraw();

      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      raf = 0;
      const diff = target - progress;
      progress += diff * 0.16;
      if (Math.abs(diff) < 0.00008) {
        progress = target;
      } else {
        raf = requestAnimationFrame(tick);
      }
      applySmoothMotion();
    };

    const onNativeScroll = () => updateTarget(window.scrollY);
    const onLenisScroll = (event: LenisScrollEvent) => {
      updateTarget(event.detail.scroll);
      if (event.detail.isScrolling === false) stopPlaybackImmediately();
    };

    const onMediaChange = () => {
      if (mobile.matches) {
        videos.forEach((video, index) => {
          stopVideoFrameLoop(index);
          video.pause();
          video.removeAttribute('src');
          video.load();
        });
        loaded = [false, false, false];
        activeIndex = 0;
        progress = target;
        resize();
        scheduleDraw();
      } else {
        ensureVideoLoaded(activeIndex);
        scheduleDraw();
      }
    };

    videos.forEach((video, index) => {
      video.loop = false;
      video.autoplay = false;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'none';
      video.addEventListener('loadeddata', () => {
        if (index === activeIndex) {
          dirty = true;
          if (scrolling) void video.play().catch(() => {});
          scheduleDraw();
          scheduleVideoFrame(index);
        }
      });
    });

    posters.forEach((poster) => poster.addEventListener('load', scheduleDraw));

    refreshSceneAnchors();
    target = filmProgress(lastScroll);
    progress = target;
    activeIndex = activeVideo(target);
    resize();

    if (!mobile.matches && !reducedMotion.matches) {
      ensureVideoLoaded(activeIndex);
      videos[activeIndex].pause();
    }
    updateTarget(lastScroll);
    scrolling = false;
    videos.forEach((video) => video.pause());

    const onResize = () => {
      refreshSceneAnchors();
      resize();
      updateTarget(lastScroll);
    };

    window.addEventListener('resize', onResize, { passive: true });
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
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onNativeScroll);
      window.removeEventListener('multum-lenis-scroll', onLenisScroll as EventListener);
      mobile.removeEventListener('change', onMediaChange);
      if (raf) cancelAnimationFrame(raf);
      if (drawRaf) cancelAnimationFrame(drawRaf);
      if (transitionRaf) cancelAnimationFrame(transitionRaf);
      if (scrollStopTimer) window.clearTimeout(scrollStopTimer);
      videoFrameCallbacks.forEach((_, index) => stopVideoFrameLoop(index));
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
