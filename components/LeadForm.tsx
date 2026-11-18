'use client';

import { FormEvent, useState } from 'react';

const CRM_WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbz4qg1dis7t401Kf9boaEqT0FOYxaEm9s3mPNyQHN9x0FdPCzaT0aNiH6Ov-BtsSm3emA/exec';

export default function LeadForm({ selectedPlan }: { selectedPlan: string | null }) {
  const [contactType, setContactType] = useState<'Telegram' | 'Телефон'>('Telegram');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    setSent(false);
    setError(false);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = new URLSearchParams();

    payload.set('name', String(data.get('name') ?? ''));
    payload.set('contact', String(data.get('contact') ?? ''));
    payload.set('contactType', contactType);
    payload.set('question', String(data.get('question') ?? ''));
    payload.set('plan', String(data.get('plan') ?? ''));
    payload.set('source', 'multum.ai');
    payload.set('page', window.location.href);
    payload.set('createdAt', new Date().toISOString());

    try {
      await fetch(CRM_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: payload.toString(),
      });

      setSent(true);
      form.reset();
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="lead-form glass-card" onSubmit={handleSubmit}>
      <input type="hidden" name="plan" value={selectedPlan ?? ''} />
      <label>Имя<input required name="name" placeholder="Как к вам обращаться" /></label>
      <div className="contact-switch" role="group" aria-label="Способ связи">
        {(['Telegram', 'Телефон'] as const).map(type => <button type="button" key={type} className={contactType === type ? 'is-active' : ''} onClick={() => setContactType(type)}>{type}</button>)}
      </div>
      <label>{contactType}<input required name="contact" placeholder={contactType === 'Telegram' ? '@username' : '+7 ...'} /></label>
      <label>Ваш вопрос · необязательно<textarea name="question" placeholder="Что хотите узнать об обучении?" rows={4} /></label>
      {selectedPlan && <div className="selected-plan">Выбран тариф: <strong>{selectedPlan}</strong></div>}
      <button className="form-submit" type="submit" disabled={sending}>
        {sending ? 'Отправляем…' : 'Помогите выбрать программу →'}
      </button>
      {sent && (
        <p className="form-success">
          Заявка отправлена. Мы свяжемся с вами в ближайшее время.
        </p>
      )}
      {error && (
        <p className="form-success">
          Не удалось отправить заявку. Попробуйте ещё раз.
        </p>
      )}
    </form>
  );
}
