import { existsSync } from "node:fs";
import { join } from "node:path";
import PortfolioCarousel from "./PortfolioCarousel";

const portfolioAssets = [
  ["Ноутбук с лендингом MULTUM.AI.png","Лендинг MULTUM.AI"],
  ["5206392513818729506.jpg","Архитектура"],
  ["5206392513818729505.jpg","Коты у моря"],
  ["Serenität im orangefarbenen Sonnenlicht.png","Солнечный свет"],
  ["Рыжеволосая в оливковой куртке.png","Портрет"],
  ["Модный дуэт в стиле M.png","Модный дуэт"],
  ["creative-01.png","Парфюмерия"],
];

export default function PortfolioContent({ standalone = false }: { standalone?: boolean }) {
  const Heading = standalone ? "h1" : "h2";
  const cards = portfolioAssets.map(([file,title]) => ({
    src: existsSync(join(process.cwd(),"public","images",file)) ? "/images/" + encodeURIComponent(file) : "",
    title
  }));
  return (
    <section id="portfolio" className={"portfolio-section" + (standalone ? " portfolio-section--standalone" : "")} aria-labelledby="portfolio-title">
      <div className="portfolio-inner">
        <header className="portfolio-heading">
          <div><Heading id="portfolio-title">Портфолио</Heading></div>
          {!standalone && <a className="portfolio-link" href="/portfolio/">Все работы <span aria-hidden="true">↗</span></a>}
        </header>
        <PortfolioCarousel cards={cards}/>
        {standalone && <a href="/courses/#directions" className="portfolio-link">Выбрать направление обучения <span aria-hidden="true">→</span></a>}
      </div>
    </section>
  );
}
