import React, { useState, useCallback, useEffect, useRef } from 'react';

export function useDraggable(initialPos = { x: 100, y: 100 }, enabled = false) {
  const [pos, setPos] = useState(initialPos);
  const dragRef = useRef(null);

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

export function useResizable(initialSize = { w: 380, h: 600 }, pos = 'right') {
  const [size, setSize] = useState(initialSize);

  const startResizing = useCallback((e, direction) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = size.w;
    const startH = size.h;

    const onMouseMove = (moveEvent) => {
      let newW = startW;
      let newH = startH;

      if (direction.includes('w')) {
        const delta = startX - moveEvent.clientX;
        newW = pos === 'right' ? startW + delta : startW - (startX - moveEvent.clientX);
        // Special case for right/left panel
        if (pos === 'right') newW = startW + (startX - moveEvent.clientX);
        if (pos === 'left') newW = startW - (startX - moveEvent.clientX);
      }

      // Simpler logic for sidebar positions
      if (pos === 'right') newW = startW + (startX - moveEvent.clientX);
      if (pos === 'left') newW = startW - (startX - moveEvent.clientX);
      if (pos === 'top') newH = startH - (startY - moveEvent.clientY);
      if (pos === 'bottom') newH = startH + (startY - moveEvent.clientY);

      if (pos === 'floating') {
          if (direction.includes('e')) newW = startW + (moveEvent.clientX - startX);
          if (direction.includes('s')) newH = startH + (moveEvent.clientY - startY);
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
  }, [size, pos]);

  return { size, startResizing, setSize };
}
