import type { GuideAnnotation } from '../../types';

export function GuideTooltip({ annotation, active = false }: { annotation: GuideAnnotation; active?: boolean }) {
  return (
    <div
      className={`panel max-w-sm border-l-4 border-l-vermilion p-4 ${
        active ? 'ring-2 ring-[var(--color-accent)]' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">Guide {annotation.order}</p>
        {active ? (
          <span className="border border-[var(--color-accent)] px-2 py-0.5 text-xs text-[var(--color-accent)]">当前</span>
        ) : null}
      </div>
      <h4 className="mt-1 text-lg font-semibold">{annotation.title}</h4>
      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{annotation.description}</p>
    </div>
  );
}
