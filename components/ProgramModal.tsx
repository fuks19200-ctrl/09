'use client';

import { programDetails } from '@/lib/data';

type Props = { plan: string | null; onClose: () => void; onSelect: (plan: string) => void };

export default function ProgramModal({ plan, onClose, onSelect }: Props) {
  if (!plan) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`Содержание ${plan}`} onMouseDown={onClose}>
      <div className="program-modal glass-card" onMouseDown={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Закрыть">×</button>
        <span className="eyebrow">ПРОГРАММА · {plan}</span>
        <h2>{plan}</h2>
        <div className="program-list">
          {programDetails[plan]?.map(item => <div key={item}>{item}</div>)}
        </div>
        <p>Детали программы показываются только в рамках утверждённых параметров тарифа.</p>
        <button className="modal-select" onClick={() => onSelect(plan)}>Выбрать курс →</button>
      </div>
    </div>
  );
}
