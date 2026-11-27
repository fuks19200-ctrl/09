import { courses, directions, contact, programs } from "../data/courses";
import { AddCourseButton, StartCustomProgram } from "./CourseCart";

export default function CoursesContent({ embedded = false }: { embedded?: boolean }) {
  const Heading = embedded ? "h2" : "h1";
  return (
    <>
      <section className="creative-manifesto creative-manifesto--centered" id="manifesto" aria-labelledby="manifesto-title">
        <div className="creative-manifesto__copy">
          <Heading id="manifesto-title">
            Курсы по нейросетям
          </Heading>
          <div className="creative-manifesto__actions">
            <a className="creative-manifesto__primary" href="#programs">Выбрать курс</a>
          </div>
        </div>
        <div className="creative-philosophy-image creative-manifesto__portrait" aria-hidden="true" />
      </section>
      <section className="courses-screen courses-intro" id="programs" aria-labelledby="courses-title">
        <div className="courses-container">
          <div className="courses-program-layout">
            <header className="courses-manifesto">
              <p className="courses-kicker">ОСНОВНЫЕ КУРСЫ</p>
              <h2 id="courses-title" className="courses-programs-title">Программы <span>обучения</span></h2>
              <p className="courses-manifesto-description">Две готовые программы или набор курсов на выбор.</p>
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
                  <AddCourseButton courseId={program.theme} className="course-action" />
                </div>
                </div>
                <div className="program-card-media"></div>
              </article>
            ))}
              <article className="program-card program-card--custom">
                <div className="program-card-copy">
                  <div className="program-topline">
                    <p className="program-label">Индивидуальная программа</p>
                    <span className="program-index" aria-hidden="true">03</span>
                  </div>
                  <h3 className="program-name">Своя программа</h3>
                  <p className="program-description">Выберите минимум 3 курса со скидкой 40%.</p>
                  <div className="program-footer">
                    <StartCustomProgram />
                  </div>
                </div>
                <div className="program-card-media"></div>
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
            <p>Пять направлений, десять курсов.</p>
          </header>
          <div className="specialty-grid specialty-grid--directions">
            {directions.map((direction) => {
              const modules = courses.filter((course) => direction.modules.includes(course.name));
              return (
                <a className={"specialty-card specialty-card--direction specialty-card--" + direction.theme + " direction-theme--" + direction.slug} key={direction.name} href={"/courses/" + direction.slug + "/"} aria-label={"Подробнее: " + direction.name}>
                  <div className="specialty-content">
                    <div className="folder-meta"><span>{direction.code}</span><span aria-hidden="true">↗</span></div>
                    <h3>{direction.name}</h3>
                    <p>{direction.description}</p>
                    <div className="direction-card-footer">
                      <span>{modules.length === 1 ? "1 курс" : modules.length + " курса"}</span>
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
