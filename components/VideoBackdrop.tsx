'use client';

import { useEffect, useRef } from 'react';

type BloomScrollEvent = CustomEvent<{ scroll: number }>;

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
    let active = 0;
    let targetLocal = 0;
    let renderedLocal = 0;
    let lastScroll = window.scrollY;

    const sectionTop = (selector: string) => {
      const el = document.querySelector<HTMLElement>(selector);
      if (!el) return null;
      return el.getBoundingClientRect().top + lastScroll;
    };

    const getTimeline = (scrollY: number) => {
      lastScroll = scrollY;

      const coursesTop =
        sectionTop('#courses') ??
        Math.round(document.documentElement.scrollHeight * 0.42);
      const finaleTop =
        sectionTop('.section--bottom') ??
        Math.round(document.documentElement.scrollHeight * 0.82);
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );

      // 01 — HERO: Flora / woman.
      if (scrollY < coursesTop) {
        return {
          active: 0,
          local: Math.max(0, Math.min(1, scrollY / Math.max(1, coursesTop))),
        };
      }

      // 02 — COURSES: hand.
      if (scrollY < finaleTop) {
        return {
          active: 1,
          local: Math.max(
            0,
            Math.min(
              1,
              (scrollY - coursesTop) / Math.max(1, finaleTop - coursesTop),
            ),
          ),
        };
      }

      // 03 — FINAL: bloom / black-hole transition.
      return {
        active: 2,
        local: Math.max(
          0,
          Math.min(
            1,
            (scrollY - finaleTop) / Math.max(1, maxScroll - finaleTop),
          ),
        ),
      };
    };

    const showOnly = (nextActive: number) => {
      videos.forEach((video, index) => {
        const visible = index === nextActive;
        video.style.opacity = visible ? '1' : '0';
        video.style.visibility = visible ? 'visible' : 'hidden';
        video.style.pointerEvents = 'none';
        if (!visible) video.pause();
      });
    };

    const render = () => {
      raf = 0;

      if (ready < videos.length) {
        raf = requestAnimationFrame(render);
        return;
      }

      renderedLocal += (targetLocal - renderedLocal) * 0.28;
      const local = Math.max(0, Math.min(1, renderedLocal));
      const video = videos[active];

      if (video && Number.isFinite(video.duration) && video.duration > 0) {
        const targetTime = Math.min(
          Math.max(0, video.duration - 0.04),
          local * video.duration,
        );

        if (Math.abs(video.currentTime - targetTime) > 0.001) {
          try {
            video.currentTime = targetTime;
          } catch {}
        }
        video.pause();
      }

      if (Math.abs(targetLocal - renderedLocal) > 0.0005) {
        raf = requestAnimationFrame(render);
      }
    };

    const applyScroll = (scrollY: number) => {
      const timeline = getTimeline(scrollY);

      if (timeline.active !== active) {
        active = timeline.active;
        renderedLocal = timeline.local;
        targetLocal = timeline.local;
        showOnly(active);

        const video = videos[active];
        try {
          video.currentTime = 0;
        } catch {}
      } else {
        targetLocal = timeline.local;
      }

      if (!raf) raf = requestAnimationFrame(render);
    };

    const onNativeScroll = () => applyScroll(window.scrollY);
    const onLenisScroll = (event: BloomScrollEvent) =>
      applyScroll(event.detail.scroll);

    const onMetadata = (video: HTMLVideoElement) => {
      if (video.dataset.ready === '1') return;
      video.dataset.ready = '1';
      ready += 1;
      if (!raf) raf = requestAnimationFrame(render);
    };

    videos.forEach((video, index) => {
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.pause();
      video.style.transition = 'none';
      video.style.opacity = index === 0 ? '1' : '0';
      video.style.visibility = index === 0 ? 'visible' : 'hidden';

      video.addEventListener(
        'loadedmetadata',
        () => onMetadata(video),
        { once: true },
      );

      if (video.readyState >= 1) onMetadata(video);
      else video.load();
    });

    // Always start at Flora.
    active = 0;
    targetLocal = 0;
    renderedLocal = 0;
    showOnly(0);

    const initial = getTimeline(window.scrollY);
    active = initial.active;
    targetLocal = initial.local;
    renderedLocal = initial.local;
    showOnly(active);

    window.addEventListener('scroll', onNativeScroll, { passive: true });
    window.addEventListener('resize', onNativeScroll, { passive: true });
    window.addEventListener(
      'multum-lenis-scroll',
      onLenisScroll as EventListener,
    );

    return () => {
      window.removeEventListener('scroll', onNativeScroll);
      window.removeEventListener('resize', onNativeScroll);
      window.removeEventListener(
        'multum-lenis-scroll',
        onLenisScroll as EventListener,
      );

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
      <video
        className="backdrop__video"
        poster="/images/bg-1.jpg"
        muted
        playsInline
        preload="auto"
      >
        <source src="/videos/bloom-bg-1.mp4" type="video/mp4" />
      </video>

      <video
        className="backdrop__video"
        poster="/images/bg-2.jpg"
        muted
        playsInline
        preload="auto"
      >
        <source src="/videos/bloom-bg-2.mp4" type="video/mp4" />
      </video>

      <video
        className="backdrop__video"
        poster="/images/bg-3.jpg"
        muted
        playsInline
        preload="auto"
      >
        <source src="/videos/bloom-bg-3.mp4" type="video/mp4" />
      </video>

      <div className="backdrop__shade" />
      <div className="backdrop__grain" />
      <div className="backdrop__vignette" />
    </div>
  );
}
