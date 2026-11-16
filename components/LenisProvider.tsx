'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider() {
  useEffect(() => {
    // Never let a previous anchor/scroll position decide where a fresh page load opens.
    // This is especially important after clicking "Войти в систему" (#courses)
    // and then refreshing: the browser would otherwise restore the courses block.
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const isReload = navigation?.type === 'reload';

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    if (isReload) {
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      window.scrollTo(0, 0);
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      return () => {
        if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
      };
    }

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
      if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
      gsap.ticker.remove(raf);
      lenis.off('scroll', onScroll);
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
