'use client';

import { useState } from 'react';

export default function LeadForm({ selectedPlan }: { selectedPlan: string | null }) {
  const [contactType, setContactType] = useState<'Telegram' | 'Телефон'>('Telegram');
  const [sent, setSent] = useState(false);

  return (
    <form className="lead-form glass-card" onSubmit={e => { e.preventDefault(); setSent(true); }}>
      <input type="hidden" name="plan" value={selectedPlan ?? ''} />
      <label>Имя<input required name="name" placeholder="Как к вам обращаться" /></label>
      <div className="contact-switch" role="group" aria-label="Способ связи">
        {(['Telegram', 'Телефон'] as const).map(type => <button type="button" key={type} className={contactType === type ? 'is-active' : ''} onClick={() => setContactType(type)}>{type}</button>)}
      </div>
      <label>{contactType}<input required name="contact" placeholder={contactType === 'Telegram' ? '@username' : '+7 ...'} /></label>
      <label>Ваш вопрос · необязательно<textarea name="question" placeholder="Что хотите узнать об обучении?" rows={4} /></label>
      {selectedPlan && <div className="selected-plan">Выбран тариф: <strong>{selectedPlan}</strong></div>}
      <button className="form-submit" type="submit">Помогите выбрать программу →</button>
      {sent && <p className="form-success">Форма подготовлена. Подключите обработчик отправки к вашей CRM/API.</p>}
    </form>
  );
}
