import { existsSync } from "node:fs";
import { join } from "node:path";

const foundersNames = ["founders-transparent.png", "Модный дуэт в стиле M.png", "Модный дуэт в стиле M.png"];
const foundersPortrait = foundersNames.find((name) => existsSync(join(process.cwd(), "public", "images", name)));

export default function AboutContent({ embedded = false }: { embedded?: boolean }) {
  const Heading = embedded ? "h2" : "h1";
  return (
    <>
      <section className={"about-hero" + (foundersPortrait ? " about-hero--transparent" : "")} aria-labelledby="about-title">
        {foundersPortrait && <img className="about-founders-portrait" src={"/images/" + encodeURIComponent(foundersPortrait)} alt="Основательницы MULTUM AI" width={1101} height={1429} /> }
        <div className="about-hero-copy">
          <p className="about-eyebrow">О нас</p>
          <Heading id="about-title">Школа <span>нейросетей</span></Heading>
          <p className="about-byline">Мы Алина и Дарья, основательницы MULTUM AI.</p>
          <p className="about-lead">Мы учим работать с нейросетями: создавать изображения и видео, разрабатывать сайты и автоматизировать задачи.</p>
          <p className="about-lead">Курс можно выбрать по своему опыту и интересам.</p>
          <div className="about-hero-actions">
            <a className="about-scroll" href="#approach">Наш подход к обучению</a>
            <a className="button button--glass founders-cta" href="/courses/">Выбрать обучение</a>
          </div>
        </div>
      </section>
      <section className="about-details" id="approach" aria-labelledby="approach-title">
        <div className="about-details-inner">
          <div>
            <p className="about-eyebrow">Наш подход</p>
            <h2 id="approach-title">Как проходит <span>обучение</span></h2>
          </div>
          <div className="about-details-copy">
            <p>Начинаем с инструментов и основных принципов работы с нейросетями.</p>
            <p>Разбираем примеры и закрепляем материал на практических заданиях.</p>
            <p>Выбираем задачи по направлению: от создания контента до разработки цифровых продуктов.</p>
          </div>
        </div>
        <div className="about-course-banner">
          <div className="about-course-banner__copy">
            <p className="about-course-banner__title">Выберите программу или отдельный курс.</p>
          </div>
          <a className="about-course-banner__button" href="/courses/">Выбрать обучение</a>
        </div>
      </section>

    </>
  );
}
