'use client';

import { useEffect, useRef } from 'react';

export default function VideoBackdrop() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const video = root?.querySelector<HTMLVideoElement>('.backdrop__video');
    if (!root || !video) return;

    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.pause();

    let raf = 0;
    let lastProgress = -1;
    let ready = false;

    const maxScroll = () =>
      Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    const scrub = () => {
      raf = 0;

      const progress = Math.min(
        1,
        Math.max(0, window.scrollY / maxScroll())
      );

      if (Math.abs(progress - lastProgress) < 0.0005) return;
      lastProgress = progress;

      if (!ready || !Number.isFinite(video.duration) || video.duration <= 0) return;

      const target = Math.min(
        Math.max(0, video.duration - 0.05),
        progress * video.duration
      );

      if (Math.abs(video.currentTime - target) > 0.01) {
        try {
          video.currentTime = target;
        } catch {}
      }
    };

    const requestScrub = () => {
      if (!raf) raf = requestAnimationFrame(scrub);
    };

    const onMetadata = () => {
      ready = true;
      video.pause();
      requestScrub();
    };

    video.addEventListener('loadedmetadata', onMetadata);
    window.addEventListener('scroll', requestScrub, { passive: true });
    window.addEventListener('resize', requestScrub, { passive: true });

    if (video.readyState >= 1) onMetadata();
    else video.load();

    requestScrub();

    return () => {
      window.removeEventListener('scroll', requestScrub);
      window.removeEventListener('resize', requestScrub);
      video.removeEventListener('loadedmetadata', onMetadata);
      video.pause();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className="backdrop" aria-hidden="true">
      <video
        className="backdrop__video is-active"
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
