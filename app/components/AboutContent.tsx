export default function AboutContent({ embedded = false }: { embedded?: boolean }) {
  const Heading = embedded ? "h2" : "h1";
  return (
    <>
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-copy">
          <p className="about-eyebrow">О школе</p>
          <Heading id="about-title">Нейросети для <span>работы и <em>творчества</em></span></Heading>
          <p className="about-byline">Мы Алина и Дарья, основательницы MULTUM AI.</p>
          <p className="about-lead">В MULTUM AI мы обучаем работе с нейросетями. Разбираем инструменты, показываем, как ими пользоваться, и применяем их на практических заданиях.</p>
          <p className="about-lead">Можно начать с базовых навыков или выбрать отдельное направление: дизайн, видео, разработку сайтов, игр и AI-агентов.</p>
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
          <svg className="about-course-banner__spark" viewBox="0 0 160 64" aria-hidden="true">
            <defs>
              <radialGradient id="about-cta-glow">
                <stop stopColor="#FF6B21" stopOpacity=".44" />
                <stop offset="1" stopColor="#FF6B21" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="about-cta-ray">
                <stop stopColor="#FF6B21" stopOpacity="0" />
                <stop offset=".5" stopColor="#FF874A" stopOpacity=".9" />
                <stop offset="1" stopColor="#FF6B21" stopOpacity="0" />
              </linearGradient>
            </defs>
            <ellipse cx="80" cy="32" rx="52" ry="25" fill="url(#about-cta-glow)" />
            <path d="M0 32H160" stroke="url(#about-cta-ray)" />
            <path d="M80 12Q81 30 96 32Q81 34 80 52Q79 34 64 32Q79 30 80 12Z" fill="#FF7935" />
            <path d="M80 23L82 30L89 32L82 34L80 41L78 34L71 32L78 30Z" fill="#FFD6B5" />
          </svg>
          <a className="about-course-banner__button" href="/courses/">Выбрать курс</a>
        </div>
      </section>
      <section className="creative-manifesto" id="manifesto" aria-label="Принципы MULTUM AI">
        <div className="creative-manifesto__copy">
          <p className="creative-manifesto__eyebrow">Школа нейросетей</p>
          <h2>
            <span>Мыслить</span>
            <span>Создавать</span>
            <span>Опережать<span className="creative-manifesto__dot">.</span></span>
          </h2>
          <p className="creative-manifesto__description">Осваивайте нейросети и воплощайте идеи в реальных проектах.</p>
          <div className="creative-manifesto__actions">
            <a className="creative-manifesto__primary" href="/courses/">Выбрать курс <span aria-hidden="true">→</span></a>
            <a className="creative-manifesto__secondary" href="#approach"><span className="creative-manifesto__circle" aria-hidden="true">↗</span>Как проходит обучение</a>
          </div>
        </div>
        <div className="creative-manifesto__visual">
          <h2 className="creative-philosophy-label" id="philosophy">Философия MULTUM AI</h2>
        </div>
      </section>
    </>
  );
}
