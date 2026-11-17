'use client';

import { useState } from 'react';
import gsap from 'gsap';
import { works } from '@/lib/data';

const imageByType: Record<string, string> = {
  character: '/images/Лавандовый_бьюти_портрет_с_фиалковыми_лепестками_1.png',
  bottle: '/images/Стеклянная_лаванда_в_перламутровом_сиянии_4.png',
  orb: '/images/Парящий_лавандовый_шар_в_переливчатых_кольцах_3.png',
  editorial: '/images/Лавандовый_парфюм,_ирис_и_стеклянная_лента_2.png',
  automation: '/images/Лавандовая_сеть_из_стеклянных_сфер.png',
};

function WorkCard({
  work,
  index,
  active,
  onSelect,
}: {
  work: (typeof works)[number];
  index: number;
  active: number;
  onSelect: (index: number) => void;
}) {
  const src = imageByType[work.visual];

  return (
    <article
      className={`work-tile work-tile--${index + 1} ${index === active ? 'is-active' : ''}`}
      onMouseEnter={() => onSelect(index)}
      onFocus={() => onSelect(index)}
      tabIndex={0}
      aria-label={work.title}
    >
      <div className="work-tile__media">
        {src ? <img className={`work-tile__art work-tile__art--${index + 1}`} src={src} alt="" aria-hidden="true" draggable="false" /> : null}
        <div className="work-tile__wash" />
        <div className="work-tile__top">
          <span className="work-tile__number">{work.number}</span>
          <span className="work-tile__category">{work.category}</span>
        </div>
        <div className="work-tile__content">
          <span className="work-tile__label">{work.label}</span>
          <h3>{work.title}</h3>
          <p>{work.description}</p>
        </div>
        <span className="work-tile__spark">✦</span>
      </div>
    </article>
  );
}

export default function WorksCarousel() {
  const [active, setActive] = useState(0);

  const select = (index: number) => {
    if (index === active) return;
    gsap.fromTo(
      '.work-tile',
      { opacity: 0.82, y: 8 },
      { opacity: 1, y: 0, duration: 0.38, ease: 'power3.out', stagger: 0.025, overwrite: true },
    );
    setActive(index);
  };

  return (
    <>
      <style jsx global>{`
        .works-gallery__grid { background: transparent !important; }

        .work-tile {
          background: #e7def2 !important;
          border-color: rgba(255,255,255,.78) !important;
          box-shadow: 0 24px 70px rgba(77,58,105,.14), inset 0 1px 0 rgba(255,255,255,.9) !important;
          overflow: hidden !important;
        }

        .work-tile__media {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
          border-radius: inherit !important;
          background: transparent !important;
        }

        .work-tile__media::after {
          display: none !important;
        }

        /*
         * CARD / IMAGE GEOMETRY
         * The new artwork is the visual source of truth. Keep the cards
         * compact and image-led, with a consistent near-square frame.
         * No stretched placeholders, no old burgundy artwork.
         */
        .work-tile__art {
          position: absolute !important;
          inset: 0 !important;
          z-index: 0 !important;
          display: block !important;
          width: 100% !important;
          height: 100% !important;
          min-width: 100% !important;
          min-height: 100% !important;
          max-width: none !important;
          max-height: none !important;
          object-fit: cover !important;
          transform: none !important;
          filter: none !important;
          image-rendering: auto;
          user-select: none;
          -webkit-user-drag: none;
        }

        /* The first three source files are 850×487, 843×487 and 573×487.
           Their focal point stays centered while the card ratio does the crop. */
        .work-tile__art--1 { object-position: 50% 50% !important; }
        .work-tile__art--2 { object-position: 50% 50% !important; }
        .work-tile__art--3 { object-position: 50% 50% !important; }

        /* 04 is 1129×487 and 05 is 572×487. */
        .work-tile__art--4 { object-position: 50% 50% !important; }
        .work-tile__art--5 { object-position: 50% 50% !important; }

        .work-tile__wash {
          z-index: 2 !important;
          inset: 0 !important;
          background: transparent !important;
          mix-blend-mode: normal !important;
        }

        .work-tile__content {
          z-index: 4 !important;
          border-color: rgba(255,255,255,.58) !important;
          background: rgba(20,14,24,.30) !important;
          box-shadow: 0 12px 34px rgba(66,48,91,.10);
        }

        .work-tile__content h3,
        .work-tile__content p,
        .work-tile__label,
        .work-tile__top,
        .work-tile__spark {
          color: #fff !important;
          text-shadow: 0 2px 14px rgba(45,31,58,.30);
        }

        .work-tile:hover,
        .work-tile:focus-visible,
        .work-tile.is-active {
          box-shadow: 0 34px 90px rgba(72,48,103,.18), 0 0 0 1px rgba(155,127,234,.14), inset 0 1px 0 rgba(255,255,255,.95) !important;
        }
      `}</style>

      <div className="works-gallery">
        <div className="works-gallery__grid">
          {works.map((work, index) => (
            <WorkCard
              key={work.category}
              work={work}
              index={index}
              active={active}
              onSelect={select}
            />
          ))}
        </div>
      </div>
    </>
  );
}
