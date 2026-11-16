'use client';

import { useState } from 'react';
import gsap from 'gsap';
import { works } from '@/lib/data';
import GlassCard from './GlassCard';

const imageByType: Record<string, string> = {
  character: '/images/01-ai-character.png',
  bottle: '/images/02-ai-product.png',
  orb: '/images/03-ai-3d.png',
  editorial: '/images/04-ai-visual.png',
  automation: '/images/05-ai-automation.png',
};

function WorkVisual({ type, title }: { type: string; title: string }) {
  const src = imageByType[type];
  return (
    <div className="work-visual work-visual--image">
      {src ? <img src={src} alt={title} loading="lazy" decoding="async" /> : null}
    </div>
  );
}

export default function WorksCarousel() {
  const [active, setActive] = useState(0);
  const item = works[active];

  const change = (next: number) => {
    const normalized = (next + works.length) % works.length;
    const direction = normalized > active ? 18 : -18;
    gsap.fromTo('.work-carousel__content', { opacity: 0, x: direction }, { opacity: 1, x: 0, duration: 0.42, ease: 'power3.out' });
    setActive(normalized);
  };

  return (
    <div className="work-carousel">
      <div className="work-carousel__tabs" role="tablist" aria-label="Возможности ИИ">
        {works.map((work, index) => (
          <button key={work.category} onClick={() => change(index)} className={index === active ? 'is-active' : ''} role="tab" aria-selected={index === active}>
            {work.category}
          </button>
        ))}
      </div>
      <GlassCard className="work-carousel__card">
        <div className="work-carousel__content">
          <WorkVisual type={item.visual} title={item.title} />
          <div className="work-carousel__meta">
            <span className="eyebrow">{item.label}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
          <div className="work-carousel__controls">
            <button aria-label="Предыдущий пример" onClick={() => change(active - 1)}>←</button>
            <span>{item.number}</span>
            <button aria-label="Следующий пример" onClick={() => change(active + 1)}>→</button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
