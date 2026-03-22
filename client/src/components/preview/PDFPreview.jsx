import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { FileText } from 'lucide-react';
import CompileStatus from './CompileStatus';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

export default function PDFPreview({
  pdfData,
  compiling,
  compileError,
  lastSuccess,
  compileTime,
  mode,
}) {
  const containerRef = useRef(null);
  const canvasRefs = useRef([]);
  const renderTasksRef = useRef(new Map());
  const renderCycleRef = useRef(0);
  const resizeRafRef = useRef(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState(null);

  const cancelAllRenderTasks = useCallback(() => {
    renderTasksRef.current.forEach((task) => {
      try {
        task.cancel();
      } catch {
        // Ignore cancellation errors.
      }
    });
    renderTasksRef.current.clear();
  }, []);

  // Load PDF document
  useEffect(() => {
    if (!pdfData) {
      setPdfDoc(null);
      setTotalPages(0);
      cancelAllRenderTasks();
      return;
    }

    let cancelled = false;
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    loadingTask.promise
      .then(pdf => {
        if (!cancelled) {
          setPdfDoc(pdf);
          setTotalPages(pdf.numPages);
        }
      })
      .catch(err => {
        console.error('PDF load error:', err);
      });

    return () => {
      cancelled = true;
      try {
        loadingTask.destroy();
      } catch {
        // Ignore loading task destroy errors.
      }
    };
  }, [pdfData, cancelAllRenderTasks]);

  // Render pages
  const renderPages = useCallback(async () => {
    if (!pdfDoc || !containerRef.current) return;
    const cycleId = ++renderCycleRef.current;
    cancelAllRenderTasks();

    const container = containerRef.current;
    const containerWidth = container.clientWidth - 32;
    if (containerWidth <= 0) return;

    const renderSinglePage = async (pageNum, canvasIndex) => {
      const page = await pdfDoc.getPage(pageNum);
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = containerWidth / baseViewport.width;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRefs.current[canvasIndex];
      if (!canvas) return;
      if (cycleId !== renderCycleRef.current) return;
      
      // Reset canvas completely
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const prevTask = renderTasksRef.current.get(canvasIndex);
      if (prevTask) {
        try {
          prevTask.cancel();
        } catch {
          // Ignore cancellation errors.
        }
      }

      const renderTask = page.render({ canvasContext: ctx, viewport });
      renderTasksRef.current.set(canvasIndex, renderTask);

      try {
        await renderTask.promise;
      } catch (err) {
        if (err?.name !== 'RenderingCancelledException') {
          throw err;
        }
      } finally {
        if (renderTasksRef.current.get(canvasIndex) === renderTask) {
          renderTasksRef.current.delete(canvasIndex);
        }
      }
    };

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      await renderSinglePage(i, i - 1);
    }
  }, [pdfDoc, cancelAllRenderTasks]);

  useEffect(() => {
    renderPages().catch((err) => {
      if (err?.name !== 'RenderingCancelledException') {
        console.error('PDF render error:', err);
      }
    });
  }, [renderPages]);

  // ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (resizeRafRef.current) {
        cancelAnimationFrame(resizeRafRef.current);
      }
      resizeRafRef.current = requestAnimationFrame(() => {
        renderPages().catch((err) => {
          if (err?.name !== 'RenderingCancelledException') {
            console.error('PDF render error:', err);
          }
        });
      });
    });
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      if (resizeRafRef.current) {
        cancelAnimationFrame(resizeRafRef.current);
        resizeRafRef.current = null;
      }
    };
  }, [renderPages]);

  useEffect(() => {
    return () => {
      renderCycleRef.current += 1;
      cancelAllRenderTasks();
    };
  }, [cancelAllRenderTasks]);

  // Helper to generate canvas refs
  const getCanvasCount = () => {
    if (!pdfDoc) return 0;
    return pdfDoc.numPages;
  };

  const canvasCount = getCanvasCount();

  // Ensure refs array is correct size
  if (canvasRefs.current.length !== canvasCount) {
    canvasRefs.current = Array(canvasCount).fill(null);
  }

  return (
    <div className="flex flex-col h-full bg-surface2">
      {/* Header */}
      <div className="h-16 px-6 flex items-center flex-shrink-0">
        <h3 className="text-2xl font-semibold tracking-tight text-t1">Preview</h3>
      </div>

      {/* PDF Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-8"
      >
        {!pdfData && !compiling && (
          <div className="flex items-center justify-center h-full">
            <div className="w-full max-w-[360px] aspect-[4/3] bg-surface0 rounded overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.5)] relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-10">
                <div className="w-14 h-14 rounded-2xl bg-accent2/10 flex items-center justify-center mb-5">
                  <FileText size={22} className="text-accent2" />
                </div>
                <p className="text-sm text-t2 font-medium">PDF preview will appear here</p>
                <p className="text-[10px] text-t4 mt-2">Generating LaTeX rendering for visual verification...</p>
              </div>
              <div className="absolute bottom-8 left-8 right-8 flex justify-between">
                <div className="h-1 w-10 rounded bg-t1/10" />
                <div className="h-1 w-3 rounded bg-t1/10" />
              </div>
            </div>
          </div>
        )}

        {compiling && !pdfData && (
          <div className="flex items-center justify-center h-full">
            <div className="w-full max-w-[360px] aspect-[4/3] bg-surface0 rounded p-8 shadow-[0_20px_45px_rgba(0,0,0,0.5)]">
              <div className="w-full h-4 bg-surface3 rounded animate-pulse mb-3" />
              <div className="w-[82%] h-4 bg-surface3 rounded animate-pulse mb-3" />
              <div className="w-[64%] h-4 bg-surface3 rounded animate-pulse" />
              <p className="text-t3 text-xs mt-5">Compiling preview...</p>
            </div>
          </div>
        )}

        {pdfData && (
          <div className="flex flex-col items-center gap-3">
            {Array.from({ length: canvasCount }, (_, i) => (
              <canvas
                key={i}
                ref={(el) => { canvasRefs.current[i] = el; }}
                className="pdf-canvas rounded bg-white mx-auto"
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-6 pb-6">
        <CompileStatus
          compiling={compiling}
          compileError={compileError}
          lastSuccess={lastSuccess}
          compileTime={compileTime}
        />
      </div>

      {pdfData && totalPages > 1 && (
        <div className="px-6 pb-4 text-xs text-t3">Showing all {totalPages} compiled slides</div>
      )}
    </div>
  );
}
