import type { GuideAnnotation } from '../../types';

interface GuideTooltipProps {
  annotation: GuideAnnotation;
  /** 在同作品所有标注中的序号位置（从 1 开始），用于显示"第几条"。 */
  displayOrder?: number;
  /** 是否为当前正在查看的标注：高亮边框，并附带"当前标注"字样。 */
  active?: boolean;
  /** 传入后整条标注可点击，点击即把它设为当前标注（详情页列表使用）。 */
  onSelect?: (annotation: GuideAnnotation) => void;
}

export function GuideTooltip({ annotation, displayOrder, active = false, onSelect }: GuideTooltipProps) {
  const orderLabel = displayOrder ?? annotation.order;
  const className = `panel max-w-sm border-l-4 p-4 ${
    active ? 'border-l-vermilion ring-2 ring-vermilion/40' : 'border-l-[var(--color-line)]'
  } ${onSelect ? 'cursor-pointer transition hover:border-l-vermilion' : ''}`;
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
          标注 {orderLabel}
        </p>
        {active && <span className="text-xs text-[var(--color-accent)]">当前标注</span>}
      </div>
      <h4 className="mt-1 text-lg font-semibold">{annotation.title}</h4>
      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{annotation.description}</p>
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        className={`${className} block w-full text-left focus-ring`}
        aria-pressed={active}
        onClick={() => onSelect(annotation)}
      >
        {body}
      </button>
    );
  }

  return <div className={className}>{body}</div>;
}
