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
    <main className={"site-background courses-page direction-page" + (isCreative ? " direction-page--creative" : "")}>
      <SiteNav active="courses" />
      <section className="direction-page-screen" aria-labelledby="direction-title">
        <div className="courses-container">
          <a className="direction-back" href="/courses/#directions">← Все направления</a>
          <div className={isCreative ? "creative-direction-layout" : undefined}>
            <div className={isCreative ? "creative-direction-copy" : undefined}>
          <header className="direction-page-hero">
            <div>
              <p className="courses-kicker direction-editorial-kicker">Направление {direction.code}</p>
              <h1 id="direction-title">AI <span>{direction.name.slice(3)}</span></h1>
              <p className="direction-editorial-description">{direction.description}</p>
              {isCreative ? (
                <RegularModeOnly><div className="creative-bundle-offer">
                  <p className="creative-bundle-caption">Полный курс · 3 программы</p>
                  <div className="creative-bundle-price">
                    <strong>{creativeBundle.price.replace(" ₽", "")}</strong>
                    <del aria-label="Стоимость курсов по отдельности: 50 700 рублей">50 700</del>
                  </div>
                  <p className="creative-bundle-saving">Экономия 11 800 ₽</p>
                  <AddCourseButton courseId={creativeBundle.theme} className="course-action direction-primary" label="Выбрать полный курс" />
                </div></RegularModeOnly>
              ) : <a className="course-action direction-primary" href="#modules">Выбрать курс</a>}
            </div>
            {!isCreative && <div className={"specialty-art specialty-art--direction direction-page-art specialty-art--" + direction.theme} aria-hidden="true">
              {direction.theme === "creative" && <img src="/images/ai-design.webp" alt="" width="280" height="158" />}
              <span>{direction.code}</span>
            </div>}
          </header>
          <section id="modules" className="direction-page-modules" aria-labelledby="modules-title">
            <div className="direction-modules-heading">
              <h2 id="modules-title">{isCreative ? "В курс " : "Курсы "}<span>{isCreative ? "входит" : "направления"}</span></h2>
              <span className="direction-module-count">{String(modules.length).padStart(2,"0")}</span>
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
                    <AddCourseButton courseId={course.theme} className="course-action direction-primary" label="Выбрать" />
                  </div>
                </article>
              ))}
            </div>
          </section>
          <div className="courses-help"><p>Нужна помощь с выбором курса?</p><a className="course-action" href={contact}>Консультация</a></div>
          <nav className="direction-related" aria-label="Другие направления обучения">
            <h2>Другие <span>направления</span></h2>
            <div>{otherDirections.map((item) => <a key={item.slug} href={"/courses/" + item.slug + "/"}>{item.name} <span aria-hidden="true">→</span></a>)}</div>
          </nav>
            </div>
            {isCreative && <aside className="creative-direction-gallery" aria-label="Галерея AI CREATIVE"><CreativeCarousel /></aside>}
          </div>
        </div>
      </section>
    </main>
  );
}
