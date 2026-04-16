import { FC, useEffect, useRef } from 'react';
import styles from './index.module.less';

export interface ERippleProps {
  color?: string;
  duration?: number;
  children?: React.ReactNode;
  range?: number;
}

export const Ripple: FC<ERippleProps> = ({
  color = 'rgba(0,0,0,0.1)',
  duration = 450,
  children,
  range = 30,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.classList.add(styles.rippleItem);

      // 动态样式
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.backgroundColor = color;
      ripple.style.transition = `width ${duration}ms ease, height ${duration}ms ease, opacity ${duration}ms ease`;

      containerRef.current.appendChild(ripple);

      requestAnimationFrame(() => {
        const defSize = Math.max(rect.width, rect.height) * 1.5;
        const finalSize = range || defSize;

        ripple.style.width = `${finalSize}px`;
        ripple.style.height = `${finalSize}px`;
        ripple.style.opacity = '0';
      });

      setTimeout(() => {
        ripple.remove();
      }, duration);
    };

    const el = containerRef.current;
    el?.addEventListener('pointerdown', handlePointerDown);

    return () => {
      el?.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [color, duration, range]);

  return (
    <div ref={containerRef} className={styles.rippleContainer}>
      {children}
    </div>
  );
};