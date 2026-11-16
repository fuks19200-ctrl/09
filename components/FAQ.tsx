'use client';

import { useState } from 'react';
import { faqs } from '@/lib/data';

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return <div className="faq-grid">{faqs.map((faq, i) => <div className={`faq-item glass-card ${open === i ? 'is-open' : ''}`} key={faq.q}><button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}><span>{faq.q}</span><span>{open === i ? '−' : '+'}</span></button><div className="faq-answer"><p>{faq.a}</p></div></div>)}</div>;
}
