'use client';

import { useEffect } from 'react';
import gsap from 'gsap';

export default function CursorFX() {
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return;

    const dot = document.querySelector<HTMLElement>('[data-cursor-dot]');
    const ring = document.querySelector<HTMLElement>('[data-cursor-ring]');
    if (!dot || !ring) return;

    const xDot = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3.out' });
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3.out' });

    const move = (e: MouseEvent) => {
      xDot(e.clientX); yDot(e.clientY);
      xRing(e.clientX); yRing(e.clientY);
    };

    const enter = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      if (target.dataset.cursor === 'magnetic') {
        gsap.to(ring, { scale: 1.65, duration: .35, ease: 'power3.out' });
        gsap.to(dot, { scale: .35, duration: .25 });
      }
    };
    const leave = () => {
      gsap.to(ring, { scale: 1, duration: .35, ease: 'power3.out' });
      gsap.to(dot, { scale: 1, duration: .25 });
    };

    const interactive = Array.from(document.querySelectorAll<HTMLElement>('a,button,[data-cursor="magnetic"]'));
    interactive.forEach(el => {
      el.dataset.cursor = el.dataset.cursor || 'magnetic';
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
    });
    window.addEventListener('mousemove', move);

    return () => {
      window.removeEventListener('mousemove', move);
      interactive.forEach(el => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      });
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" data-cursor-dot aria-hidden="true" />
      <div className="cursor-ring" data-cursor-ring aria-hidden="true">
        <span />
      </div>
    </>
  );
}
