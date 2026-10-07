import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArtworkInfoCard } from '../components/common/ArtworkInfoCard';
import { GuideTooltip } from '../components/common/GuideTooltip';
import { EmptyState } from '../components/common/EmptyState';
import { useArtworkStore } from '../stores/artworkStore';
import { useArtworkAnnotations } from '../hooks/useArtworkAnnotations';
import { useVisitorTracking } from '../hooks/useVisitorTracking';

export function ArtworkDetail() {
  const { id } = useParams();
  const [scale, setScale] = useState(1);
  const artworks = useArtworkStore((state) => state.artworks);
  const artwork = useMemo(() => artworks.find((item) => item.id === id), [artworks, id]);
  const {
    annotations,
    activeAnnotationId,
    currentIndex,
    total,
    selectAnnotation,
  } = useArtworkAnnotations(artwork?.id);
  useVisitorTracking(artwork?.id);

  if (!artwork) {
    return <EmptyState title="未找到作品" description="当前作品可能已经移出展览，返回展览列表继续浏览。" />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="panel overflow-hidden p-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-4xl font-semibold">{artwork.title}</h1>
          <label className="text-sm text-[var(--color-muted)]">
            缩放
            <input className="ml-3 align-middle" type="range" min="0.8" max="1.8" step="0.1" value={scale} onChange={(event) => setScale(Number(event.target.value))} />
          </label>
        </div>
        <div className="grid min-h-[58vh] place-items-center overflow-auto bg-[#211f1a] p-8">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="max-h-[70vh] max-w-full border-[10px] border-[#f4efe6] object-contain shadow-2xl transition-transform"
            style={{ transform: `scale(${scale})` }}
          />
        </div>
      </section>
      <aside className="space-y-4">
        <ArtworkInfoCard artwork={artwork} />
        <div className="space-y-3">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-semibold">导览标注</h2>
            {total > 0 && (
              <span className="text-sm text-[var(--color-muted)]">
                当前第 {currentIndex + 1} 条 / 共 {total} 条
              </span>
            )}
          </div>
          <p className="text-xs leading-5 text-[var(--color-muted)]">
            标注列表按标注自身的序号排列。本页与 3D 漫游页共用同一当前标注：漫游中翻到第几条，
            本页就高亮同一条；在此点选任意标注，回到漫游时也停在该条。
          </p>
          {annotations.length === 0 ? (
            <p className="panel p-4 text-sm text-[var(--color-muted)]">这件作品暂无导览标注。</p>
          ) : (
            annotations.map((annotation, index) => (
              <GuideTooltip
                key={annotation.id}
                annotation={annotation}
                displayOrder={index + 1}
                active={annotation.id === activeAnnotationId}
                onSelect={(item) => selectAnnotation(item.id)}
              />
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
