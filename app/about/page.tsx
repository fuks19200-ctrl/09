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
          <h1>MULTUM.AI —<span>больше, чем школа нейросетей.</span></h1>
          <p className="founders-byline">Мы — <strong>Алина и Дарья</strong>, основательницы MULTUM.AI.</p>
        </header>
        <div className="founders-copy">
          <p className="founders-body">Создавая школу, мы хотели изменить сам подход к изучению искусственного интеллекта и показать, насколько далеко можно зайти, когда технологии становятся продолжением собственного мышления.</p>
          <p className="founders-body"><strong>В MULTUM.AI обучение строится вокруг практики.</strong> Здесь знания не остаются теорией — они превращаются в реальные проекты, профессиональный опыт и новые возможности.</p>
          <p className="founders-body">Мы учим смотреть на задачи шире, видеть потенциал там, где другие замечают ограничения, и использовать искусственный интеллект для реализации собственных идей.</p>
        </div>
        <blockquote className="founders-quote">
          <p>Для нас важно не то, сколько нейросетей вы освоите, а то, <strong>на что вы будете способны после обучения.</strong></p>
        </blockquote>
        <div className="founders-copy">
          <p className="founders-body">Мы хотим, чтобы каждый ученик вышел из школы с уверенностью в своих навыках и пониманием того, как превратить их в востребованную профессию, собственный проект или источник дохода.</p>
          <p className="founders-body">Мы убеждены: чем доступнее становится искусственный интеллект, тем ценнее становится человек, способный мыслить самостоятельно.</p>
        </div>
        <footer className="founders-footer">
          <div className="founders-manifesto">
            <p>Поэтому мы учим не просто работать с технологиями.</p>
            <strong>Мы учим мыслить на шаг вперёд.</strong>
          </div>
          <a className="button button--glass founders-cta" href="/courses/">Выбрать обучение</a>
        </footer>
      </article>
    </main>
  );
}
