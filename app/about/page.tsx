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
        <h1>Будущее начинается<br />с вашего <span>выбора.</span></h1>
        <p className="founders-story__lead">Мы — Алина и Даша, основательницы MULTUM.AI. Мы создали эту школу, чтобы возможности искусственного интеллекта стали доступны каждому.</p>
        <p>В мире, где технологии меняются быстрее, чем привычные профессии, важно не просто знать о нейросетях, а уметь превращать идеи в результат. Поэтому мы объединили современное образование, творчество и практику в одном пространстве.</p>
        <p>Наша школа — для тех, кто хочет создавать собственные проекты, расширять профессиональные возможности и уверенно использовать AI в работе, бизнесе и жизни. Мы учим не только инструментам, но и новому подходу к решению задач.</p>
        <p className="founders-story__signature">Мы верим: технологии открывают возможности. А то, кем вы станете, выбираете вы.</p>
        <a className="button button--glass founders-cta" href="/courses/">
          <span>Выбрать обучение</span>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
        </a>
      </article>
    </main>
  );
}
