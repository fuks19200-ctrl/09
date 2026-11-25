import SiteNav from "./components/SiteNav";

export default function Home() {
  return (
    <main className="site-background home-page">
      <SiteNav active="home" />
      <div className="brand-lockup">
        <h1 className="brand-lockup__title">MULTUM<span>.AI</span></h1>
        <p className="brand-lockup__tagline">Мыслить <span aria-hidden="true">|</span> Создавать <span aria-hidden="true">|</span> Опережать</p>
        <p className="home-school-label">Школа нейросетей</p>
      </div>
    </main>
  );
}
