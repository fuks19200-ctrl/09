import type { Metadata } from "next";
import SiteNav from "../components/SiteNav";

export const metadata: Metadata = {
  title: "О нас — MULTUM.AI",
  description: "История и миссия школы нейросетей MULTUM.AI.",
};

export default function About() {
  return (
    <main className="site-background about-page">
      <SiteNav active="about" />
      <article className="founders-story">
        <p className="founders-story__eyebrow">История MULTUM.AI</p>
        <h1>Будущее принадлежит тем, кто умеет <span>мыслить.</span></h1>
        <p className="founders-story__lead">Мы — Алина и Дарья, основательницы MULTUM.AI. Нас объединила идея создать не просто школу нейросетей, а пространство, где технологии развивают человеческое мышление.</p>
        <p>Чем больше люди делегируют искусственному интеллекту собственное мышление, тем ценнее становятся критический анализ, креативность и способность правильно формулировать задачи.</p>
        <p><strong>В будущем редкостью станет не человек, который знает о нейросетях, а специалист, который понимает, как ими управлять.</strong></p>
        <p>Поэтому в основе MULTUM.AI — практика, реальные проекты и профессиональные навыки. Мы учим анализировать, экспериментировать, самостоятельно принимать решения и превращать идеи в работающие цифровые продукты.</p>
        <p>Наша задача — не заменить человеческий интеллект искусственным, а раскрыть его потенциал с помощью технологий.</p>
        <p className="founders-story__signature">Мы не учим следовать за будущим. Мы учим его создавать.</p>
        <a className="button button--glass founders-cta" href="/courses/">
          <span>Выбрать обучение</span>
        </a>
      </article>
    </main>
  );
}
