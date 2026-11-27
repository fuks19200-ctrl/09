import { AccountNavButton } from "./Account";

export default function SiteNav({ active, directionBack = false }: { active: "home" | "about" | "courses" | "portfolio"; directionBack?: boolean }) {
  return (
      <header className={"site-header" + (directionBack ? " site-header--direction" : "")}>
        {directionBack && <a className="direction-back" href="/courses/#directions"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M16 10H4m5-5-5 5 5 5"/></svg>Все направления</a>}
        <nav className="site-nav" aria-label="Main navigation">
          <button className="site-nav__item site-nav__search" type="button" aria-label="Search" disabled title="Search coming soon">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 4.3 4.3" />
            </svg>
          </button>
          <a className="site-nav__item" href="/" aria-current={active === "home" ? "page" : undefined}>Home</a>
          <a className="site-nav__item" href={active === "home" ? "#about" : "/#about"} aria-current={active === "about" ? "page" : undefined}>About us</a>
          <a className="site-nav__item" href="/courses/" aria-current={active === "courses" ? "page" : undefined}>Courses</a>
          <a className="site-nav__item" href={active === "home" ? "#portfolio" : active === "courses" && !directionBack ? "/courses/#portfolio" : "/#portfolio"}>Portfolio</a>
          <button className="site-nav__item" type="button" disabled title="Coming soon">FAQ</button>
          <button className="site-nav__item" type="button" disabled title="Coming soon">Contacts</button>
          <AccountNavButton />
        </nav>
      </header>
  );
}
