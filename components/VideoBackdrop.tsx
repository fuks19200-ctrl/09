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
    let ready = false;
    let targetTime = 0;
    let renderedTime = 0;

    const maxScroll = () =>
      Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    const updateTarget = () => {
      if (!ready || !Number.isFinite(video.duration) || video.duration <= 0) return;

      const progress = Math.min(
        1,
        Math.max(0, window.scrollY / maxScroll())
      );

      targetTime = Math.min(
        Math.max(0, video.duration - 0.04),
        progress * video.duration
      );

      if (!raf) raf = requestAnimationFrame(render);
    };

    const render = () => {
      raf = 0;

      if (!ready || !Number.isFinite(video.duration) || video.duration <= 0) return;

      // Smoothly follow the scroll position instead of jumping to each scroll event.
      // This gives the background cinematic inertia while preserving exact direction.
      const delta = targetTime - renderedTime;
      renderedTime += delta * 0.16;

      if (Math.abs(delta) < 0.003) {
        renderedTime = targetTime;
      }

      const safeTime = Math.min(
        Math.max(0, renderedTime),
        Math.max(0, video.duration - 0.04)
      );

      if (Math.abs(video.currentTime - safeTime) > 0.004) {
        try {
          video.currentTime = safeTime;
        } catch {}
      }

      // Keep animating while easing toward the scroll target.
      if (Math.abs(targetTime - renderedTime) > 0.003) {
        raf = requestAnimationFrame(render);
      }
    };

    const onMetadata = () => {
      ready = true;
      renderedTime = 0;
      targetTime = 0;
      video.pause();
      updateTarget();
    };

    video.addEventListener('loadedmetadata', onMetadata);
    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', updateTarget, { passive: true });

    if (video.readyState >= 1) onMetadata();
    else video.load();

    return () => {
      window.removeEventListener('scroll', updateTarget);
      window.removeEventListener('resize', updateTarget);
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
