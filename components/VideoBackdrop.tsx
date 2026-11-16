'use client';

import { useEffect, useRef } from 'react';

export default function VideoBackdrop() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const videos = Array.from(root?.querySelectorAll<HTMLVideoElement>('.backdrop__video') || []);
    if (!root || videos.length !== 3) return;

    videos.forEach(video => {
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.pause();
    });

    let raf = 0;
    let readyCount = 0;
    let scrollProgress = 0;
    const rendered = [0, 0, 0];
    const targets = [0, 0, 0];

    const maxScroll = () =>
      Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    const updateTarget = () => {
      scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll()));
      if (!raf) raf = requestAnimationFrame(render);
    };

    const render = () => {
      raf = 0;
      if (readyCount < 3) {
        raf = requestAnimationFrame(render);
        return;
      }

      // The original Bloom composition uses three separate background films.
      // Each film owns one third of the page scroll and crossfades into the next.
      const segment = scrollProgress * 3;
      const active = Math.min(2, Math.floor(segment));
      const local = Math.min(1, Math.max(0, segment - active));

      for (let i = 0; i < 3; i++) {
        const video = videos[i];
        if (!Number.isFinite(video.duration) || video.duration <= 0) continue;

        const start = i === 0 ? 0 : i / 3;
        const end = i === 2 ? 1 : (i + 1) / 3;
        const fade = Math.max(0, Math.min(1, (scrollProgress - start) / (end - start)));

        targets[i] = Math.min(Math.max(0, video.duration - 0.04), local * video.duration);

        // Faster cinematic response: strong easing, but never a frame-by-frame jump.
        rendered[i] += (targets[i] - rendered[i]) * 0.34;

        const opacity = i === active ? 1 : (i === active + 1 ? Math.max(0, fade) : 0);
        video.style.opacity = String(opacity);

        const safeTime = Math.min(
          Math.max(0, rendered[i]),
          Math.max(0, video.duration - 0.04)
        );

        if (Math.abs(video.currentTime - safeTime) > 0.001) {
          try { video.currentTime = safeTime; } catch {}
        }
      }

      if (
        videos.some((_, i) => Math.abs(targets[i] - rendered[i]) > 0.001) ||
        readyCount < 3
      ) {
        raf = requestAnimationFrame(render);
      }
    };

    const onMetadata = () => {
      readyCount += 1;
      updateTarget();
    };

    videos.forEach(video => video.addEventListener('loadedmetadata', onMetadata));
    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', updateTarget, { passive: true });

    videos.forEach(video => {
      if (video.readyState >= 1) onMetadata();
      else video.load();
    });

    return () => {
      window.removeEventListener('scroll', updateTarget);
      window.removeEventListener('resize', updateTarget);
      videos.forEach(video => {
        video.removeEventListener('loadedmetadata', onMetadata);
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
      <video className="backdrop__video" poster="/images/bg-2.jpg" muted playsInline preload="auto">
        <source src="/videos/bloom-bg-2.mp4" type="video/mp4" />
      </video>
      <video className="backdrop__video" poster="/images/bg-3.jpg" muted playsInline preload="auto">
        <source src="/videos/bloom-bg-3.mp4" type="video/mp4" />
      </video>
      <div className="backdrop__shade" />
      <div className="backdrop__grain" />
      <div className="backdrop__vignette" />
    </div>
  );
}
