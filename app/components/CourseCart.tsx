"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { courses, programs } from "../data/courses";

const catalogue = [...programs, ...courses].map((item) => ({
  id: item.theme,
  name: item.name,
  price: Number(item.price.replace(/[^0-9]/g, "")),
}));
const storageKey = "multum-course-cart-v1";
const money = (value: number) => new Intl.NumberFormat("ru-RU").format(value) + " ₽";

type CartContextValue = {
  ids: string[];
  ready: boolean;
  add: (id: string) => void;
  open: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function CartIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 4h2l2.3 11h11.1l2-8H6"/><circle cx="9" cy="19.5" r="1.2"/><circle cx="18" cy="19.5" r="1.2"/></svg>;
}

export function CourseCartProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (Array.isArray(saved)) {
        setIds(Array.from(new Set(saved.filter((id): id is string => typeof id === "string" && catalogue.some((item) => item.id === id)))));
      }
    } catch { /* The cart still works in memory when storage is unavailable. */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(storageKey, JSON.stringify(ids)); } catch { /* In-memory fallback. */ }
  }, [ids, ready]);

  function open() {
    if (dialog.current && !dialog.current.open) dialog.current.showModal();
  }

  function add(id: string) {
    const item = catalogue.find((entry) => entry.id === id);
    if (!ready || !item) return;
    setIds((previous) => previous.includes(id) ? previous : [...previous, id]);
    setAnnouncement(item.name + " — добавлено в корзину");
  }

  function remove(id: string) {
    setIds((previous) => previous.filter((entry) => entry !== id));
    setAnnouncement("Курс удалён из корзины");
  }

  const items = ids.flatMap((id) => catalogue.filter((item) => item.id === id));
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ ids, ready, add, open }}>
      {children}
      <button type="button" className="course-cart-trigger" aria-label={"Корзина, курсов: " + items.length} aria-haspopup="dialog" onClick={open}>
        <CartIcon />
        {items.length > 0 && <span className="course-cart-badge" aria-hidden="true">{items.length}</span>}
      </button>
      <span className="course-cart-sr" role="status" aria-live="polite">{announcement}</span>
      <dialog className="course-cart-dialog" ref={dialog} aria-labelledby="course-cart-title" onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className="course-cart-panel">
          <div className="course-cart-heading">
            <h2 id="course-cart-title">Корзина</h2>
            <button type="button" className="course-cart-close" aria-label="Закрыть корзину" onClick={() => dialog.current?.close()}><svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
          </div>
          {items.length === 0 ? <p className="course-cart-empty">Выберите курсы — они появятся здесь.</p> : (
            <ul className="course-cart-list">
              {items.map((item) => (
                <li className="course-cart-item" key={item.id}>
                  <div><h3>{item.name}</h3><p>{money(item.price)}</p></div>
                  <button className="course-cart-remove" type="button" aria-label={"Удалить " + item.name} onClick={() => remove(item.id)}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
                </li>
              ))}
            </ul>
          )}
          <div className="course-cart-total" aria-live="polite"><span>Итого</span><strong>{money(total)}</strong></div>
          <button type="button" className="course-cart-continue" onClick={() => dialog.current?.close()}>Продолжить выбор</button>
        </div>
      </dialog>
    </CartContext.Provider>
  );
}

export function AddCourseButton({ courseId, className }: { courseId: string; className?: string }) {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("CourseCartProvider is required");
  const selected = cart.ids.includes(courseId);
  const name = catalogue.find((item) => item.id === courseId)?.name || "курс";
  return <button type="button" className={(className || "") + " course-cart-add"} disabled={!cart.ready} aria-label={(selected ? "Открыть корзину: " : "Добавить в корзину: ") + name} data-selected={selected} onClick={() => selected ? cart.open() : cart.add(courseId)}>{selected ? "В корзине ✓" : "Выбрать курс"}</button>;
}
