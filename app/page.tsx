import SiteNav from "./components/SiteNav";

export default function Home() {
  return (
    <main className="site-background home-page">
      <SiteNav active="home" />
      <div className="glass-brand-mark" aria-hidden="true">
        <svg viewBox="0 0 104 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="mark-edge" x1="10" y1="8" x2="94" y2="92" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity=".98" />
              <stop offset=".42" stopColor="white" stopOpacity=".46" />
              <stop offset=".75" stopColor="#CBB7F5" stopOpacity=".45" />
              <stop offset="1" stopColor="white" stopOpacity=".9" />
            </linearGradient>
            <linearGradient id="mark-glass" x1="12" y1="12" x2="83" y2="91" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity=".5" />
              <stop offset=".45" stopColor="white" stopOpacity=".08" />
              <stop offset=".72" stopColor="white" stopOpacity=".18" />
              <stop offset="1" stopColor="white" stopOpacity=".47" />
            </linearGradient>
            <mask id="mark-interior" maskUnits="userSpaceOnUse">
              <path d="M19 81V21L52 62L85 21V81" stroke="white" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
            </mask>
            <mask id="mark-rim" maskUnits="userSpaceOnUse">
              <path d="M19 81V21L52 62L85 21V81" stroke="white" strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 81V21L52 62L85 21V81" stroke="black" strokeWidth="16.5" strokeLinecap="round" strokeLinejoin="round" />
            </mask>
          </defs>
          <g mask="url(#mark-interior)">
            <rect width="104" height="100" fill="url(#mark-glass)" />
            <path d="M5 14Q55 4 99 30L99 36Q50 14 5 22Z" fill="white" opacity=".25" />
          </g>
          <rect width="104" height="100" fill="url(#mark-edge)" mask="url(#mark-rim)" />
        </svg>
      </div>
      <p className="home-school-label">Школа нейросетей</p>
      <div className="brand-lockup">
        <h1 className="brand-lockup__title">MULTUM<span>.AI</span></h1>
        <p className="brand-lockup__tagline">Мыслить <span aria-hidden="true">|</span> Создавать <span aria-hidden="true">|</span> Опережать</p>
      </div>
    </main>
  );
}
