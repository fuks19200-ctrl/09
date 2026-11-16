'use client';

import { useEffect, useRef } from 'react';

export default function VideoBackdrop() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const videos = Array.from(root?.querySelectorAll<HTMLVideoElement>('.backdrop__video') || []);
    if (!root || videos.length !== 3) return;

    videos.forEach((video, i) => {
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.pause();
      video.style.opacity = i === 0 ? '1' : '0';
      video.style.transition = 'none';
    });

    let raf = 0;
    let ready = 0;
    let scrollProgress = 0;
    const rendered = [0, 0, 0];
    const targets = [0, 0, 0];

    const maxScroll = () =>
      Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    const updateTarget = () => {
      // IMPORTANT: scroll direction is intentionally reversed.
      // At the bottom of the page the first scene is Flora.
      // Scrolling UP therefore travels: Flora -> hand -> black hole.
      scrollProgress = 1 - Math.min(1, Math.max(0, window.scrollY / maxScroll()));
      if (!raf) raf = requestAnimationFrame(render);
    };

    const render = () => {
      raf = 0;
      if (ready < 3) {
        raf = requestAnimationFrame(render);
        return;
      }

      // Reverse scroll mapping:
      // scroll UP: 01 Flora -> 02 hand -> 03 black hole.
      // scroll DOWN: black hole -> hand -> Flora.
      const segment = Math.min(2.999999, scrollProgress * 3);
      const active = Math.floor(segment);
      const local = segment - active;

      videos.forEach((video, i) => {
        if (!Number.isFinite(video.duration) || video.duration <= 0) return;

        const target = i === active
          ? Math.min(Math.max(0, video.duration - 0.04), local * video.duration)
          : targets[i];

        if (i === active) targets[i] = target;

        rendered[i] += (targets[i] - rendered[i]) * 0.52;

        const opacity = i === active ? 1 : 0;
        if (video.style.opacity !== String(opacity)) {
          video.style.opacity = String(opacity);
        }

        const safeTime = Math.min(
          Math.max(0, rendered[i]),
          Math.max(0, video.duration - 0.04)
        );

        if (Math.abs(video.currentTime - safeTime) > 0.001) {
          try { video.currentTime = safeTime; } catch {}
        }
      });

      if (
        Math.abs(targets[active] - rendered[active]) > 0.001 ||
        ready < 3
      ) {
        raf = requestAnimationFrame(render);
      }
    };

    const onMetadata = () => {
      ready += 1;
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
      <video className="backdrop__video is-active" poster="/images/bg-3.jpg" muted playsInline preload="auto">
        <source src="/videos/bloom-bg-3.mp4" type="video/mp4" />
      </video>
      <video className="backdrop__video" poster="/images/bg-2.jpg" muted playsInline preload="auto">
        <source src="/videos/bloom-bg-2.mp4" type="video/mp4" />
      </video>
      <video className="backdrop__video" poster="/images/bg-1.jpg" muted playsInline preload="auto">
        <source src="/videos/bloom-bg-1.mp4" type="video/mp4" />
      </video>
      <div className="backdrop__shade" />
      <div className="backdrop__grain" />
      <div className="backdrop__vignette" />
    </div>
  );
}
