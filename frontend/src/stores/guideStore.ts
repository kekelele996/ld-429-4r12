import { create } from 'zustand';
import type { GuideAnnotation } from '../types';
import { annotations } from '../api/mockGallery';
import { getAnnotationsByArtwork } from '../utils/guide';

interface GuideState {
  annotations: GuideAnnotation[];
  /** 当前正在导览的作品；切换到另一件作品时落到该作品的第一条标注。 */
  guidedArtworkId?: string;
  /** 当前正在查看的标注（漫游页与作品详情页共用，两处看到的是同一条）。 */
  activeAnnotationId?: string;
  /** 切换导览作品：每次都落到该作品按序号排列后的第一条；作品没有标注则清空。 */
  focusArtwork: (artworkId?: string) => void;
  /** 直接选中某条标注（详情页点击列表时使用）。 */
  setActiveAnnotation: (id?: string) => void;
  /** 翻到该作品的上一条标注，已在第一条时停住不动。 */
  showPreviousAnnotation: () => void;
  /** 翻到该作品的下一条标注，已在最后一条时停住不动。 */
  showNextAnnotation: () => void;
}

export const useGuideStore = create<GuideState>((set, get) => ({
  annotations,
  guidedArtworkId: undefined,
  activeAnnotationId: undefined,
  focusArtwork: (artworkId) =>
    set(() => {
      if (!artworkId) return { guidedArtworkId: undefined, activeAnnotationId: undefined };
      const first = getAnnotationsByArtwork(get().annotations, artworkId)[0];
      return { guidedArtworkId: artworkId, activeAnnotationId: first?.id };
    }),
  setActiveAnnotation: (id) => set({ activeAnnotationId: id }),
  showPreviousAnnotation: () => {
    const { guidedArtworkId, activeAnnotationId, annotations: all } = get();
    if (!guidedArtworkId) return;
    const ordered = getAnnotationsByArtwork(all, guidedArtworkId);
    const index = ordered.findIndex((item) => item.id === activeAnnotationId);
    if (index > 0) set({ activeAnnotationId: ordered[index - 1].id });
  },
  showNextAnnotation: () => {
    const { guidedArtworkId, activeAnnotationId, annotations: all } = get();
    if (!guidedArtworkId) return;
    const ordered = getAnnotationsByArtwork(all, guidedArtworkId);
    const index = ordered.findIndex((item) => item.id === activeAnnotationId);
    if (index >= 0 && index < ordered.length - 1) set({ activeAnnotationId: ordered[index + 1].id });
  },
}));
