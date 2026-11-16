'use client';

import { useState } from 'react';
import { plans } from '@/lib/data';
import ProgramModal from './ProgramModal';

export default function Pricing({ onSelect }: { onSelect: (plan: string) => void }) {
  const [modalPlan, setModalPlan] = useState<string | null>(null);
  return (
    <>
      <div className="pricing-grid">
        {plans.map(plan => (
          <article className={`price-card glass-card ${plan.featured ? 'is-featured' : ''}`} key={plan.name}>
            <div>
              <span className="plan-name">{plan.name}</span>
              <div className="plan-price">{plan.price}</div>
              <div className="plan-volume">{plan.volume}</div>
              <p>{plan.descriptor}</p>
            </div>
            <div className="plan-actions">
              <button onClick={() => setModalPlan(plan.name)}>Посмотреть содержание</button>
              <button className="plan-primary" onClick={() => onSelect(plan.name)}>Выбрать курс →</button>
            </div>
          </article>
        ))}
      </div>
      <ProgramModal plan={modalPlan} onClose={() => setModalPlan(null)} onSelect={plan => { setModalPlan(null); onSelect(plan); }} />
    </>
  );
}
