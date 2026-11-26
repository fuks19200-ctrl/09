"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const wrap = (n: number, count: number) => ((n % count) + count) % count;

function Chevron({ up = false }: { up?: boolean }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={up ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} /></svg>;
}

export default function CreativeCarousel({ direction = "AI CREATIVE", images = [] }: { direction?: string; images?: string[] }) {
  const uploaded = images.filter(Boolean);
  const cards = uploaded.length ? uploaded : Array<string>(6).fill("");
  const count = cards.length;
  const offset = Math.floor((count - 1) / 2);
  const [active, setActive] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<number | null>(null);
  const move = useCallback((step: number) => setActive((prev) => wrap(prev + step, count)), [count]);

  useEffect(() => {
    const node = stage.current;
    if (!node || count < 2) return;
    let accumulated = 0;
    let lastMove = 0;
    let lastWheel = 0;
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return;
      if (event.cancelable) event.preventDefault();
      const now = performance.now();
      if (now - lastWheel > 180) accumulated = 0;
      lastWheel = now;
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * node.clientHeight : event.deltaY;
      if (now - lastMove < 320) return;
      accumulated += delta;
      if (Math.abs(accumulated) < 28) return;
      move(accumulated > 0 ? 1 : -1);
      accumulated = 0;
      lastMove = now;
    };
    node.addEventListener("wheel", handleWheel, { passive: false });
    return () => node.removeEventListener("wheel", handleWheel);
  }, [move, count]);

  return (
    <div className="creative-carousel" role="region" aria-roledescription="карусель" aria-label={"Галерея " + direction}
      onKeyDown={(event) => {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
          event.preventDefault();
          move(event.key === "ArrowUp" ? -1 : 1);
        }
      }}>
      <button type="button" className="creative-carousel-button" aria-label="Предыдущая карточка" disabled={count < 2} onClick={() => move(-1)}><Chevron up /></button>
      <div className="creative-carousel-stage" ref={stage} tabIndex={0} aria-label="Прокручивайте колесом или стрелками"
        onPointerDown={(event) => { pointerStart.current = event.clientY; }}
        onPointerUp={(event) => {
          const start = pointerStart.current;
          pointerStart.current = null;
          if (start !== null && Math.abs(event.clientY - start) > 30) move(event.clientY < start ? 1 : -1);
        }}
        onPointerCancel={() => { pointerStart.current = null; }}
        onPointerLeave={() => { pointerStart.current = null; }}>
        {cards.map((card, index) => {
          const position = wrap(index - active + offset, count) - offset;
          return (
            <div key={card || index} className="creative-carousel-card" data-position={position} aria-hidden={position !== 0}>
              {card && <img src={card} alt="" draggable={false} />}
              
            </div>
          );
        })}
      </div>
      <button type="button" className="creative-carousel-button" aria-label="Следующая карточка" disabled={count < 2} onClick={() => move(1)}><Chevron /></button>
      <span className="creative-carousel-announcement" aria-live="polite" aria-atomic="true">{"Карточка " + (active + 1) + " из " + count}</span>
    </div>
  );
}
