import React, { useCallback, useEffect, useRef } from 'react';
import { GripVertical } from 'lucide-react';

export default function ResizeHandle({ onResize }) {
  const dragging = useRef(false);
  const handleRef = useRef(null);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragging.current) return;
      onResize(e.clientX);
    };

    const onMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onResize]);

  return (
    <div
      ref={handleRef}
      onMouseDown={onMouseDown}
      className="w-1.5 cursor-col-resize bg-surface0 hover:bg-accent2/20 active:bg-accent2/35 transition-colors flex items-center justify-center group flex-shrink-0"
    >
      <GripVertical
        size={12}
        className="text-t4 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
}
