import { useEffect } from 'react';
import { useGuideStore } from '../stores/guideStore';
import { getAnnotationsByArtwork } from '../utils/guide';

/**
 * 某件作品的导览标注视图模型，漫游页与作品详情页共用：
 * - 标注始终按自身序号（order）升序；
 * - 走到另一件作品时自动落到该作品的第一条（同一件作品不打断浏览位置）；
 * - activeAnnotation / currentIndex 即全局当前标注，两处页面看到的永远是同一条。
 */
export function useArtworkAnnotations(artworkId?: string, options: { autoFocus?: boolean } = {}) {
  const { autoFocus = true } = options;
  const annotations = useGuideStore((state) => state.annotations);
  const guidedArtworkId = useGuideStore((state) => state.guidedArtworkId);
  const activeAnnotationId = useGuideStore((state) => state.activeAnnotationId);
  const focusArtwork = useGuideStore((state) => state.focusArtwork);
  const setActiveAnnotation = useGuideStore((state) => state.setActiveAnnotation);
  const showPreviousAnnotation = useGuideStore((state) => state.showPreviousAnnotation);
  const showNextAnnotation = useGuideStore((state) => state.showNextAnnotation);

  const ordered = artworkId ? getAnnotationsByArtwork(annotations, artworkId) : [];
  const isGuided = Boolean(artworkId && guidedArtworkId === artworkId);
  // 只有当前作品就是全局导览中的作品时，其"当前标注"才以全局状态为准；
  // 否则（例如直接打开另一件作品的详情页）默认落在第一条。
  const activeAnnotation =
    ordered.find((item) => item.id === activeAnnotationId && isGuided) ?? ordered[0];
  const currentIndex = activeAnnotation ? ordered.findIndex((item) => item.id === activeAnnotation.id) : -1;

  // 走到另一件作品时落到那件作品的第一条；同一件作品（含从漫游进入其详情页）保持当前位置。
  useEffect(() => {
    if (!autoFocus || !artworkId || artworkId === guidedArtworkId) return;
    focusArtwork(artworkId);
  }, [autoFocus, artworkId, guidedArtworkId, focusArtwork]);

  return {
    annotations: ordered,
    activeAnnotation,
    activeAnnotationId: activeAnnotation?.id,
    currentIndex,
    total: ordered.length,
    isFirst: currentIndex <= 0,
    isLast: currentIndex === -1 || currentIndex === ordered.length - 1,
    selectAnnotation: setActiveAnnotation,
    showPrevious: showPreviousAnnotation,
    showNext: showNextAnnotation,
  };
}
