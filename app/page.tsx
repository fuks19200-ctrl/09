import SiteNav from "./components/SiteNav";

export default function Home() {
  return (
    <main className="site-background home-page">
      <SiteNav active="home" />
      <div className="brand-lockup">
        <h1 className="brand-lockup__title">MULTUM{" "}<span>AI</span></h1>
        <p className="home-school-label">Школа нейросетей</p>
      </div>
    </main>
  );
}
