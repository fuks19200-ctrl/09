import SiteNav from "./components/SiteNav";

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
      <div className="home-next-screen" aria-hidden="true" />
    </main>
  );
}
