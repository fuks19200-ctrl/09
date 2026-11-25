const programs = [
  { name: "BASIC", label: "Базовая программа", description: "Знакомство с нейросетями, составление запросов и решение повседневных задач.", price: "7 900 ₽", theme: "basis" },
  { name: "ULTRA", label: "Комплексная программа", description: "Работа с AI-инструментами в нескольких направлениях и создание собственных проектов.", price: "99 900 ₽", theme: "ultra" },
];

const courses = [
  { name: "AI CREATOR", description: "Создание контента для социальных сетей", price: "14 900 ₽", code: "01", theme: "creator" },
  { name: "AI DESIGN", description: "Графический дизайн и визуальные материалы", price: "14 900 ₽", code: "02", theme: "design" },
  { name: "AI VIDEO", description: "Генерация видео и анимация", price: "20 900 ₽", code: "03", theme: "video" },
  { name: "AI 3D", description: "Создание трёхмерной графики", price: "25 900 ₽", code: "04", theme: "three" },
  { name: "AI WEBSITES", description: "Разработка сайтов с помощью AI", price: "49 900 ₽", code: "05", theme: "websites" },
  { name: "AI GAMES", description: "Создание игр", price: "45 900 ₽", code: "06", theme: "games" },
  { name: "AI AGENTS", description: "Разработка AI-агентов", price: "59 900 ₽", code: "07", theme: "agents" },
  { name: "AI AUTOMATION", description: "Автоматизация рабочих процессов", price: "59 900 ₽", code: "08", theme: "automation" },
  { name: "AI MARKETING", description: "Дополнительный курс по маркетингу", price: "5 900 ₽", code: "09", theme: "marketing" },
  { name: "AI PRODUCT", description: "Дополнительный курс по созданию AI-продуктов", price: "10 900 ₽", code: "10", theme: "product" },
];

const contact = "https://t.me/multumai";

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
            <a className="creative-manifesto__primary" href="#programs">Выбрать курс <span aria-hidden="true">→</span></a>
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
                <div className="program-topline">
                  <p className="program-label">{program.label}</p>
                  <span className="program-index" aria-hidden="true">{program.theme === "basis" ? "01" : "02"}</span>
                </div>
                <h3 className="program-name">{program.name}</h3>
                <p className="program-description">{program.description}</p>
                <div className="program-footer">
                  <strong>{program.price}</strong>
                  <a className="course-action" href={contact} aria-label={"Узнать о программе " + program.name}>Подробнее</a>
                </div>
              </article>
            ))}
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
            <p>Курсы по отдельным навыкам и задачам.</p>
          </header>
          <div className="specialty-grid">
            {courses.map((course) => (
              <article className={"specialty-card specialty-card--" + course.theme} key={course.name}>
                <div className={"specialty-art specialty-art--" + course.theme} aria-hidden="true">
                  {course.theme === "design" ? <img src="/images/ai-design.webp" alt="" width="280" height="158" loading="lazy" /> : <><i /><i /><i /></>}
                  <span>{course.code}</span>
                </div>
                <div className="specialty-content">
                  <h3>{course.name}</h3>
                  <p>{course.description}</p>
                  <div className="specialty-footer"><strong>{course.price}</strong><a href={contact} aria-label={"Узнать о курсе " + course.name}>Подробнее</a></div>
                </div>
              </article>
            ))}
          </div>
          <div className="courses-help"><p>Нужна помощь с выбором курса?</p><a className="course-action" href={contact}>Консультация</a></div>
        </div>
      </section>
    </>
  );
}
