import type { Metadata } from "next";
import SiteNav from "../components/SiteNav";

export const metadata: Metadata = { title: "О нас — MULTUM.AI" };

export default function About() {
  return (
    <main className="site-background about-page">
      <SiteNav active="about" />
      <article className="about-card">
        <p className="about-card__eyebrow">О нас</p>
        <h1>MULTUM<span>.AI</span></h1>
        <p className="about-card__lead">Школа нейросетей для тех, кто хочет создавать, развиваться и работать по-новому.</p>
        <p>Мы учим применять искусственный интеллект на практике: создавать контент и цифровые продукты, работать с нейросетями и автоматизировать задачи.</p>
        <p>Наша цель — помочь вам превратить знания об AI в самостоятельные навыки и реальные проекты.</p>
      </article>
    </main>
  );
}
