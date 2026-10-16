import { type FC, forwardRef, useImperativeHandle, useRef } from "react";
import { MaskProps, MaskRef } from "./type";
import styles from "./index.less";
import { Slider } from "antd";

export const Mask = forwardRef<MaskRef, MaskProps>(
  ({ children, className, customChangeOpacity = false }, ref) => {
    const maskRef = useRef<HTMLDivElement>(null);
    const setOpacity = (opacity: number) => {
      maskRef.current?.style.setProperty("background-color", `rgba(0, 0, 0, ${opacity})`);
    };
    useImperativeHandle(
      ref,
      () => ({
        setOpacity,
      }),
      [],
    );
    return (
      <div className={`${styles.maskWrap} ${className || ""}`}>
        {/* 蒙层层，绝对定位铺满父容器 */}
        <div ref={maskRef} className={styles.maskLayer} />
        {/* 内容层，放在蒙层上面 */}
        <div className={styles.maskContent}>{children}</div>
        {!customChangeOpacity && (
          <div className={styles.customChangeOpacity}>
            <Slider
              defaultValue={0.5}
              step={0.1}
              min={0}
              max={1}
              onChange={setOpacity}
              className={styles.slider}
            />
          </div>
        )}
      </div>
    );
  },
);
