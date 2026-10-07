import { Link } from 'react-router-dom';
import type { GuideAnnotation } from '../../types';
import { GuideTooltip } from './GuideTooltip';

interface GuideAnnotationNavigatorProps {
  artworkId: string;
  activeAnnotation?: GuideAnnotation;
  currentIndex: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

/**
 * 漫游页导览标注条：当前作品的多条标注按序号排成一条，
 * 可翻上一条 / 下一条，并标出"第几条 / 共几条"。
 */
export function GuideAnnotationNavigator({
  artworkId,
  activeAnnotation,
  currentIndex,
  total,
  isFirst,
  isLast,
  onPrevious,
  onNext,
}: GuideAnnotationNavigatorProps) {
  if (total === 0 || !activeAnnotation) {
    return <div className="panel p-4 text-sm text-[var(--color-muted)]">这件作品暂无导览标注。</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">
          导览标注 第 {currentIndex + 1} 条 / 共 {total} 条
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            className="focus-ring border border-[var(--color-line)] px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            onClick={onPrevious}
            disabled={isFirst}
          >
            上一条
          </button>
          <button
            type="button"
            className="focus-ring border border-[var(--color-line)] px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            onClick={onNext}
            disabled={isLast}
          >
            下一条
          </button>
        </div>
      </div>
      <GuideTooltip annotation={activeAnnotation} displayOrder={currentIndex + 1} active />
      <p className="text-xs leading-5 text-[var(--color-muted)]">
        标注按序号排列。漫游页与作品详情页同步：此处翻到第几条，
        <Link className="text-[var(--color-accent)] underline" to={`/artwork/${artworkId}`}>
          作品详情页
        </Link>
        就显示同一条；在详情页点选标注也会同步回漫游。
      </p>
    </div>
  );
}
