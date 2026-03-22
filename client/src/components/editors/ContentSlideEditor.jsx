import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { resolveUploadPath } from '../../lib/apiBase';

const SLIDE_WIDTH = 960;
const SLIDE_HEIGHT = 540;
const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 270;

function parseWidthToPt(width, fallback = 230) {
  const raw = (width || '').toString().trim();
  if (!raw) return fallback;

  const textWidthMatch = raw.match(/^([0-9]*\.?[0-9]+)\\textwidth$/);
  if (textWidthMatch) return Math.round(Number(textWidthMatch[1]) * 640);

  const ptMatch = raw.match(/^([0-9]*\.?[0-9]+)pt$/);
  if (ptMatch) return Math.round(Number(ptMatch[1]));

  const cmMatch = raw.match(/^([0-9]*\.?[0-9]+)cm$/);
  if (cmMatch) return Math.round(Number(cmMatch[1]) * 28.3465);

  return fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function resolveImagePreviewPath(path) {
  if (!path) return '';
  return resolveUploadPath(path);
}

function ImagePlacementEditor({ slideId, imageIndex, image, onImageChange }) {
  const canvasRef = useRef(null);
  const [ratio, setRatio] = useState(Number(image.aspectRatio) > 0 ? Number(image.aspectRatio) : 0.65);
  const [dragState, setDragState] = useState(null);

  const widthPt = parseWidthToPt(image.width, 230);
  const xPt = Number.isFinite(Number(image.x)) ? Number(image.x) : 560;
  const yPt = Number.isFinite(Number(image.y)) ? Number(image.y) : 250;

  const widthPx = (widthPt / SLIDE_WIDTH) * CANVAS_WIDTH;
  const heightPx = widthPx * ratio;
  const leftPx = (xPt / SLIDE_WIDTH) * CANVAS_WIDTH;
  const topPx = (yPt / SLIDE_HEIGHT) * CANVAS_HEIGHT;

  const imageSrc = resolveImagePreviewPath(image.path);

  useEffect(() => {
    if (Number(image.aspectRatio) > 0) {
      setRatio(Number(image.aspectRatio));
    }
  }, [image.aspectRatio]);

  useEffect(() => {
    if (!dragState) return undefined;

    const onMove = (event) => {
      if (!canvasRef.current) return;
      const dx = event.clientX - dragState.startX;
      const dy = event.clientY - dragState.startY;

      if (dragState.mode === 'move') {
        const nextLeftPx = clamp(dragState.startLeftPx + dx, 0, CANVAS_WIDTH - dragState.boxWidthPx);
        const nextTopPx = clamp(dragState.startTopPx + dy, 0, CANVAS_HEIGHT - dragState.boxHeightPx);
        const nextXPt = Math.round((nextLeftPx / CANVAS_WIDTH) * SLIDE_WIDTH);
        const nextYPt = Math.round((nextTopPx / CANVAS_HEIGHT) * SLIDE_HEIGHT);
        onImageChange(slideId, imageIndex, 'x', nextXPt);
        onImageChange(slideId, imageIndex, 'y', nextYPt);
        return;
      }

      const nextWidthPx = clamp(dragState.startWidthPx + dx, 28, CANVAS_WIDTH - dragState.startLeftPx);
      const nextWidthPt = Math.round((nextWidthPx / CANVAS_WIDTH) * SLIDE_WIDTH);
      onImageChange(slideId, imageIndex, 'width', `${nextWidthPt}pt`);
    };

    const onUp = () => setDragState(null);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragState, imageIndex, onImageChange, slideId]);

  return (
    <div className="space-y-2">
      <div className="text-[10px] text-t4">Drag image to move. Drag corner handle to resize.</div>
      <div
        ref={canvasRef}
        className="relative rounded-lg border border-border/40 bg-surface0 overflow-hidden"
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(to right, #ffffff22 1px, transparent 1px), linear-gradient(to bottom, #ffffff22 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div
          className="absolute border border-accent2/70 shadow-[0_0_0_1px_rgba(120,170,255,0.25)] cursor-move"
          style={{ left: leftPx, top: topPx, width: widthPx, height: heightPx, minWidth: 28, background: '#0d0d0f' }}
          onMouseDown={(event) => {
            event.preventDefault();
            setDragState({
              mode: 'move',
              startX: event.clientX,
              startY: event.clientY,
              startLeftPx: leftPx,
              startTopPx: topPx,
                boxWidthPx: widthPx,
                boxHeightPx: heightPx,
            });
          }}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="slide"
              className="w-full h-full object-contain pointer-events-none"
              draggable={false}
              onLoad={(event) => {
                const el = event.currentTarget;
                if (el.naturalWidth > 0 && el.naturalHeight > 0) {
                  const nextRatio = Number((el.naturalHeight / el.naturalWidth).toFixed(5));
                  setRatio(nextRatio);
                  if (!(Number(image.aspectRatio) > 0) || Math.abs(Number(image.aspectRatio) - nextRatio) > 0.00001) {
                    onImageChange(slideId, imageIndex, 'aspectRatio', nextRatio);
                  }
                }
              }}
              onError={() => setRatio(0.65)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-t4 px-2 text-center">Upload image to place it</div>
          )}

          <div
            className="absolute -right-1.5 -bottom-1.5 w-3 h-3 rounded-sm bg-accent2 cursor-se-resize"
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setDragState({
                mode: 'resize',
                startX: event.clientX,
                startY: event.clientY,
                startLeftPx: leftPx,
                startWidthPx: widthPx,
              });
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-[10px] text-t4">
        <div>X: {Math.round(xPt)} pt</div>
        <div>Y: {Math.round(yPt)} pt</div>
        <div>W: {Math.round(widthPt)} pt</div>
      </div>
    </div>
  );
}

export default function ContentSlideEditor({
  slides,
  onSlideChange,
  onAddSlide,
  onRemoveSlide,
  onAddImage,
  onImageChange,
  onRemoveImage,
  uploadingImage,
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="bg-surface3 text-t3 text-xs font-mono px-2 py-1 rounded">
            {slides.length} slides
          </span>
          <h2 className="text-3xl font-light text-t1 tracking-tight">Content Slides</h2>
        </div>
        <button
          type="button"
          onClick={onAddSlide}
          className="flex items-center gap-1.5 text-sm text-t3 border border-dashed border-border2 rounded-lg px-3 py-2 hover:border-accent2/50 hover:text-accent2 transition-colors"
        >
          <Plus size={13} />
          Add Slide
        </button>
      </div>

      {slides.map((slide, idx) => (
        <div key={slide.id} className="bg-surface2 rounded-xl p-5 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-surface3 text-t3 text-xs font-mono px-2 py-1 rounded flex-shrink-0">
              {idx + 2}
            </span>
            <input
              type="text"
              value={slide.title}
              onChange={(e) => onSlideChange(slide.id, 'title', e.target.value)}
              data-field-label={`slide[${idx}].title`}
              placeholder="Slide Title"
              className="flex-1 bg-transparent border-none text-base text-t1 font-medium focus:outline-none placeholder:text-t4"
            />
            <button
              type="button"
              onClick={() => onRemoveSlide(slide.id)}
              className="w-7 h-7 rounded flex items-center justify-center text-t4 hover:text-error hover:bg-error/10 transition-colors opacity-0 group-hover:opacity-100"
              style={{ opacity: 1 }}
            >
              <Trash2 size={14} />
            </button>
          </div>

          <label className="text-[10px] font-semibold tracking-[0.1em] uppercase text-t3 mb-1.5 block">
            Content
          </label>
          <textarea
            rows={8}
            value={slide.content}
            onChange={(e) => onSlideChange(slide.id, 'content', e.target.value)}
            data-field-label={`slide[${idx}].content`}
            placeholder="One line per bullet point"
            className="w-full bg-surface0 border border-border/40 rounded-lg px-4 py-3 text-sm text-t1 font-mono focus:border-accent2/60 placeholder:text-t4 resize-y"
          />
          <p className="text-[10px] text-t4 mt-1">One line per bullet point</p>

          <div className="mt-4 pt-3 border-t border-border/40 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-semibold tracking-[0.1em] uppercase text-t3 block">
                Images
              </label>
              <button
                type="button"
                onClick={() => onAddImage(slide.id)}
                className="flex items-center gap-1 text-xs text-t3 border border-dashed border-border2 rounded-md px-2 py-1 hover:border-accent2/50 hover:text-accent2 transition-colors"
              >
                <Plus size={12} />
                Add Image
              </button>
            </div>

            {(slide.images || []).map((img, imgIdx) => (
              <div key={img.id || imgIdx} className="bg-surface3/50 border border-border/30 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        onImageChange(slide.id, imgIdx, 'upload', file);
                      }
                    }}
                    className="flex-1 text-xs text-t2"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(slide.id, imgIdx)}
                    className="w-7 h-7 rounded flex items-center justify-center text-t4 hover:text-error hover:bg-error/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={img.width || ''}
                    onChange={(e) => onImageChange(slide.id, imgIdx, 'width', e.target.value)}
                    placeholder="0.5\\textwidth"
                    className="bg-surface0 border border-border/40 rounded-lg px-2 py-1.5 text-xs text-t1 focus:border-accent2/60 placeholder:text-t4"
                  />
                  <select
                    value={img.position || 'center'}
                    onChange={(e) => onImageChange(slide.id, imgIdx, 'position', e.target.value)}
                    className="bg-surface0 border border-border/40 rounded-lg px-2 py-1.5 text-xs text-t1 focus:border-accent2/60"
                  >
                    <option value="left">left</option>
                    <option value="center">center</option>
                    <option value="right">right</option>
                  </select>
                </div>

                <ImagePlacementEditor
                  slideId={slide.id}
                  imageIndex={imgIdx}
                  image={img}
                  onImageChange={onImageChange}
                />

                {img.path && (
                  <p className="text-[10px] text-t4 truncate">{img.path}</p>
                )}
              </div>
            ))}

            {uploadingImage && (
              <p className="text-[10px] text-t4">Uploading image...</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
