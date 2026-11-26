import { courses, directions, contact } from "../data/courses";

const programs = [
  { name: "BASIC", label: "Базовая программа", description: "Знакомство с нейросетями, составление запросов и решение повседневных задач.", price: "7 900", theme: "basis" },
  { name: "ULTRA", label: "Комплексная программа", description: "Работа с AI-инструментами в нескольких направлениях и создание собственных проектов.", price: "99 900", theme: "ultra" },
];

export default function CoursesContent({ embedded = false }: { embedded?: boolean }) {
  const Heading = embedded ? "h2" : "h1";
  return (
    <>
      <section className="creative-manifesto creative-manifesto--centered" id="manifesto" aria-labelledby="manifesto-title">
        <div className="creative-manifesto__copy">
          <Heading id="manifesto-title">
            <span>Мыслить</span>
            <span>Создавать</span>
            <span>Опережать</span>
          </Heading>
          <div className="creative-manifesto__actions">
            <a className="creative-manifesto__primary" href="#programs">Выбрать курс</a>
          </div>
        </div>
        <div className="creative-philosophy-image creative-manifesto__portrait" aria-hidden="true" />
        <section className="creative-philosophy" id="philosophy" aria-labelledby="philosophy-heading">
          <div className="creative-philosophy-copy">
            <h2 id="philosophy-heading">Технологии меняют мир<br />Мы учим <span>менять его вместе с ними</span></h2>
          </div>
        </section>
      </section>
      <section className="courses-screen courses-intro" id="programs" aria-labelledby="courses-title">
        <div className="courses-container">
          <div className="courses-program-layout">
            <header className="courses-manifesto">
              <p className="courses-kicker">ОСНОВНЫЕ КУРСЫ</p>
              <h2 id="courses-title" className="courses-programs-title">Программы <span>обучения</span></h2>
              <p className="courses-manifesto-description">Комплексное обучение искусственному интеллекту: от базовых навыков работы с нейросетями до создания собственных цифровых продуктов и монетизации знаний.</p>
            </header>
            <div className="program-grid">
            {programs.map((program) => (
              <article className={"program-card program-card--" + program.theme} key={program.name}>
                <div className="program-card-copy">
                <div className="program-topline">
                  <p className="program-label">{program.label}</p>
                  <span className="program-index" aria-hidden="true">{program.theme === "basis" ? "01" : "02"}</span>
                </div>
                <h3 className="program-name">{program.name}</h3>
                <p className="program-description">{program.description}</p>
                <div className="program-footer">
                  <strong aria-label={program.price + " рублей"}>{program.price}</strong>
                  <a className="course-action" href={contact} aria-label={"Узнать о программе " + program.name}>Подробнее</a>
                </div>
                </div>
                <div className="program-card-media"><span className="program-progress">{program.theme === "basis" ? "30%" : "100%"}</span></div>
              </article>
            ))}
              <article className="program-card program-card--custom">
                <div className="program-card-copy">
                  <div className="program-topline">
                    <p className="program-label">Индивидуальная программа</p>
                    <span className="program-index" aria-hidden="true">03</span>
                  </div>
                  <h3 className="program-name">Собери свою программу</h3>
                  <p className="program-description">Выберите направления обучения под свои цели.</p>
                  <div className="program-footer">
                    <a className="course-action" href="#directions">Выбрать направления</a>
                  </div>
                </div>
                <div className="program-card-media"><span className="program-progress">5–100%</span></div>
              </article>
            </div>
          </div>
          <a className="courses-next" href="#directions">Все направления</a>
        </div>
      </section>
      <section className="courses-screen courses-directions" id="directions" aria-labelledby="directions-title">
        <div className="courses-container">
          <header className="directions-heading">
            <div>
              <p className="courses-kicker">СПЕЦИАЛИЗАЦИИ</p>
              <h2 id="directions-title">Направления <span>обучения</span></h2>
            </div>
            <p>Пять направлений. Выберите отдельный курс под свои цели.</p>
          </header>
          <div className="specialty-grid specialty-grid--directions">
            {directions.map((direction) => {
              const modules = courses.filter((course) => direction.modules.includes(course.name));
              return (
                <a className={"specialty-card specialty-card--direction specialty-card--" + direction.theme} key={direction.name} href={"/courses/" + direction.slug + "/"} aria-label={"Подробнее: " + direction.name}>
                  <div className={"specialty-art specialty-art--direction specialty-art--" + direction.theme} aria-hidden="true">
                    {direction.theme === "creative" && <img src="/images/ai-design.webp" alt="" width="280" height="158" loading="lazy" />}
                    <span>{direction.code}</span>
                  </div>
                  <div className="specialty-content">
                    <h3>{direction.name}</h3>
                    <p>{direction.description}</p>
                    <div className="direction-card-footer">
                      <span>{modules.length === 1 ? "Программа" : modules.length + " курса"}</span>
                      <span className="direction-details-label">Подробнее <span aria-hidden="true">→</span></span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
          <div className="courses-help"><p>Нужна помощь с выбором курса?</p><a className="course-action" href={contact}>Консультация</a></div>
        </div>
      </section>
    </>
  );
}
