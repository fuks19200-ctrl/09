export default function AboutContent({ embedded = false }: { embedded?: boolean }) {
  const Heading = embedded ? "h2" : "h1";
  return (
    <>
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-copy">
          <p className="about-eyebrow">О нас</p>
          <Heading id="about-title">Будущее принадлежит <span>тем, кто умеет <em>думать</em></span></Heading>
          <p className="about-byline">Мы — Алина и Дарья, основательницы MULTUM AI.</p>
          <p className="about-lead">Создавая школу, мы хотели изменить привычный подход к образованию и показать, что искусственный интеллект способен не только упрощать задачи, но и раскрывать потенциал человека.</p>
          <p className="about-lead">Мир меняется быстрее, чем традиционные системы образования. Сегодня недостаточно просто обладать знаниями — важно уметь превращать их в возможности.</p>
          <div className="about-hero-actions">
            <a className="about-scroll" href="#approach">Как проходит обучение</a>
            <a className="button button--glass founders-cta" href="/courses/">Выбрать курс</a>
          </div>
        </div>
      </section>
      <section className="about-details" id="approach" aria-labelledby="approach-title">
        <div className="about-details-inner">
          <div>
            <p className="about-eyebrow">Обучение</p>
            <h2 id="approach-title">Что делаем <br />на <span>занятиях</span></h2>
          </div>
          <div className="about-details-copy">
            <p>Учимся подбирать нейросеть под задачу, составлять запросы и проверять результат. Разбираем ошибки и дорабатываем полученные материалы.</p>
            <p>В зависимости от курса создаём изображения и видео, собираем сайты или настраиваем автоматизацию.</p>
            <p>Практические задания помогают освоить инструменты на примерах рабочих задач и собственных проектов.</p>
          </div>
        </div>
        <div className="about-course-banner">
          <div className="about-course-banner__copy">
            <p className="about-course-banner__title">Ваш следующий шаг — <strong>MULTUM AI</strong></p>
            <p className="about-course-banner__subtitle">Выберите программу под свои цели.</p>
          </div>
          <a className="about-course-banner__button" href="/courses/">Выбрать курс</a>
        </div>
      </section>

    </>
  );
}
