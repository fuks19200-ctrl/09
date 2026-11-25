export default function SiteNav({ active }: { active: "home" | "about" | "courses" }) {
  return (
      <header className="site-header">
        <nav className="site-nav" aria-label="Основная навигация">
          <button className="button button--glass site-nav__item site-nav__search" type="button" aria-label="Поиск" disabled title="Поиск будет подключён позже">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 4.3 4.3" />
            </svg>
          </button>
          <a className="button button--glass site-nav__item" href="/" aria-current={active === "home" ? "page" : undefined}>Главная</a>
          <a className="button button--glass site-nav__item" href="/about/" aria-current={active === "about" ? "page" : undefined}>О нас</a>
          <a className="button button--glass site-nav__item" href="/courses/" aria-current={active === "courses" ? "page" : undefined}>Курсы</a>
          <button className="button button--glass site-nav__item" type="button" disabled title="Раздел будет добавлен позже">FAQ</button>
          <button className="button button--glass site-nav__item" type="button" disabled title="Раздел будет добавлен позже">Контакты</button>
        </nav>
      </header>
  );
}
