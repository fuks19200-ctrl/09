'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 0.8,
      wheelMultiplier: 0.9,
      autoRaf: false,
    });

    const onScroll = () => {
      ScrollTrigger.update();
    };

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time * 1000);
      rafId = requestAnimationFrame(raf);
    };

    lenis.on('scroll', onScroll);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(1000, 16);

    return () => {
      gsap.ticker.remove(raf);
      lenis.off('scroll', onScroll);
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
