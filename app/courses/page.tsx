import type { Metadata } from "next";
import SiteNav from "../components/SiteNav";
import CoursesContent from "../components/CoursesContent";

export const metadata: Metadata = {
  title: "Курсы | MULTUM AI",
  description: "Основные программы и специализированные курсы школы нейросетей MULTUM AI.",
};

export default function Courses() {
  return (
    <main className="site-background courses-page">
      <SiteNav active="courses" />
      <CoursesContent />
    </main>
  );
}
