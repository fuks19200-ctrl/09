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
          <h1><span className="founders-brand">MULTUM.AI —</span><span className="founders-headline">больше, чем<br className="founders-break" /> школа <em>нейросетей.</em></span></h1>
          <p className="founders-byline">Мы — <strong>Алина и Дарья</strong>, основательницы MULTUM.AI.</p>
          <p className="founders-body">Создавая школу, мы хотели изменить сам подход к изучению искусственного интеллекта и показать, насколько далеко можно зайти, когда технологии становятся продолжением собственного мышления.</p>
        </header>
        <section className="founders-editorial" aria-label="Подход и ценность обучения">
          <div className="founders-column">
            <h2>Практика и мышление</h2>
            <p className="founders-body">В MULTUM.AI обучение строится вокруг практики. Здесь знания не остаются теорией — они превращаются в реальные проекты, профессиональный опыт и новые возможности.</p>
            <p className="founders-body">Мы учим смотреть на задачи шире, видеть потенциал там, где другие замечают ограничения, и использовать искусственный интеллект для реализации собственных идей.</p>
          </div>
          <div className="founders-column">
            <h2>Ваши возможности</h2>
            <p className="founders-body">Мы хотим, чтобы каждый ученик вышел из школы с уверенностью в своих навыках и пониманием того, как превратить их в востребованную профессию, собственный проект или источник дохода.</p>
            <p className="founders-body">Мы убеждены: чем доступнее становится искусственный интеллект, тем ценнее становится человек, способный мыслить самостоятельно.</p>
          </div>
        </section>
        <blockquote className="founders-quote">
          <span className="founders-quote__mark" aria-hidden="true">“</span>
          <p>Для нас важно не то, сколько нейросетей вы освоите, а то, <strong>на что вы будете способны после обучения.</strong></p>
        </blockquote>
        <footer className="founders-footer">
          <div className="founders-manifesto">
            <p>Поэтому мы учим не просто работать с технологиями.</p>
            <strong>Мы учим мыслить<br className="founders-break" /> на шаг вперёд.</strong>
          </div>
          <a className="button button--glass founders-cta" href="/courses/">Выбрать обучение</a>
        </footer>
      </article>
    </main>
  );
}
