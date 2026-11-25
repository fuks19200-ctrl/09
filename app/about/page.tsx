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
        <header className="founders-intro">
          <p className="founders-kicker"><span aria-hidden="true" /> История MULTUM.AI</p>
          <h1>Будущее —<span>за теми, кто мыслит.</span></h1>
          <p className="founders-byline">Алина и Дарья <span>·</span> Основательницы MULTUM.AI</p>
        </header>
        <p className="founders-body">Мы создали MULTUM.AI, чтобы научить людей управлять технологиями, не делегируя им собственное мышление. Чем доступнее AI, тем ценнее критический анализ, креативность и умение задавать правильные вопросы.</p>
        <blockquote className="founders-quote">
          <span className="founders-quote__label">Наша философия</span>
          <p>Редкостью станет не тот, кто знает о нейросетях, а тот, кто <strong>умеет ими управлять.</strong></p>
        </blockquote>
        <section className="founders-practice" aria-labelledby="practice-title">
          <h2 id="practice-title">От знаний — к реальным результатам.</h2>
          <div className="founders-pillars">
            <span>Практика</span><span>Реальные проекты</span><span>Навыки</span>
          </div>
          <p className="founders-body">Мы учим анализировать, экспериментировать, самостоятельно принимать решения и превращать идеи в работающие цифровые продукты. Не заменять интеллект, а усиливать его.</p>
        </section>
        <footer className="founders-footer">
          <p>Не следовать за будущим.<br /><strong>Создавать его.</strong></p>
          <a className="button button--glass founders-cta" href="/courses/">Выбрать обучение</a>
        </footer>
      </article>
    </main>
  );
}
