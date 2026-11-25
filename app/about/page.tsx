import type { Metadata } from "next";
import SiteNav from "../components/SiteNav";
import AboutContent from "../components/AboutContent";
import CoursesContent from "../components/CoursesContent";

export const metadata: Metadata = {
  title: "О школе | MULTUM AI",
  description: "Школа нейросетей MULTUM AI: направления и формат обучения.",
};

export default function About() {
  return (
    <main className="site-background about-page">
      <SiteNav active="about" />
      <AboutContent />
      <div className="courses-page courses-embedded" id="courses" aria-label="Курсы MULTUM AI">
        <CoursesContent embedded />
      </div>
    </main>
  );
}
