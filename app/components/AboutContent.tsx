export default function AboutContent({ embedded = false }: { embedded?: boolean }) {
  const Heading = embedded ? "h2" : "h1";
  return (
    <div className="about-unified" aria-labelledby="about-title">
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-copy">
          <p className="about-eyebrow">О нас</p>
          <Heading id="about-title">Будущее принадлежит <span>тем, кто умеет <em>думать</em></span></Heading>
          <p className="about-byline">Мы — Алина и Дарья, основательницы MULTUM AI.</p>
          <p className="about-lead">Создавая школу, мы хотели изменить привычный подход к образованию и показать, что искусственный интеллект способен раскрывать потенциал человека.</p>
          <p className="about-lead">Мир меняется быстрее, чем человек к нему адаптируется.</p>
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
            <h2 id="approach-title">От знаний — <br />к реальным <span>возможностям</span></h2>
          </div>
          <div className="about-details-copy">
            <p>Именно поэтому в основе <span style={{ color: "var(--color-orange)" }}>MULTUM.AI</span> — практика, чтобы видеть нестандартные решения, превращать идеи в продукты и использовать технологии для профессионального роста.</p>
            <p>Мы убеждены: чем доступнее становится искусственный интеллект, тем ценнее становится способность человека мыслить самостоятельно.</p>
            <p>Для нас важно, чтобы после обучения вы не просто знали, как работают нейросети, а понимали, как использовать их для достижения собственных целей.</p>
          </div>
        </div>
        <div className="about-course-banner">
          <div className="about-course-banner__copy">
            <p className="about-course-banner__title">Наша задача — не просто научить вас работать с технологиями, а научить <strong>мыслить на шаг вперёд.</strong></p>
          </div>
          <a className="about-course-banner__button" href="/courses/">Выбрать обучение</a>
        </div>
      </section>

    </div>
  );
}
