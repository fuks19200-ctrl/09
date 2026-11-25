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
          <p className="founders-kicker">История MULTUM.AI</p>
          <h1>Будущее принадлежит тем, кто умеет <span>думать.</span></h1>
          <p className="founders-byline">Мы — Алина и Дарья, основательницы MULTUM.AI.</p>
        </header>
        <div className="founders-copy">
          <p className="founders-body">Создавая школу, мы хотели изменить привычный подход к образованию и показать, что искусственный интеллект способен не только упрощать задачи, но и раскрывать потенциал человека.</p>
          <p className="founders-body">Мир меняется быстрее, чем традиционные системы образования. Сегодня недостаточно просто обладать знаниями — важно уметь превращать их в возможности.</p>
          <p className="founders-body">Именно поэтому в основе MULTUM.AI — практика, реальные проекты и развитие самостоятельного мышления. Мы учим видеть нестандартные решения, превращать идеи в цифровые продукты и использовать технологии для профессионального роста.</p>
          <p className="founders-body">Мы убеждены: чем доступнее становится искусственный интеллект, тем ценнее становится способность человека мыслить самостоятельно.</p>
          <p className="founders-body">Для нас важно, чтобы после обучения вы не просто знали, как работают нейросети, а понимали, как использовать их для достижения собственных целей.</p>
        </div>
        <blockquote className="founders-quote">
          <p>Наша задача — не просто научить вас работать с технологиями, а научить <strong>мыслить на шаг вперёд.</strong></p>
        </blockquote>
        <footer className="founders-footer">
          <a className="button button--glass founders-cta" href="/courses/">Выбрать обучение</a>
        </footer>
      </article>
    </main>
  );
}
