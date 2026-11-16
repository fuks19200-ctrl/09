'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  href?: string;
  tone?: 'light' | 'pink' | 'ghost';
};

export default function MagneticButton({ children, href, tone = 'light', className = '', ...props }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (coarse) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

    const move = (event: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = event.clientX - (r.left + r.width / 2);
      const dy = event.clientY - (r.top + r.height / 2);
      xTo(dx * 0.12);
      yTo(dy * 0.12);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    };
  }, []);

  const cls = `magnetic-button magnetic-button--${tone} ${className}`;
  if (href) {
    return <a ref={ref as React.RefObject<HTMLAnchorElement>} className={cls} href={href}>{children}</a>;
  }

  return <button ref={ref as React.RefObject<HTMLButtonElement>} className={cls} {...props}>{children}</button>;
}
