// useDrop.ts
import { useCallback, useEffect, useRef } from "react";

export interface EUseDropProps {
  onDragEnter?: (e: DragEvent, dom: HTMLElement) => void;
  onMove?: (e: DragEvent, dom: HTMLElement) => void;
  onDragLeave?: (e: DragEvent, dom: HTMLElement) => void;
  onDrop?: (e: DragEvent, dom: HTMLElement) => void;
  isDefPreview?: boolean;
  capture?: boolean;
}

export const PREVIEW_CLASS_NAME = "PREVIEW_CLASS_NAME";

export const useDrop = ({
  onDragEnter,
  onMove,
  onDragLeave,
  onDrop,
  isDefPreview,
  capture = false,
}: EUseDropProps) => {
  // 存储多个dom：key -> dom
  const domMap = useRef<Map<string, HTMLElement>>(new Map());

  const setRef = useCallback(
    (key: string) => (el: HTMLElement | null) => {
      if (!el) {
        domMap.current.delete(key);
        return;
      }
      domMap.current.set(key, el);
    },
    [],
  );

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    domMap.current.forEach((el) => {
      const dragCounter = { current: 0 };

      const handleDragEnter = (e: DragEvent) => {
        e.preventDefault();
        dragCounter.current += 1;
        if (dragCounter.current === 1) {
          el.classList.add(PREVIEW_CLASS_NAME);
        }
        onDragEnter?.(e, el);
      };

      const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        onMove?.(e, el);
      };

      const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        dragCounter.current -= 1;
        if (dragCounter.current === 0) {
          el.classList.remove(PREVIEW_CLASS_NAME);
        }
        onDragLeave?.(e, el);
      };

      const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        dragCounter.current = 0;
        el.classList.remove(PREVIEW_CLASS_NAME);
        onDrop?.(e, el);
      };

      el.addEventListener("dragenter", handleDragEnter, capture);
      el.addEventListener("dragover", handleDragOver, capture);
      el.addEventListener("dragleave", handleDragLeave, capture);
      el.addEventListener("drop", handleDrop, capture);

      cleanups.push(() => {
        el.removeEventListener("dragenter", handleDragEnter, capture);
        el.removeEventListener("dragover", handleDragOver, capture);
        el.removeEventListener("dragleave", handleDragLeave, capture);
        el.removeEventListener("drop", handleDrop, capture);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [onDragEnter, onMove, onDragLeave, onDrop, capture]);

  return { setRef };
};
