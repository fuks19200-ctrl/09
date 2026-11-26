"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { courses, programs, creativeBundle, customProgramMin, customProgramDiscount, parseCoursePrice, customCoursePrice, contact } from "../data/courses";

const catalogue = [...programs, ...courses, creativeBundle].map((item) => ({
  id: item.theme, name: item.name, price: parseCoursePrice(item.price),
}));
const eligible = new Set(courses.map((course) => course.theme));
const coveredByCreative = (id: string) => creativeBundle.includes.includes(id);
const normalizeIds = (ids: string[]) => ids.includes(creativeBundle.theme) ? ids.filter((id) => !coveredByCreative(id)) : ids;
const storageKey = "multum-course-cart-v1";
const customKey = "multum-custom-program-v1";
const money = (value: number) => new Intl.NumberFormat("ru-RU").format(value) + " ₽";
const number = (value: number) => new Intl.NumberFormat("ru-RU").format(value);
type Mode = "regular" | "custom";
type CartContextValue = {
  ids: string[]; customIds: string[]; mode: Mode; ready: boolean;
  add: (id: string) => void; open: () => void; setMode: (mode: Mode) => void;
};
const CartContext = createContext<CartContextValue | null>(null);
function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("CourseCartProvider is required");
  return value;
}
function cleanIds(value: unknown, allowed: (id: string) => boolean): string[] {
  return Array.isArray(value) ? Array.from(new Set(value.filter((id): id is string => typeof id === "string" && allowed(id)))) : [];
}

function CartIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 4h2l2.3 11h11.1l2-8H6"/><circle cx="9" cy="19.5" r="1.2"/><circle cx="18" cy="19.5" r="1.2"/></svg>;
}
function CloseIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>;
}
export function CourseCartProvider({ children }: { children: ReactNode }) {
  const [regularIds, setRegularIds] = useState<string[]>([]);
  const [customIds, setCustomIds] = useState<string[]>([]);
  const [mode, setMode] = useState<Mode>("regular");
  const [ready, setReady] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || "[]");
      setRegularIds(normalizeIds(cleanIds(saved, (id) => catalogue.some((item) => item.id === id))));
    } catch { /* in-memory fallback */ }
    try {
      const saved = JSON.parse(localStorage.getItem(customKey) || "{}");
      setCustomIds(cleanIds(saved.ids, (id) => eligible.has(id)));
      setMode(saved.mode === "custom" ? "custom" : "regular");
    } catch { /* in-memory fallback */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(regularIds));
      localStorage.setItem(customKey, JSON.stringify({ ids: customIds, mode }));
    } catch { /* in-memory fallback */ }
  }, [regularIds, customIds, mode, ready]);

  function switchMode(next: Mode) {
    setMode(next);
    setConfirmed(false);
  }
  function open() {
    if (dialog.current && !dialog.current.open) dialog.current.showModal();
  }
  function add(id: string) {
    const item = catalogue.find((entry) => entry.id === id);
    if (!ready || !item) return;
    if (mode === "custom") {
      if (!eligible.has(id)) return;
      setCustomIds((previous) => previous.includes(id) ? previous : [...previous, id]);
      setConfirmed(false);
    } else {
      setRegularIds((previous) => normalizeIds(previous.includes(id) ? previous : [...previous, id]));
    }
    setAnnouncement(item.name + " — добавлено в корзину");
  }
  function remove(id: string) {
    if (mode === "custom") {
      setCustomIds((previous) => previous.filter((entry) => entry !== id));
      setConfirmed(false);
    } else setRegularIds((previous) => previous.filter((entry) => entry !== id));
    setAnnouncement("Курс удалён из корзины");
  }

  const custom = mode === "custom";
  const ids = custom ? customIds : regularIds;
  const items = ids.flatMap((id) => catalogue.filter((item) => item.id === id));
  const originalTotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = items.reduce((sum, item) => sum + (custom ? customCoursePrice(item.price) : item.price), 0);
  const remaining = Math.max(0, customProgramMin - customIds.length);
  const canConfirm = custom && remaining === 0;

  return (
    <CartContext.Provider value={{ ids, customIds, mode, ready, add, open, setMode: switchMode }}>
      {children}
      <button type="button" className="course-cart-trigger" aria-label={"Корзина, курсов: " + items.length} aria-haspopup="dialog" onClick={open}>
        <CartIcon />
        {items.length > 0 && <span className="course-cart-badge" aria-hidden="true">{items.length}</span>}
      </button>
      <span className="course-cart-sr" role="status" aria-live="polite">{announcement}</span>
      <dialog className="course-cart-dialog" ref={dialog} aria-labelledby="course-cart-title" onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className="course-cart-panel">
          <div className="course-cart-heading"><h2 id="course-cart-title">Корзина</h2><button type="button" className="course-cart-close" aria-label="Закрыть корзину" onClick={() => dialog.current?.close()}><CloseIcon /></button></div>
          <div className="course-cart-tabs" aria-label="Тип корзины">
            <button type="button" aria-pressed={!custom} onClick={() => switchMode("regular")}>Обычная{regularIds.length > 0 ? " · " + regularIds.length : ""}</button>
            <button type="button" aria-pressed={custom} onClick={() => switchMode("custom")}>Своя программа{customIds.length > 0 ? " · " + customIds.length : ""}</button>
          </div>
          {custom && <div className="custom-cart-status" role="status">
            <strong>Скидка {customProgramDiscount}% · от {customProgramMin} курсов</strong>
            <p>{remaining > 0 ? "Выберите ещё " + remaining + " курс(а), чтобы собрать программу." : "Минимальное количество курсов выбрано."}</p>
            <div className="custom-cart-progress"><span style={{width: Math.min(100, customIds.length / customProgramMin * 100) + "%"}} /></div>
          </div>}
          {items.length === 0 ? <p className="course-cart-empty">Выберите курсы — они появятся здесь.</p> : (
            <ul className="course-cart-list">
              {items.map((item) => (
                <li className="course-cart-item" key={item.id}>
                  <div><h3>{item.name}</h3>{item.id === creativeBundle.theme && <p className="course-cart-bundle-note">AI CREATOR · AI DESIGN · AI VIDEO</p>}
                    {custom ? <div className="custom-price"><del>{money(item.price)}</del><strong>{money(customCoursePrice(item.price))}</strong></div> : <p>{money(item.price)}</p>}
                  </div>
                  <button className="course-cart-remove" type="button" aria-label={"Удалить " + item.name} onClick={() => remove(item.id)}><CloseIcon /></button>
                </li>
              ))}
            </ul>
          )}
          {custom && items.length > 0 && <div className="custom-cart-savings"><span>Экономия при выборе от 3 курсов</span><span>{money(originalTotal-total)}</span></div>}
          <div className="course-cart-total" aria-live="polite"><span>{custom && remaining > 0 ? "Предварительно" : "Итого"}</span><strong>{money(total)}</strong></div>
          {custom && <button type="button" className="course-cart-continue" disabled={!canConfirm} onClick={() => { if (canConfirm) setConfirmed(true); }}>Сформировать программу</button>}
          {custom && confirmed && canConfirm && <div className="custom-cart-confirmed" role="status">Программа собрана. Для оформления свяжитесь с нами.<a href={contact} target="_blank" rel="noopener noreferrer">Связаться в Telegram</a></div>}
          {custom ? <a className="custom-cart-more" href="/courses/#directions" onClick={() => dialog.current?.close()}>Продолжить выбор</a> : <button type="button" className="course-cart-continue" onClick={() => dialog.current?.close()}>Продолжить выбор</button>}
        </div>
      </dialog>
    </CartContext.Provider>
  );
}

export function AddCourseButton({ courseId, className, label = "Выбрать курс" }: { courseId: string; className?: string; label?: string }) {
  const cart = useCart();
  const allowed = cart.mode !== "custom" || eligible.has(courseId);
  const included = cart.mode === "regular" && cart.ids.includes(creativeBundle.theme) && coveredByCreative(courseId);
  const selected = cart.ids.includes(courseId) || included;
  const name = catalogue.find((item) => item.id === courseId)?.name || "курс";
  return <button type="button" className={(className || "") + " course-cart-add"} disabled={!cart.ready} aria-label={(selected ? "Открыть корзину: " : "Добавить в корзину: ") + name} data-selected={selected} onClick={() => { if (!allowed) { cart.setMode("regular"); return; } if (selected) cart.open(); else cart.add(courseId); }}>{!allowed ? "Обычная покупка" : included ? "В составе AI CREATIVE" : selected ? "В корзине ✓" : label}</button>;
}
export function StartCustomProgram() {
  const cart = useCart();
  return <a className="course-action" href="#directions" onClick={() => cart.setMode("custom")}>Собрать программу</a>;
}
export function RegularModeOnly({ children }: { children: ReactNode }) {
  return useCart().mode === "regular" ? <>{children}</> : null;
}
export function CoursePrice({ courseId }: { courseId: string }) {
  const cart = useCart();
  const item = catalogue.find((entry) => entry.id === courseId);
  if (!item) return null;
  return cart.mode === "custom" && eligible.has(courseId) ? <span className="custom-price"><del>{number(item.price)}</del><strong>{number(customCoursePrice(item.price))}</strong></span> : <span aria-label={money(item.price)}>{number(item.price)}</span>;
}

