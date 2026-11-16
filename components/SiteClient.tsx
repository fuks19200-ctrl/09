'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { navItems } from '@/lib/data';
import LenisProvider from './LenisProvider';
import VideoBackdrop from './VideoBackdrop';
import MagneticButton from './MagneticButton';
import GlassCard from './GlassCard';
import WorksCarousel from './WorksCarousel';
import Pricing from './Pricing';
import LeadForm from './LeadForm';
import FAQ from './FAQ';
import CursorFX from './CursorFX';

gsap.registerPlugin(ScrollTrigger);

export default function SiteClient() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el, index) => {
        gsap.fromTo(
          el,
          { y: 34, opacity: 0, filter: 'blur(5px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.9,
            delay: (index % 5) * 0.045,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-line]').forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 1.15,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);

  const choosePlan = (plan: string) => {
    setSelectedPlan(plan);
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <>
      <CursorFX />
      <LenisProvider />
      <VideoBackdrop />

      <div className="system-noise" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true" />

      <header className="site-header">
        <a href="#top" className="brand" aria-label="MULTUM.AI">
          <span className="brand-mark">M</span>
          <span>MULTUM<span className="brand-dot">.</span>AI</span>
        </a>

        <nav aria-label="Основная навигация">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>

        <div className="header-meta">
          <span className="header-status"><i /> SYSTEM ONLINE</span>
          <a href="#contact" className="header-cta">Начать <span>↗</span></a>
        </div>
      </header>

      <main id="top">
        <section className="hero section-shell" data-dark-start>
          <div className="hero__copy">
            <div className="hero-kicker">
              <span className="hero-kicker__dot" />
              THE CREATIVE INTELLIGENCE COMPANY
              <span className="hero-kicker__year">MMXXVI</span>
            </div>

            <h1>
              <span>Не просто</span>
              <em>нейросети.</em>
              <span>Новая система</span>
              <span className="hero-hollow">мышления.</span>
            </h1>

            <p>
              MULTUM.AI превращает искусственный интеллект в рабочий инструмент —
              для создания, бизнеса, автоматизации и идей, которые раньше казались невозможными.
            </p>

            <div className="hero__actions">
              <MagneticButton href="#courses" tone="pink">Войти в систему <span>↗</span></MagneticButton>
              <a className="text-link" href="#method"><span className="text-link__arrow">↓</span> Посмотреть возможности</a>
            </div>

            <div className="hero-proof">
              <span>AI EDUCATION</span>
              <span>CREATION</span>
              <span>AUTOMATION</span>
              <span>AGENTS</span>
            </div>
          </div>

          <div className="hero__visual" aria-hidden="true">
            <div className="hero-video-frame">
              <video className="hero-reference-video" autoPlay muted loop playsInline preload="auto" poster="/images/bg-1.jpg">
                <source src="/videos/mobile/bloom-bg-1.mp4" media="(max-width: 820px)" type="video/mp4" />
                <source src="/videos/bloom-bg-1.mp4" type="video/mp4" />
              </video>
              <div className="hero-video-glass" />
              <div className="hero-video-label"><span /> LIVING INTELLIGENCE / 01</div>
            </div>
            <div className="hero-living-glow" />
            <div className="hero-scanline" />
            <div className="hero-coordinates">45° 12′ 08″ N<br />37° 36′ 44″ E</div>
            <div className="hero-system-label">MULTUM / CORE<br /><span>CREATIVE INTELLIGENCE</span></div>
          </div>

          <div className="hero-side-note">
            <span>01</span>
            <div data-line />
            <span>IMPOSSIBLE<br />INTERFACE</span>
          </div>

          <div className="scroll-cue"><span /> SCROLL TO EXPLORE <b>01—08</b></div>
        </section>

        <section className="signal-strip section-shell" aria-label="Система MULTUM.AI">
          <div className="signal-cell"><span>01</span><strong>LEARN</strong><small>понимать</small></div>
          <div className="signal-cell"><span>02</span><strong>CREATE</strong><small>создавать</small></div>
          <div className="signal-cell"><span>03</span><strong>AUTOMATE</strong><small>собирать системы</small></div>
          <div className="signal-cell"><span>04</span><strong>EVOLVE</strong><small>думать дальше</small></div>
        </section>

        <section id="method" className="section section--works section-shell">
          <div className="section-heading section-heading--split" data-reveal>
            <div>
              <span className="eyebrow">THE OUTPUT</span>
              <h2>Не учим кнопкам.<br /><span>Учим создавать.</span></h2>
            </div>
            <p>От первого замысла до готового результата: визуалы, персонажи, продукты, контент и автоматизированные процессы.</p>
          </div>
          <WorksCarousel />
        </section>

        <section className="section section--manifesto section-shell">
          <div className="manifesto-grid">
            <div className="manifesto-index" data-reveal><span>02</span><i /></div>
            <div className="manifesto-copy" data-reveal>
              <span className="eyebrow">MULTUM / PHILOSOPHY</span>
              <h2>ИИ — это не<br /><em>кнопка.</em><br />Это новый слой<br />возможностей.</h2>
            </div>
            <div className="manifesto-aside" data-reveal>
              <div className="manifesto-number">∞</div>
              <p>Мы не привязываем тебя к одному сервису. Мы учим видеть задачу, собирать систему и доводить идею до результата.</p>
              <a href="#courses">Узнать, как это работает <span>↗</span></a>
            </div>
          </div>
        </section>

        <section className="section section--hand section-shell">
          <div className="hand-composition living-composition" data-reveal>
            <div className="living-figure" aria-hidden="true">
              <video className="living-figure__video" autoPlay muted loop playsInline preload="metadata" poster="/images/bg-2.jpg">
                <source src="/videos/mobile/bloom-bg-2.mp4" media="(max-width: 820px)" type="video/mp4" />
                <source src="/videos/bloom-bg-2.mp4" type="video/mp4" />
              </video>
              <div className="living-figure__veil" />
              <div className="living-figure__signal">03 / LIVING INTERFACE</div>
              <div className="living-figure__caption">IDEA → SYSTEM → RESULT</div>
            </div>
            <GlassCard className="hand-card">
              <span className="eyebrow">О ШКОЛЕ · MULTUM.AI</span>
              <h2>Школа нейросетей и практического ИИ</h2>
              <p>Превращаем нейросети в понятные инструменты для работы, творчества и бизнеса.</p>
              <p>Учимся на реальных задачах — от первого запроса до готового проекта.</p>
              <div className="card-index">03 / MULTUM CORE</div>
            </GlassCard>
          </div>
        </section>

        <section id="courses" className="section section-shell">
          <div className="section-heading section-heading--split" data-reveal>
            <div>
              <span className="eyebrow">CHOOSE YOUR LEVEL</span>
              <h2>Выберите<br /><span>свой режим.</span></h2>
            </div>
            <p>Три уровня глубины. Один принцип: максимум практики и результат, который можно унести с собой в реальную работу.</p>
          </div>
          <Pricing onSelect={choosePlan} />
        </section>

        <section id="about" className="section section--about section-shell">
          <div className="section-heading" data-reveal>
            <span className="eyebrow">THE PEOPLE BEHIND MULTUM</span>
            <h2>Знакомьтесь:<br /><span>Алина и Даша.</span></h2>
          </div>
          <div className="founders-grid">
            <GlassCard data-reveal>
              <span className="eyebrow">01 / КТО МЫ</span>
              <h3>Нас объединило любопытство</h3>
              <p>Мы познакомились в сфере инфобизнеса. Нас увлекло, как нейросети помогают создавать проекты, проверять идеи и освобождать время от рутины.</p>
              <div className="card-index">ALINA × DASHA</div>
            </GlassCard>
            <GlassCard data-reveal>
              <span className="eyebrow">02 / ЗАЧЕМ СОЗДАЛИ ШКОЛУ</span>
              <h3>От инструментов — к системе</h3>
              <p>Мы создали MULTUM.AI, чтобы учить применять ИИ в реальных задачах: собирать рабочие процессы и воплощать собственные идеи.</p>
              <div className="card-index">CREATIVE INTELLIGENCE</div>
            </GlassCard>
          </div>
          <p className="founder-principle" data-reveal>«Я понимаю, что делать дальше — и могу создать это сам».</p>
        </section>

        <section id="contact" className="section section--contact section-shell">
          <div className="contact-copy" data-reveal>
            <span className="eyebrow">04 / FIRST STEP</span>
            <h2>Есть идея?<br /><em>Запускаем.</em></h2>
            <p>Расскажите, что хотите создать. Поможем выбрать программу и собрать первый маршрут.</p>
            <div className="contact-orbit" aria-hidden="true"><span /><span /><span /></div>
          </div>
          <LeadForm selectedPlan={selectedPlan} />
        </section>

        <section id="faq" className="section section--faq section-shell">
          <div className="section-heading section-heading--split" data-reveal>
            <div><span className="eyebrow">KNOW BEFORE YOU ENTER</span><h2>Частые<br /><span>вопросы.</span></h2></div>
            <p>Если ответа здесь нет — напишите. Живой человек всё равно лучше любой FAQ.</p>
          </div>
          <FAQ />
        </section>

        <section className="section section--bottom section-shell">
          <div className="bottom-grid">
            <GlassCard className="referral-card" data-reveal>
              <span className="eyebrow">05 / REFERRAL SYSTEM</span>
              <h2>Пригласи<br /><em>своих.</em></h2>
              <p>Поделитесь MULTUM.AI с друзьями и получайте бонусы за рекомендации.</p>
              <label>Реферальный код<input placeholder="Введите код" /></label>
              <button>Отправить код <span>→</span></button>
            </GlassCard>

            <GlassCard data-reveal>
              <span className="eyebrow">06 / TRANSMISSION</span>
              <h2>Остаёмся<br /><em>на связи.</em></h2>
              <p>Наши проекты, новые программы и всё, что мы создаём в MULTUM.AI.</p>
              <div className="social-links">
                <a href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#'}>Instagram <span>↗</span></a>
                <a href={process.env.NEXT_PUBLIC_TELEGRAM_URL || '#'}>Telegram <span>↗</span></a>
              </div>
              <div className="contact-email">Напишите нам<br /><strong>{process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@example.com'}</strong></div>
            </GlassCard>
          </div>
        </section>
      </main>

      <footer className="footer section-shell">
        <div className="footer-brand"><span className="brand-mark">M</span> MULTUM<span className="brand-dot">.</span>AI</div>
        <div>© 2026 MULTUM.AI</div>
        <a href="#top">Наверх ↑</a>
        <a href={process.env.NEXT_PUBLIC_TERMS_URL || '#'}>Пользовательское соглашение</a>
        <a href={process.env.NEXT_PUBLIC_PRIVACY_URL || '#'}>Политика конфиденциальности</a>
        <a href={process.env.NEXT_PUBLIC_OFFER_URL || '#'}>Оферта</a>
      </footer>
    </>
  );
}
