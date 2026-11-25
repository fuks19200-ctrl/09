import type { Metadata } from "next";
import SiteNav from "../components/SiteNav";

export const metadata: Metadata = { title: "Курсы — MULTUM.AI" };

export default function Courses() {
  return (
    <main className="site-background">
      <SiteNav active="courses" />
      <div className="brand-lockup">
        <h1 className="brand-lockup__title">Курсы<span>.</span></h1>
        <p className="brand-lockup__subtitle">Программы обучения скоро появятся здесь</p>
      </div>
    </main>
  );
}
