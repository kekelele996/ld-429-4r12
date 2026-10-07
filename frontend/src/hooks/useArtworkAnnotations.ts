import { useEffect, useMemo } from 'react';
import type { GuideAnnotation } from '../types';
import { useGuideStore } from '../stores/guideStore';

export interface ArtworkAnnotations {
  /** 当前作品的标注，按 order 升序 */
  annotations: GuideAnnotation[];
  /** 当前标注（漫游页与详情页共用同一条） */
  current?: GuideAnnotation;
  /** 当前下标（0 起），无标注时为 -1 */
  currentIndex: number;
  total: number;
  hasPrev: boolean;
  hasNext: boolean;
  goPrev: () => void;
  goNext: () => void;
  select: (annotationId: string) => void;
}

/**
 * 某件作品的导览标注序列：按 order 排序，并维护"当前标注"。
 * 当前标注存于 guideStore.activeAnnotationId，漫游页与详情页读写同一份，
 * 因此两处永远显示同一条；切换到另一件作品时自动落到该作品的第一条。
 */
export const useArtworkAnnotations = (artworkId?: string): ArtworkAnnotations => {
  const all = useGuideStore((state) => state.annotations);
  const activeAnnotationId = useGuideStore((state) => state.activeAnnotationId);
  const setActiveAnnotation = useGuideStore((state) => state.setActiveAnnotation);

  const annotations = useMemo(
    () => all.filter((item) => item.artworkId === artworkId).sort((a, b) => a.order - b.order),
    [all, artworkId],
  );

  // 换了一件作品（或当前标注不属于该作品）时，落到该作品的第一条
  useEffect(() => {
    if (annotations.length === 0) return;
    if (!activeAnnotationId || !annotations.some((item) => item.id === activeAnnotationId)) {
      setActiveAnnotation(annotations[0].id);
    }
  }, [annotations, activeAnnotationId, setActiveAnnotation]);

  const foundIndex = annotations.findIndex((item) => item.id === activeAnnotationId);
  const currentIndex = annotations.length === 0 ? -1 : Math.max(0, foundIndex);
  const current = currentIndex >= 0 ? annotations[currentIndex] : undefined;

  return {
    annotations,
    current,
    currentIndex,
    total: annotations.length,
    hasPrev: currentIndex > 0,
    hasNext: currentIndex >= 0 && currentIndex < annotations.length - 1,
    goPrev: () => {
      if (currentIndex > 0) setActiveAnnotation(annotations[currentIndex - 1].id);
    },
    goNext: () => {
      if (currentIndex >= 0 && currentIndex < annotations.length - 1) {
        setActiveAnnotation(annotations[currentIndex + 1].id);
      }
    },
    select: (annotationId) => {
      if (annotations.some((item) => item.id === annotationId)) setActiveAnnotation(annotationId);
    },
  };
};
