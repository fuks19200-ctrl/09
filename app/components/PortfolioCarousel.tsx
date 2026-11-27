"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Card = { src:string; title:string };
const wrap = (n:number,count:number) => ((n % count)+count)%count;
export default function PortfolioCarousel({cards}:{cards:Card[]}) {
  const [active,setActive] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const gesture = useRef<{x:number;y:number}|null>(null);
  const suppressClickUntil = useRef(0);
  const count = cards.length;
  const select = useCallback((index:number)=>{
    if(!count)return;
    const next=wrap(index,count);
    activeRef.current=next;setActive(next);
  },[count]);
  const move = useCallback((step:number)=>select(activeRef.current+step),[select]);
  useEffect(()=>{
    const node=stage.current;
    if(!node||count<2)return;
    let accumulated=0,lastEvent=0,lastMove=0;
    function wheel(event:WheelEvent){
      if(event.ctrlKey||event.metaKey)return;
      const horizontal=Math.abs(event.deltaX)>Math.abs(event.deltaY);
      const raw=horizontal?event.deltaX:event.deltaY;
      if(!raw)return;
      const dir=raw>0?1:-1;
      // Release vertical page scrolling at both ends; horizontal gestures remain cyclic.
      if(!horizontal && ((dir<0&&activeRef.current===0)||(dir>0&&activeRef.current===count-1))) {
        accumulated=0;return;
      }
      if(!event.cancelable)return;
      event.preventDefault();
      const now=performance.now();
      if(now-lastEvent>180)accumulated=0;
      lastEvent=now;
      if(now-lastMove<330)return;
      accumulated+=raw*(event.deltaMode===1?16:event.deltaMode===2?node!.clientWidth:1);
      if(Math.abs(accumulated)<28)return;
      move(accumulated>0?1:-1);accumulated=0;lastMove=now;
    }
    node.addEventListener("wheel",wheel,{passive:false});
    return ()=>node.removeEventListener("wheel",wheel);
  },[count,move]);
  const half=Math.floor(count/2);
  return <div className="portfolio-carousel" role="region" aria-roledescription="карусель" aria-label="Работы MULTUM"
    onKeyDown={event=>{
      if(event.key==="ArrowLeft"||event.key==="ArrowRight"){event.preventDefault();move(event.key==="ArrowLeft"?-1:1);}
      if(event.key==="Home"||event.key==="End"){event.preventDefault();select(event.key==="Home"?0:count-1);}
    }}>
    <div ref={stage} className="portfolio-arc" tabIndex={0} aria-label="Листайте карточки колёсиком, свайпом или стрелками"
      onPointerDown={event=>{if(!event.isPrimary||event.button!==0)return;gesture.current={x:event.clientX,y:event.clientY};}}
      onPointerUp={event=>{
        const start=gesture.current;gesture.current=null;
        if(!start||!event.isPrimary)return;
        const dx=event.clientX-start.x,dy=event.clientY-start.y;
        if(Math.abs(dx)>32&&Math.abs(dx)>Math.abs(dy)){suppressClickUntil.current=performance.now()+400;move(dx<0?1:-1);}
      }}
      onPointerCancel={()=>{gesture.current=null;}} onPointerLeave={event=>{if(event.pointerType==="mouse")gesture.current=null;}}>
      {cards.map((card,index)=>{
        const offset=wrap(index-active+half,count)-half;
        return <div key={card.title} className="portfolio-arc-card" data-position={offset}>
          <button type="button" className="portfolio-arc-hit" aria-label={card.title+", "+(index+1)+" из "+count} aria-current={index===active?"true":undefined}
          tabIndex={index===active?0:-1}
          onClick={()=>{if(performance.now()>=suppressClickUntil.current)select(index);}}>
          {card.src?<img src={card.src} alt="" draggable={false} loading={index===0?"eager":"lazy"} decoding="async"/>:<span className="portfolio-empty-card">{card.title}</span>}
          </button>
        </div>;
      })}
    </div>
    <div className="portfolio-arc-controls">
      <button type="button" aria-label="Предыдущая работа" onClick={()=>move(-1)}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg></button>
      <div className="portfolio-arc-caption" aria-live="polite" aria-atomic="true"><span>{String(active+1).padStart(2,"0")} / {String(count).padStart(2,"0")}</span><strong>{cards[active]?.title}</strong></div>
      <button type="button" aria-label="Следующая работа" onClick={()=>move(1)}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button>
    </div>
    {cards[active]?.src&&<a className="portfolio-arc-full" href={cards[active].src} target="_blank" rel="noopener noreferrer">Открыть изображение ↗</a>}
  </div>;
}
