'use client';

import { useState } from 'react';
import gsap from 'gsap';
import { works } from '@/lib/data';
import GlassCard from './GlassCard';

function WorkVisual({ type }: { type: string }) {
  if (type === 'bottle') {
    return <div className="work-visual work-visual--bottle"><div className="bottle"><span>M</span></div><div className="bottle-shadow" /></div>;
  }
  if (type === 'character') {
    return <div className="work-visual work-visual--character"><div className="character-head" /><div className="character-body" /><div className="character-orbit orbit-a" /><div className="character-orbit orbit-b" /></div>;
  }
  if (type === 'orb') {
    return <div className="work-visual work-visual--orb"><div className="orb-core" /><div className="orb-ring ring-a" /><div className="orb-ring ring-b" /></div>;
  }
  if (type === 'editorial') {
    return <div className="work-visual work-visual--editorial"><div className="editorial-panel panel-a" /><div className="editorial-panel panel-b" /><div className="editorial-line" /></div>;
  }
  return <div className="work-visual work-visual--automation"><div className="flow-node node-a">IDEA</div><div className="flow-line line-a" /><div className="flow-node node-b">AI</div><div className="flow-line line-b" /><div className="flow-node node-c">RESULT</div></div>;
}

export default function WorksCarousel() {
  const [active, setActive] = useState(1);
  const item = works[active];

  const change = (next: number) => {
    const normalized = (next + works.length) % works.length;
    gsap.fromTo('.work-carousel__content', { opacity: 0, x: next > active ? 18 : -18 }, { opacity: 1, x: 0, duration: 0.42, ease: 'power3.out' });
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
          <WorkVisual type={item.visual} />
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
