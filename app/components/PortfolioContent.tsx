import { directions } from "../data/courses";
import { directionImages } from "../data/direction-images";

export default function PortfolioContent({ standalone = false }: { standalone?: boolean }) {
  const Heading = standalone ? "h1" : "h2";
  const groups = directions.map(direction => ({
    ...direction,
    images: directionImages(direction.slug).filter(Boolean)
  })).filter(group => group.images.length > 0);
  return (
    <section id="portfolio" className={"portfolio-section" + (standalone ? " portfolio-section--standalone" : "")} aria-labelledby="portfolio-title">
      <div className="portfolio-inner">
        <header className="portfolio-heading">
          <div>
            <Heading id="portfolio-title">Портфолио</Heading>
            <p>Примеры визуалов, созданных с помощью нейросетей.</p>
          </div>
          {!standalone && <a className="portfolio-link" href="/portfolio/">Все работы <span aria-hidden="true">↗</span></a>}
        </header>
        {groups.map(group => (
          <section className="portfolio-group" key={group.slug} aria-label={group.name}>
            <h3>{group.name}</h3>
            <div className="portfolio-grid">
              {(standalone ? group.images : group.images.slice(0,3)).map((src,index) => (
                <a key={src} className="portfolio-work" href={src} target="_blank" rel="noopener noreferrer" aria-label={group.name + ", пример " + (index+1) + " (открыть изображение)"}>
                  <img src={src} alt={group.name + " — пример " + (index+1)} loading="lazy" decoding="async"/>
                  <span className="portfolio-open" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </section>
        ))}
        {standalone && <a href="/courses/#directions" className="portfolio-link">Выбрать направление обучения <span aria-hidden="true">→</span></a>}
      </div>
    </section>
  );
}
