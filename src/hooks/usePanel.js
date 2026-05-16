import React, { useState, useCallback, useRef } from 'react';

export function useDraggable(initialPos = { x: 100, y: 100 }, enabled = false) {
  const [pos, setPos] = useState(initialPos);

  const onMouseDown = useCallback((e) => {
    if (!enabled) return;
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select') || e.target.closest('textarea')) return;

    const startX = e.clientX - pos.x;
    const startY = e.clientY - pos.y;

    const onMouseMove = (moveEvent) => {
      setPos({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY,
      });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [enabled, pos]);

  return { pos, onMouseDown, setPos };
}

export function useResizable(initialSize = { w: 380, h: 600 }, panelPos = 'right') {
  const [size, setSize] = useState(initialSize);

  const startResizing = useCallback((e, direction) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = size.w;
    const startH = size.h;

    const onMouseMove = (moveEvent) => {
      let newW = startW;
      let newH = startH;

      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      if (panelPos === 'right') {
          newW = startW - deltaX;
      } else if (panelPos === 'left') {
          newW = startW + deltaX;
      } else if (panelPos === 'top') {
          newH = startH + deltaY;
      } else if (panelPos === 'bottom') {
          newH = startH - deltaY;
      } else if (panelPos === 'floating') {
          if (direction.includes('e')) newW = startW + deltaX;
          if (direction.includes('w')) newW = startW - deltaX;
          if (direction.includes('s')) newH = startH + deltaY;
          if (direction.includes('n')) newH = startH - deltaY;
      }

      setSize({
        w: Math.max(250, newW),
        h: Math.max(100, newH)
      });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [size, panelPos]);

  return { size, startResizing, setSize };
}
