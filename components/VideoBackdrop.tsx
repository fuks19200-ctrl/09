'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function VideoBackdrop() {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const video = videoRef.current;
    const trigger = document.querySelector<HTMLElement>('[data-dark-start]');
    if (!overlay || !trigger) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const animation = gsap.to(overlay, { opacity: 0.58, ease: 'none', paused: true });

    if (reduced || coarse) {
      overlay.style.opacity = '0.42';
      video?.pause();
      return () => animation.kill();
    }

    video?.play().catch(() => undefined);

    const st = ScrollTrigger.create({
      trigger,
      start: 'top 70%',
      end: 'top top',
      scrub: true,
      onUpdate: self => animation.progress(self.progress),
    });

    return () => {
      st.kill();
      animation.kill();
    };
  }, []);

  return (
    <div className="backdrop" aria-hidden="true">
      <video ref={videoRef} className="backdrop__video" autoPlay muted loop playsInline preload="metadata" poster="/images/bg-1.jpg">
        <source src="/videos/bloom-bg-1.mp4" type="video/mp4" />
      </video>
      <div ref={overlayRef} className="backdrop__shade" />
      <div className="backdrop__grain" />
      <div className="backdrop__vignette" />
    </div>
  );
}
