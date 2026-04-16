import { ReactNode } from "react";

export type ERippleProps = {
  /**
   * 涟漪颜色
   * @default 'rgba(0,0,0,0.1)'
   */
  color?: string;
  /**
   * 动画持续时间（毫秒）
   * @default 450
   */
  duration?: number;
  /**
   * 子元素
   */
  children: ReactNode;
  range?:number
}