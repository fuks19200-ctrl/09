"use client";

import { useState } from "react";

export default function DevelopmentPreview() {
  const [mode, setMode] = useState<"web" | "game">("web");
  return (
    <aside className="development-preview" aria-label="Интерактивные примеры направлений">
      <div className="development-preview-stage" data-mode={mode}>
        <div className="development-orbit" aria-hidden="true"/>
        <div className="development-window" aria-hidden="true">
          <div className="development-window-bar"><i/><i/><i/><span/></div>
          <div className="development-window-body">
            <div className="development-window-nav"><b/><span/><span/><span/></div>
            <div className="development-window-hero"><div><i/><i/><i/><b/></div><div className="development-window-art"><div/></div></div>
            <div className="development-window-grid"><i/><i/><i/></div>
          </div>
        </div>
        <div className="development-game" aria-hidden="true">
          <svg viewBox="0 0 280 220" fill="none">
            <defs><linearGradient id="dev-floor" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#e8b69b"/><stop offset="1" stopColor="#e8dcef"/></linearGradient><linearGradient id="dev-cube" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f9b58b"/><stop offset="1" stopColor="#e77738"/></linearGradient></defs>
            <path d="M18 145 137 84 262 145 143 208Z" fill="url(#dev-floor)" stroke="#fff" strokeOpacity=".75"/>
            <g stroke="#fff" strokeOpacity=".48" strokeWidth="1"><path d="m48 130 124 64m-94-80 124 64m-94-79 124 64m-185 1 119-61m-89 76 119-61m-89 76 119-61"/></g>
            <path d="m91 108 48-25 49 25-48 25Z" fill="#ffd9bd"/><path d="m91 108 49 25v55l-49-25Z" fill="url(#dev-cube)"/><path d="m140 133 48-25v55l-48 25Z" fill="#b95d39"/>
            <path d="m154 62 26-13 27 13-26 14Z" fill="#f6e7ff"/><path d="m154 62 27 14v31l-27-14Z" fill="#b9a4d7"/><path d="m181 76 26-14v31l-26 14Z" fill="#8d78b5"/>
            <circle cx="65" cy="76" r="19" fill="#fff4e9"/><ellipse cx="65" cy="104" rx="17" ry="5" fill="#83594d" opacity=".14"/>
          </svg>
          <div className="development-game-controls"><span>＋</span><span>● &nbsp; ●</span></div>
        </div>
        <span className="development-visual-index" aria-hidden="true">0{mode === "web" ? 1 : 2} / 02</span>
      </div>
      <div className="development-preview-footer">
        <div className="development-preview-tabs" role="group" aria-label="Выбор визуала">
          <button type="button" aria-pressed={mode === "web"} onClick={() => setMode("web")}>Web</button>
          <button type="button" aria-pressed={mode === "game"} onClick={() => setMode("game")}>Games</button>
        </div>
        <span>{mode === "web" ? "Веб-интерфейс" : "Игровая сцена"}</span>
      </div>
    </aside>
  );
}
