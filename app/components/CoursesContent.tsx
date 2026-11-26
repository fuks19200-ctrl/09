const programs = [
  { name: "BASIC", label: "Базовая программа", description: "Знакомство с нейросетями, составление запросов и решение повседневных задач.", price: "7 900", theme: "basis" },
  { name: "ULTRA", label: "Комплексная программа", description: "Работа с AI-инструментами в нескольких направлениях и создание собственных проектов.", price: "99 900", theme: "ultra" },
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
                <svg className="program-card-cats" viewBox="145 61 660 373" role="img" aria-label="Пять котов сидят на краю карточки" xmlns="http://www.w3.org/2000/svg">
                  <defs><clipPath id="program-cats-outline" clipPathUnits="userSpaceOnUse"><path d="M158 273 Q157 264 172 253 Q188 246 201 256 L237 268 Q224 246 229 222 Q231 195 254 167 L263 151 Q253 143 255 131 L258 118 L257 102 L276 116 Q286 111 297 114 Q305 98 312 98 Q319 99 314 126 L314 151 Q325 169 332 199 Q345 239 326 267 Q315 287 285 290 Q253 290 222 284 L188 275 Q173 271 162 279Z" /><path d="M350 270 Q342 252 348 222 Q350 197 357 170 L360 138 Q354 129 356 111 L364 93 L362 70 Q365 67 378 85 Q392 80 405 84 L415 76 Q421 79 417 98 Q424 109 423 125 L428 153 Q434 174 441 191 Q456 220 453 245 Q452 267 439 277 Q428 286 407 285 L378 285 Q358 284 350 270Z" /><path d="M461 268 Q452 247 455 222 Q457 193 470 166 L470 133 Q468 112 475 99 L475 80 Q479 73 490 90 Q505 84 519 89 L530 80 Q535 79 531 99 Q535 118 528 133 L530 153 Q545 176 553 200 Q566 222 563 244 Q561 265 549 277 Q535 283 520 282 L508 294 L496 282 Q473 284 461 268Z" /><path d="M582 267 Q574 250 575 228 Q576 195 586 170 L591 146 Q585 131 592 117 L594 103 L594 85 Q598 81 611 99 Q624 95 639 99 L650 87 Q656 86 654 103 L652 116 Q659 130 651 146 L655 166 Q669 193 670 226 Q674 253 660 271 Q654 280 645 284 L638 318 L633 354 L629 389 Q628 412 620 427 Q611 427 613 407 L612 366 L610 330 L610 286 Q591 281 582 267Z" /><path d="M703 271 Q690 248 695 219 Q697 189 709 161 L710 147 Q703 136 704 123 L703 99 Q709 96 720 111 Q735 107 748 112 L768 100 L771 103 L765 125 Q770 139 763 153 Q767 171 780 193 Q795 219 792 244 Q788 268 774 282 L765 286 Q764 310 759 332 L757 364 Q758 380 770 392 Q779 404 768 406 Q754 409 745 398 Q737 384 737 365 L736 321 L731 287 Q713 286 703 271Z" /></clipPath></defs>
                  <image href="/images/5206392513818729505.jpg" x="0" y="-1331" width="1035" height="2048" preserveAspectRatio="none" clipPath="url(#program-cats-outline)" />
                </svg>
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
