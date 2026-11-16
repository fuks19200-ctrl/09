'use client';

import { useRef } from 'react';
import gsap from 'gsap';

type Props = React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode };

export default function GlassCard({ children, className = '', ...props }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || window.matchMedia('(pointer: coarse)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (event.clientX - r.left) / r.width - 0.5;
    const y = (event.clientY - r.top) / r.height - 0.5;
    gsap.to(el, { rotateX: -y * 2.5, rotateY: x * 2.5, duration: 0.45, ease: 'power3.out', transformPerspective: 900 });
  };
  const onLeave = () => {
    if (ref.current) gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.55, ease: 'power3.out' });
  };

  return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`glass-card ${className}`} {...props}>{children}</div>;
}
