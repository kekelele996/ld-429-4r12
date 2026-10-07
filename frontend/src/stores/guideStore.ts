import { create } from 'zustand';
import type { GuideAnnotation } from '../types';
import { annotations } from '../api/mockGallery';

interface GuideState {
  annotations: GuideAnnotation[];
  activeAnnotationId?: string;
  setActiveAnnotation: (id?: string) => void;
}

export const useGuideStore = create<GuideState>((set) => ({
  annotations,
  // 初始为空：由 useArtworkAnnotations 按当前作品落到其第一条标注
  activeAnnotationId: undefined,
  setActiveAnnotation: (id) => set({ activeAnnotationId: id }),
}));
