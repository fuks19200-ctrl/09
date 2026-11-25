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
          <h1>Будущее принадлежит тем, <span>кто умеет думать.</span></h1>
        </header>
        <div className="founders-copy">
          <p className="founders-body">Мир меняется быстрее, чем привычные системы образования. Сегодня недостаточно просто обладать знаниями — важно уметь превращать их в возможности.</p>
          <p className="founders-body">Создавая MULTUM.AI, мы хотели выйти за рамки обычного обучения. Для нас искусственный интеллект — не замена человеческому мышлению, а инструмент, который расширяет его возможности.</p>
          <p className="founders-body">Мы помогаем развивать самостоятельность, креативность и стратегическое мышление. Через практику и реальные проекты учим находить нестандартные решения, превращать идеи в продукты и уверенно действовать в меняющемся мире.</p>
        </div>
        <blockquote className="founders-quote">
          <p>Наша цель — не просто научить вас работать с технологиями, а научить <strong>быть на шаг впереди.</strong></p>
        </blockquote>
        <footer className="founders-footer">
          <a className="button button--glass founders-cta" href="/courses/">Выбрать обучение</a>
        </footer>
      </article>
    </main>
  );
}
