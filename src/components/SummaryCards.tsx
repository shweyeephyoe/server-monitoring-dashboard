import type { StatusCounts } from '../utils/status';

interface SummaryCardsProps {
  counts: StatusCounts;
}

/** Four headline numbers across the top of the dashboard. */
export function SummaryCards({ counts }: SummaryCardsProps) {
  const cards = [
    { key: 'total', label: 'Total servers', value: counts.total, hint: 'Monitored (simulated)' },
    { key: 'healthy', label: 'Healthy', value: counts.healthy, hint: 'CPU & memory below 75%' },
    { key: 'warning', label: 'Warning', value: counts.warning, hint: 'CPU or memory 75–89%' },
    { key: 'critical', label: 'Critical', value: counts.critical, hint: 'CPU or memory 90%+' },
  ];

  return (
    <section aria-label="Server summary" className="summary-cards">
      {cards.map((card) => (
        <article key={card.key} className={`summary-card summary-card--${card.key}`}>
          <h2 className="summary-card__label">{card.label}</h2>
          <p className="summary-card__value" data-testid={`summary-${card.key}`}>
            {card.value}
          </p>
          <p className="summary-card__hint">{card.hint}</p>
        </article>
      ))}
    </section>
  );
}
