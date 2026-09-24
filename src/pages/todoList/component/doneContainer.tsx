// DropContainer.tsx
import { useEffect, useRef } from "react";
import styles from "./index.less";
import { DragMeta, OnContainerDrop } from "./type";

export interface DropContainerProps<T = any> {
  containerKey: string; // 容器唯一标识，例如 "todo" / "archive"
  onDrop: OnContainerDrop<T>;
  children: React.ReactNode;
  className?: string;
}

export const PREVIEW_CLASS_NAME = "drop-container--over";

export const DropContainer = ({
  containerKey,
  onDrop,
  children,
  className = "",
}: DropContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragCounter = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current += 1;
      if (dragCounter.current === 1) {
        el.classList.add(PREVIEW_CLASS_NAME);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDragLeave = () => {
      dragCounter.current -= 1;
      if (dragCounter.current === 0) {
        el.classList.remove(PREVIEW_CLASS_NAME);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      el.classList.remove(PREVIEW_CLASS_NAME);

      // 从dataTransfer读取拖拽元信息（dragStart写入）
      const raw = e.dataTransfer?.getData("dragMeta");
      if (!raw) return;
      try {
        const dragMeta: DragMeta = JSON.parse(raw);
        // 放到容器，默认追加到容器末尾 insertBefore=false
        onDrop(dragMeta, containerKey, false);
      } catch (err) {
        console.error("drop parse error", err);
      }
    };

    el.addEventListener("dragenter", handleDragEnter);
    el.addEventListener("dragover", handleDragOver);
    el.addEventListener("dragleave", handleDragLeave);
    el.addEventListener("drop", handleDrop);

    return () => {
      el.removeEventListener("dragenter", handleDragEnter);
      el.removeEventListener("dragover", handleDragOver);
      el.removeEventListener("dragleave", handleDragLeave);
      el.removeEventListener("drop", handleDrop);
    };
  }, [containerKey, onDrop]);

  return (
    <div ref={containerRef} className={`${styles.dropContainer} ${className}`}>
      {children}
    </div>
  );
};
