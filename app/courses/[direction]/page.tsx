import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteNav from "../../components/SiteNav";
import { AddCourseButton, CoursePrice, RegularModeOnly } from "../../components/CourseCart";
import CreativeCarousel from "../../components/CreativeCarousel";
import { courses, directions, contact, creativeBundle } from "../../data/courses";

type Props = { params: Promise<{ direction: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return directions.map(({ slug }) => ({ direction: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { direction: slug } = await params;
  const direction = directions.find((item) => item.slug === slug);
  return direction ? { title: direction.name + " | MULTUM AI", description: direction.description } : {};
}

export default async function DirectionPage({ params }: Props) {
  const { direction: slug } = await params;
  const direction = directions.find((item) => item.slug === slug);
  if (!direction) notFound();
  const isCreative = direction.slug === "creative";
  const modules = courses.filter((course) => direction.modules.includes(course.name));
  const otherDirections = directions.filter((item) => item.slug !== slug);

  return (
    <main className="site-background courses-page direction-page direction-page--gallery">
      <SiteNav active="courses" directionBack />
      <section className="direction-page-screen" aria-labelledby="direction-title">
        <div className="courses-container">
          <div className="creative-direction-layout">
            <div className="creative-direction-copy">
          <header className="direction-page-hero">
            <div>
              <p className="courses-kicker direction-editorial-kicker">Направление {direction.code}</p>
              <h1 id="direction-title">AI <span>{direction.name.slice(3)}</span></h1>
              <p className="direction-editorial-description">{direction.description}</p>
              {isCreative ? (
                <RegularModeOnly><div className="creative-bundle-offer">
                  <p className="creative-bundle-caption">Полный курс</p>
                  <div className="creative-bundle-price">
                    <strong>{creativeBundle.price}</strong>
                    <del aria-label="Стоимость курсов по отдельности: 50 700 рублей">50 700 ₽</del>
                  </div>
                  <p className="creative-bundle-saving">Экономия 11 800 ₽</p>
                  <AddCourseButton courseId={creativeBundle.theme} className="course-action direction-primary" label="Выбрать полный курс" />
                </div></RegularModeOnly>
              ) : null}
            </div>
          </header>
          <section id="modules" className="direction-page-modules" aria-labelledby="modules-title">
            <div className="direction-modules-heading">
              <h2 id="modules-title">{isCreative ? "В курс " : "Курсы "}<span>{isCreative ? "входит" : "направления"}</span></h2>
            </div>
            <div className="direction-page-grid">
              {modules.map((course) => (
                <article className="direction-page-module" key={course.name}>
                  <span className="direction-module-index" aria-hidden="true">{String(modules.indexOf(course) + 1).padStart(2,"0")}</span>
                  <div className="direction-module-copy">
                    <h3>{course.name}</h3>
                    <p>{course.description}</p>
                  </div>
                  <div className="direction-page-module-footer">
                    <CoursePrice courseId={course.theme} />
                    <AddCourseButton courseId={course.theme} className="course-action direction-module-select" label="Выбрать" />
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section className="direction-support" aria-labelledby="direction-support-title">
            <div className="direction-support-copy">
              <p className="direction-support-label">Персональная консультация</p>
              <h2 id="direction-support-title">Нужна помощь с выбором?</h2>
              <p>Подберём обучение под ваши цели, уровень и бюджет.</p>
            </div>
            <a className="course-action direction-support-action" href={contact}>Консультация <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 15 15 5M6 5h9v9"/></svg></a>
          </section>
          <nav className="direction-related" aria-label="Другие направления обучения">
            <h2>Другие <span>направления</span></h2>
            <div className="direction-related-grid">{otherDirections.map((item) => (
              <a key={item.slug} href={"/courses/" + item.slug + "/"}>
                <span className="direction-related-name"><small aria-hidden="true">{item.code}</small>{item.name}</span>
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5"/></svg>
              </a>
            ))}</div>
          </nav>
            </div>
            <aside className="creative-direction-gallery" aria-label={"Галерея " + direction.name}><CreativeCarousel key={direction.slug} direction={direction.name} /></aside>
          </div>
        </div>
      </section>
    </main>
  );
}
