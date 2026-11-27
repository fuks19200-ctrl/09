import type { Metadata } from "next";
import SiteNav from "../components/SiteNav";
import PortfolioContent from "../components/PortfolioContent";

export const metadata: Metadata = {
  title: "Портфолио | MULTUM AI",
  description: "Примеры визуалов, созданных с помощью нейросетей."
};

export default function PortfolioPage() {
  return <main className="site-background portfolio-page"><SiteNav active="portfolio"/><PortfolioContent standalone /></main>;
}
