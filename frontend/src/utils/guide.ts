import type { GuideAnnotation } from '../types';

/**
 * 按标注自身的序号（order）升序排列；序号相同时以 id 兜底，保证排序稳定。
 * 漫游页翻看与详情页列表统一走这一个口径，避免两处顺序不一致。
 */
export function sortAnnotationsByOrder(annotations: GuideAnnotation[]): GuideAnnotation[] {
  return [...annotations].sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

/** 取出某件作品的全部标注，并按序号排好序。 */
export function getAnnotationsByArtwork(annotations: GuideAnnotation[], artworkId: string): GuideAnnotation[] {
  return sortAnnotationsByOrder(annotations.filter((annotation) => annotation.artworkId === artworkId));
}
