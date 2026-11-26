import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteNav from "../../components/SiteNav";
import { courses, directions, contact } from "../../data/courses";

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
  const modules = courses.filter((course) => direction.modules.includes(course.name));
  const otherDirections = directions.filter((item) => item.slug !== slug);
  return (
    <main className="site-background courses-page direction-page">
      <SiteNav active="courses" />
      <section className="direction-page-screen" aria-labelledby="direction-title">
        <div className="courses-container">
          <a className="direction-back" href="/courses/#directions">← Все направления</a>
          <header className="direction-page-hero">
            <div>
              <p className="courses-kicker">НАПРАВЛЕНИЕ {direction.code}</p>
              <h1 id="direction-title">AI <span>{direction.name.slice(3)}</span></h1>
              <p>{direction.description}</p>
              <a className="course-action direction-primary" href="#modules">Выбрать курс</a>
            </div>
            <div className={"specialty-art specialty-art--direction direction-page-art specialty-art--" + direction.theme} aria-hidden="true">
              {direction.theme === "creative" && <img src="/images/ai-design.webp" alt="" width="280" height="158" />}
              <span>{direction.code}</span>
            </div>
          </header>
          <section id="modules" className="direction-page-modules" aria-labelledby="modules-title">
            <h2 id="modules-title">Курсы <span>направления</span></h2>
            <div className="direction-page-grid">
              {modules.map((course) => (
                <article className="direction-page-module" key={course.name}>
                  <div className="direction-module-top"><p className="courses-kicker">КУРС</p><span>{course.code}</span></div>
                  <h3>{course.name}</h3>
                  <p>{course.description}</p>
                  <div className="direction-page-module-footer">
                    <span aria-label={course.price.replace(" ₽", " рублей")}>{course.price.replace(" ₽", "")}</span>
                    <a className="course-action direction-primary" href={contact} aria-label={"Узнать о курсе " + course.name}>Выбрать курс</a>
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
      </section>
    </main>
  );
}
