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

gsap.registerPlugin(ScrollTrigger);

export default function SiteClient() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el, index) => {
        gsap.fromTo(el, { y: 28, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.85, delay: index % 4 * 0.04, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
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
      <LenisProvider />
      <VideoBackdrop />
      <header className="site-header">
        <a href="#top" className="brand">MULTUM.AI</a>
        <nav>{navItems.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
        <a href="#contact" className="header-cta">Начать</a>
      </header>

      <main id="top">
        <section className="hero section-shell" data-dark-start>
          <div className="hero__copy">
            <span className="eyebrow">THE CREATIVE INTELLIGENCE COMPANY</span>
            <h1>MULTUM.AI</h1>
            <p>Школа, где искусственный интеллект превращается из набора инструментов в твой личный рабочий ресурс.</p>
            <div className="hero__actions">
              <MagneticButton href="#courses" tone="pink">Выбрать обучение →</MagneticButton>
              <a className="text-link" href="#contact">Оставить заявку ↗</a>
            </div>
          </div>
          <div className="scroll-cue"><span /> SCROLL</div>
        </section>

        <section id="method" className="section section--works section-shell">
          <div className="section-heading" data-reveal><span className="eyebrow">ВОЗМОЖНОСТИ ИИ</span><h2>Что вы сможете создавать</h2><p>От идеи до готовой работы — посмотрите примеры проектов.</p></div>
          <WorksCarousel />
        </section>

        <section className="section section--hand section-shell">
          <div className="hand-composition" data-reveal>
            <div className="hand-art" aria-hidden="true"><div className="hand-glow" /><div className="hand-shape" /><div className="hand-screen"><span>MULTUM</span><strong>AI</strong></div></div>
            <GlassCard className="hand-card">
              <span className="eyebrow">О ШКОЛЕ · MULTUM.AI</span>
              <h2>Школа нейросетей и практического ИИ</h2>
              <p>Превращаем нейросети в понятные инструменты для работы, творчества и бизнеса.</p>
              <p>Учимся на реальных задачах — от первого запроса до готового проекта.</p>
            </GlassCard>
          </div>
        </section>

        <section id="courses" className="section section-shell">
          <div className="section-heading" data-reveal><span className="eyebrow">ПРОГРАММЫ</span><h2>Выберите свой тариф</h2><p>От 14 990 до 79 990 ₽</p></div>
          <Pricing onSelect={choosePlan} />
        </section>

        <section id="about" className="section section-shell">
          <div className="section-heading" data-reveal><span className="eyebrow">ОСНОВАТЕЛЬНИЦЫ MULTUM.AI</span><h2>Знакомьтесь: Алина и Даша</h2></div>
          <div className="founders-grid">
            <GlassCard data-reveal><span className="eyebrow">01 / КТО МЫ</span><h3>Нас объединило любопытство</h3><p>Мы познакомились в сфере инфобизнеса. Нас увлекло, как нейросети помогают создавать проекты, проверять идеи и освобождать время от рутины.</p></GlassCard>
            <GlassCard data-reveal><span className="eyebrow">02 / ЗАЧЕМ СОЗДАЛИ ШКОЛУ</span><h3>От инструментов — к системе</h3><p>Мы создали MULTUM.AI, чтобы учить применять ИИ в реальных задачах: собирать рабочие процессы и воплощать собственные идеи.</p></GlassCard>
          </div>
          <p className="founder-principle">Наш ориентир — «Я понимаю, что делать дальше, и могу создать это сам».</p>
        </section>

        <section id="contact" className="section section--contact section-shell">
          <div className="contact-copy" data-reveal><span className="eyebrow">ПОМОЖЕМ С ВЫБОРОМ</span><h2>Не знаете,<br />с чего начать?</h2><p>Расскажите о своей задаче.<br />Поможем выбрать программу и ответим на вопросы.</p></div>
          <LeadForm selectedPlan={selectedPlan} />
        </section>

        <section id="faq" className="section section-shell">
          <div className="section-heading" data-reveal><h2>Частые вопросы</h2></div>
          <FAQ />
        </section>

        <section className="section section--bottom section-shell">
          <div className="bottom-grid">
            <GlassCard className="referral-card" data-reveal><span className="eyebrow">РЕФЕРАЛЬНАЯ ПРОГРАММА</span><h2>Пригласи своих</h2><p>Поделитесь MULTUM.AI с друзьями и получайте бонусы за рекомендации.</p><label>Реферальный код<input placeholder="Введите код" /></label><button>Отправить код →</button></GlassCard>
            <GlassCard data-reveal><span className="eyebrow">МЫ В СОЦСЕТЯХ</span><h2>Наши каналы</h2><p>Наши проекты, новые программы и всё, что мы создаём в MULTUM.AI.</p><div className="social-links"><a href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#'}>Instagram ↗</a><a href={process.env.NEXT_PUBLIC_TELEGRAM_URL || '#'}>Telegram ↗</a></div><div className="contact-email">Напишите нам<br /><strong>{process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@example.com'}</strong></div></GlassCard>
          </div>
        </section>
      </main>

      <footer className="footer section-shell">
        <div className="footer-brand">MULTUM.AI.</div>
        <div>© 2026 MULTUM.AI.</div>
        <a href="#top">Наверх ↑</a>
        <a href={process.env.NEXT_PUBLIC_TERMS_URL || '#'}>Пользовательское соглашение</a>
        <a href={process.env.NEXT_PUBLIC_PRIVACY_URL || '#'}>Политика конфиденциальности</a>
        <a href={process.env.NEXT_PUBLIC_OFFER_URL || '#'}>Оферта</a>
      </footer>
    </>
  );
}
