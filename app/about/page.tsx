import type { Metadata } from "next";
import SiteNav from "../components/SiteNav";
import AboutContent from "../components/AboutContent";

export const metadata: Metadata = {
  title: "О нас — MULTUM.AI",
  description: "История и миссия школы нейросетей MULTUM.AI.",
};

export default function About() {
  return (
    <main className="site-background about-page">
      <SiteNav active="about" />
      <AboutContent />
    </main>
  );
}
