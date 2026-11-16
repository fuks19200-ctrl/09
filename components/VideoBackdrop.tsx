'use client';

import { useEffect, useRef } from 'react';

export default function VideoBackdrop() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const videos = Array.from(
      root.querySelectorAll<HTMLVideoElement>('.backdrop__video'),
    );

    if (videos.length !== 3) return;

    let raf = 0;
    let ready = 0;
    let targetProgress = 0;
    let renderedProgress = 0;

    const maxScroll = () =>
      Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    /*
     * One continuous scroll timeline — exactly in the visual order of the site:
     *
     * 0.00 → 0.38  FLORA / opening hero
     * 0.38 → 0.76  HAND / transition
     * 0.76 → 1.00  BLACK HOLE / final scene
     *
     * The first viewport is always Flora. Scrolling DOWN moves forward;
     * scrolling UP reverses the same timeline. There is no autoplay and
     * the black hole cannot appear before the final quarter of the journey.
     */
    const getProgress = () =>
      Math.min(1, Math.max(0, window.scrollY / maxScroll()));

    const setVisibleScene = (active: number) => {
      videos.forEach((video, index) => {
        const opacity = index === active ? '1' : '0';
        if (video.style.opacity !== opacity) {
          video.style.opacity = opacity;
        }
      });
    };

    const render = () => {
      raf = 0;

      if (ready < videos.length) {
        raf = requestAnimationFrame(render);
        return;
      }

      // Smooth the scroll itself so the video never jumps frame-to-frame.
      renderedProgress += (targetProgress - renderedProgress) * 0.22;

      const timeline = Math.min(0.999999, Math.max(0, renderedProgress));
      const stops = [0, 0.38, 0.76, 1];
      let active = 0;

      for (let index = 0; index < stops.length - 1; index += 1) {
        if (timeline >= stops[index] && timeline < stops[index + 1]) {
          active = index;
          break;
        }
      }

      if (timeline >= stops[stops.length - 1]) {
        active = videos.length - 1;
      }

      const rangeStart = stops[active];
      const rangeEnd = stops[active + 1];
      const local = (timeline - rangeStart) / Math.max(0.0001, rangeEnd - rangeStart);

      setVisibleScene(active);

      videos.forEach((video, index) => {
        if (!Number.isFinite(video.duration) || video.duration <= 0) return;

        // Keep every non-active film parked. Nothing plays by itself.
        if (index !== active) {
          video.pause();
          return;
        }

        const safeLocal = Math.min(1, Math.max(0, local));
        const targetTime = Math.min(
          Math.max(0, video.duration - 0.04),
          safeLocal * video.duration,
        );

        if (Math.abs(video.currentTime - targetTime) > 0.001) {
          try {
            video.currentTime = targetTime;
          } catch {
            // Browser may reject a seek while media metadata is updating.
          }
        }

        video.pause();
      });

      if (
        Math.abs(targetProgress - renderedProgress) > 0.0005 ||
        ready < videos.length
      ) {
        raf = requestAnimationFrame(render);
      }
    };

    const updateTarget = () => {
      targetProgress = getProgress();
      if (!raf) raf = requestAnimationFrame(render);
    };

    const onMetadata = () => {
      ready += 1;
      updateTarget();
    };

    videos.forEach((video, index) => {
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.pause();
      video.currentTime = 0;
      video.style.opacity = index === 0 ? '1' : '0';
      video.style.transition = 'none';
      video.addEventListener('loadedmetadata', onMetadata, { once: true });

      if (video.readyState >= 1) {
        onMetadata();
      } else {
        video.load();
      }
    });

    targetProgress = getProgress();
    renderedProgress = targetProgress;
    setVisibleScene(0);
    if (!raf) raf = requestAnimationFrame(render);

    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', updateTarget, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateTarget);
      window.removeEventListener('resize', updateTarget);

      videos.forEach((video) => {
        video.pause();
        video.removeAttribute('src');
        video.load();
      });

      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className="backdrop" aria-hidden="true">
      {/* 01 — Flora: the opening visual / first page */}
      <video
        className="backdrop__video"
        poster="/images/bg-3.jpg"
        muted
        playsInline
        preload="auto"
      >
        <source src="/videos/bloom-bg-3.mp4" type="video/mp4" />
      </video>

      {/* 02 — Hand: appears only after scrolling through Flora */}
      <video
        className="backdrop__video"
        poster="/images/bg-2.jpg"
        muted
        playsInline
        preload="auto"
      >
        <source src="/videos/bloom-bg-2.mp4" type="video/mp4" />
      </video>

      {/* 03 — Black hole: final scene only */}
      <video
        className="backdrop__video"
        poster="/images/bg-1.jpg"
        muted
        playsInline
        preload="auto"
      >
        <source src="/videos/bloom-bg-1.mp4" type="video/mp4" />
      </video>

      <div className="backdrop__shade" />
      <div className="backdrop__grain" />
      <div className="backdrop__vignette" />
    </div>
  );
}
