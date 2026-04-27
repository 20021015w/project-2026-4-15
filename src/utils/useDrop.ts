import { useEffect, useRef } from "react"

export interface EUseDropProps {
  onDragEnter?: (e: DragEvent) => void
  onMove?: (e: DragEvent) => void
  onDragLeave?: (e: DragEvent) => void
  onDrop?: (e: DragEvent) => void
  isDefPreview?: boolean
  capture?: boolean
}

export const PREVIEW_CLASS_NAME = "PREVIEW_CLASS_NAME"

export const useDrop = ({
  onDragEnter,
  onMove,
  onDragLeave,
  onDrop,
  isDefPreview,
  capture = false,
}: EUseDropProps) => {
  const domRef = useRef<HTMLDivElement>(null)
  const dragCounter = useRef(0)

  useEffect(() => {
    const el = domRef.current
    if (!el) return

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault()
      dragCounter.current += 1

      // 只有第一次进入才加样式
      if (dragCounter.current === 1) {
        el.classList.add(PREVIEW_CLASS_NAME)
      }
      onDragEnter?.(e)
    }

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      onMove?.(e)
    }

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      dragCounter.current -= 1

      // 完全离开才删样式
      if (dragCounter.current === 0)
        el.classList.remove(PREVIEW_CLASS_NAME)
      onDragLeave?.(e)
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      // 放下后强制重置
      dragCounter.current = 0
      el.classList.remove(PREVIEW_CLASS_NAME)
      onDrop?.(e)
    }

    el.addEventListener("dragenter", handleDragEnter, capture)
    el.addEventListener("dragover", handleDragOver, capture)
    el.addEventListener("dragleave", handleDragLeave, capture)
    el.addEventListener("drop", handleDrop, capture)

    return () => {
      el.removeEventListener("dragenter", handleDragEnter, capture)
      el.removeEventListener("dragover", handleDragOver, capture)
      el.removeEventListener("dragleave", handleDragLeave, capture)
      el.removeEventListener("drop", handleDrop, capture)
    }
  }, [onDragEnter, onMove, onDragLeave, onDrop, capture])

  return domRef
}