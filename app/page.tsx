import SiteNav from "./components/SiteNav";
import AboutContent from "./components/AboutContent";
import CoursesContent from "./components/CoursesContent";

export default function Home() {
  return (
    <main className="site-background home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <SiteNav active="home" />
        <div className="brand-lockup">
          <h1 id="home-title" className="brand-lockup__title">MULTUM{" "}<span>AI</span></h1>
          <p className="home-school-label">Школа нейросетей</p>
        </div>
      </section>
      <div className="home-about" id="about" aria-labelledby="about-title">
        <AboutContent embedded />
      </div>
      <div className="courses-page courses-embedded" id="courses" aria-label="Курсы MULTUM AI">
        <CoursesContent embedded />
      </div>
    </main>
  );
}
