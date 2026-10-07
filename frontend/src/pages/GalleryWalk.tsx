import { Link } from 'react-router-dom';
import { ArtworkInfoCard } from '../components/common/ArtworkInfoCard';
import { GuideTooltip } from '../components/common/GuideTooltip';
import { MiniMap } from '../components/common/MiniMap';
import { GalleryScene } from '../components/scene/GalleryScene';
import { useArtworkAnnotations } from '../hooks/useArtworkAnnotations';
import { useFirstPersonController } from '../hooks/useFirstPersonController';
import { useGalleryScene } from '../hooks/useGalleryScene';
import { useVisitorTracking } from '../hooks/useVisitorTracking';
import { useArtworkStore } from '../stores/artworkStore';

export function GalleryWalk() {
  const { room, artworks } = useGalleryScene();
  const activeArtworkId = useArtworkStore((state) => state.activeArtworkId);
  const activeArtwork = useArtworkStore((state) => state.artworks.find((artwork) => artwork.id === activeArtworkId));
  const guide = useArtworkAnnotations(activeArtworkId);
  const { hintVisible, velocity } = useFirstPersonController();
  useVisitorTracking(activeArtworkId);

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
      <section className="relative min-h-[70vh] overflow-hidden border border-[var(--color-line)] bg-black">
        <GalleryScene />
        <div className="pointer-events-none absolute left-4 top-4 border border-white/30 bg-black/50 px-3 py-2 text-sm text-white">
          {hintVisible ? 'WASD / 方向键记录漫游意图，鼠标拖动画面观察展厅' : `移动向量 ${velocity.x}, ${velocity.z}`}
        </div>
      </section>
      <aside className="space-y-4">
        {room && <MiniMap room={room} artworks={artworks} />}
        {activeArtwork ? <ArtworkInfoCard artwork={activeArtwork} /> : null}
        {activeArtwork && guide.total === 0 ? (
          <p className="border border-[var(--color-line)] p-3 text-sm text-[var(--color-muted)]">该作品暂无导览标注。</p>
        ) : null}
        {guide.current ? (
          <div className="space-y-2">
            <GuideTooltip annotation={guide.current} active />
            <div className="flex items-center justify-between border border-[var(--color-line)] px-3 py-2 text-sm">
              <button
                className="focus-ring px-2 py-1 hover:text-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
                onClick={guide.goPrev}
                disabled={!guide.hasPrev}
              >
                ← 上一条
              </button>
              <span className="text-[var(--color-muted)]">
                第 {guide.currentIndex + 1} 条 / 共 {guide.total} 条
              </span>
              <button
                className="focus-ring px-2 py-1 hover:text-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
                onClick={guide.goNext}
                disabled={!guide.hasNext}
              >
                下一条 →
              </button>
            </div>
            <p className="text-xs leading-5 text-[var(--color-muted)]">
              标注按序号排列；当前标注与作品详情页同步，两处始终显示同一条。
            </p>
          </div>
        ) : null}
        <Link className="block border border-[var(--color-line)] p-4 text-center text-sm uppercase tracking-[0.2em] hover:bg-[var(--color-panel)]" to="/editor">
          Open room editor
        </Link>
      </aside>
    </div>
  );
}
