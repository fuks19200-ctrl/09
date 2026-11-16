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
    let targetActive = 0;
    let targetLocal = 0;
    let renderedActive = 0;
    let renderedLocal = 0;

    /*
     * The Bloom films are tied to REAL SITE SECTIONS, not arbitrary percentages
     * of the whole document.
     *
     * HERO → FLORA
     * COURSES → HAND
     * REFERRAL / FINAL BLOCK → BLACK HOLE
     *
     * This is what makes the visual story line up with what the visitor sees.
     * Scrolling down moves Flora → hand → black hole; scrolling up reverses it.
     */
    const getTimeline = () => {
      const hero = document.querySelector<HTMLElement>('.hero');
      const courses = document.querySelector<HTMLElement>('#courses');
      const finale = document.querySelector<HTMLElement>('.section--bottom');

      const heroStart = hero?.offsetTop ?? 0;
      const handStart = courses?.offsetTop ?? Math.round(document.documentElement.scrollHeight * 0.42);
      const holeStart = finale?.offsetTop ?? Math.round(document.documentElement.scrollHeight * 0.82);

      const scrollY = window.scrollY;

      if (scrollY <= handStart) {
        return {
          active: 0,
          local: Math.min(1, Math.max(0, (scrollY - heroStart) / Math.max(1, handStart - heroStart))),
        };
      }

      if (scrollY < holeStart) {
        return {
          active: 1,
          local: Math.min(1, Math.max(0, (scrollY - handStart) / Math.max(1, holeStart - handStart))),
        };
      }

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      return {
        active: 2,
        local: Math.min(1, Math.max(0, (scrollY - holeStart) / Math.max(1, maxScroll - holeStart))),
      };
    };

    const setVisibleScene = (active: number) => {
      videos.forEach((video, index) => {
        const opacity = index === active ? '1' : '0';
        const visibility = index === active ? 'visible' : 'hidden';
        if (video.style.opacity !== opacity) video.style.opacity = opacity;
        if (video.style.visibility !== visibility) video.style.visibility = visibility;
      });
    };

    const render = () => {
      raf = 0;

      if (ready < videos.length) {
        raf = requestAnimationFrame(render);
        return;
      }

      // Smooth within each real page section. At a scene boundary we switch
      // once, then scrub only the newly active film from its first to last frame.
      renderedActive += (targetActive - renderedActive) * 0.32;
      renderedLocal += (targetLocal - renderedLocal) * 0.22;

      const active = Math.abs(targetActive - renderedActive) > 0.45
        ? targetActive
        : Math.round(renderedActive);
      const local = Math.min(1, Math.max(0, renderedLocal));

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
        Math.abs(targetActive - renderedActive) > 0.01 ||
        Math.abs(targetLocal - renderedLocal) > 0.0005 ||
        ready < videos.length
      ) {
        raf = requestAnimationFrame(render);
      }
    };

    const updateTarget = () => {
      const timeline = getTimeline();
      targetActive = timeline.active;
      targetLocal = timeline.local;
      if (!raf) raf = requestAnimationFrame(render);
    };

    const onMetadata = (video: HTMLVideoElement) => {
      if (video.dataset.ready === '1') return;
      video.dataset.ready = '1';
      ready += 1;
      updateTarget();
    };

    videos.forEach((video, index) => {
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.pause();
      try { video.currentTime = 0; } catch {}
      video.style.opacity = index === 0 ? '1' : '0';
      video.style.visibility = index === 0 ? 'visible' : 'hidden';
      video.style.transition = 'none';
      video.addEventListener('loadedmetadata', () => onMetadata(video), { once: true });

      if (video.readyState >= 1) {
        onMetadata(video);
      } else {
        video.load();
      }
    });

    const initialTimeline = getTimeline();
    targetActive = initialTimeline.active;
    targetLocal = initialTimeline.local;
    renderedActive = targetActive;
    renderedLocal = targetLocal;
    setVisibleScene(targetActive);
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
