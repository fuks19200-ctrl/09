'use client';

import { useEffect, useRef } from 'react';

export default function VideoBackdrop() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const videos = Array.from(root.querySelectorAll<HTMLVideoElement>('.backdrop__video'));
    if (!videos.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;

    videos.forEach((video, index) => {
      video.muted = true;
      video.playsInline = true;
      video.preload = index === 0 && !coarse ? 'auto' : 'metadata';
    });

    const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    let active = 0;
    let lastProgress = -1;
    let raf = 0;

    const setActive = (index: number) => {
      if (index === active) return;

      videos.forEach((video, i) => {
        const isActive = i === index;
        video.classList.toggle('is-active', isActive);

        if (!isActive) {
          video.pause();
        } else if (!reduced) {
          video.play().catch(() => {});
        }
      });

      active = index;
    };

    const scrub = () => {
      raf = 0;

      const progress = Math.min(0.999999, Math.max(0, window.scrollY / maxScroll()));
      if (Math.abs(progress - lastProgress) < 0.0007) return;
      lastProgress = progress;

      const scaled = progress * videos.length;
      const index = Math.min(videos.length - 1, Math.floor(scaled));
      const local = scaled - index;
      setActive(index);

      const video = videos[index];

      if (reduced || coarse) return;
      if (video.readyState < 1 || !Number.isFinite(video.duration) || video.duration <= 0) return;

      const target = Math.min(video.duration - 0.05, Math.max(0, local * video.duration));
      if (Math.abs(video.currentTime - target) > 0.035) {
        try {
          video.currentTime = target;
        } catch {
          // Ignore seek races while metadata/network state changes.
        }
      }
    };

    const requestScrub = () => {
      if (!raf) raf = requestAnimationFrame(scrub);
    };

    videos.forEach((video) => {
      video.addEventListener('loadedmetadata', requestScrub);
    });

    videos[0]?.play().catch(() => {});

    window.addEventListener('scroll', requestScrub, { passive: true });
    window.addEventListener('resize', requestScrub, { passive: true });

    requestScrub();

    return () => {
      window.removeEventListener('scroll', requestScrub);
      window.removeEventListener('resize', requestScrub);
      videos.forEach((video) => {
        video.removeEventListener('loadedmetadata', requestScrub);
        video.pause();
      });
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className="backdrop" aria-hidden="true">
      <video className="backdrop__video is-active" poster="/images/bg-1.jpg" muted playsInline preload="auto">
        <source src="/videos/bloom-bg-1.mp4" type="video/mp4" />
      </video>
      <video className="backdrop__video" poster="/images/bg-2.jpg" muted playsInline preload="metadata">
        <source src="/videos/bloom-bg-2.mp4" type="video/mp4" />
      </video>
      <video className="backdrop__video" poster="/images/bg-3.jpg" muted playsInline preload="metadata">
        <source src="/videos/bloom-bg-3.mp4" type="video/mp4" />
      </video>
      <div className="backdrop__shade" />
      <div className="backdrop__grain" />
      <div className="backdrop__vignette" />
    </div>
  );
}
