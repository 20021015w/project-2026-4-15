import { ILayoutProps, IJsonModel, Model, TabNode } from "flexlayout-react";
import { ReactNode } from "react";

/** 组件工厂：根据 TabNode 返回对应内容 */
export type BaseFlexLayoutFactory = (node: TabNode) => ReactNode;

/**
 * BaseFlexLayout 属性
 * - model 与 json 二选一：传入 model 直接使用；传入 json 内部通过 Model.fromJson 创建
 * - 其余 ILayoutProps 原样透传
 */
export interface IBaseFlexLayoutProps extends Omit<
  ILayoutProps,
  "model" | "factory"
> {
  /** 布局模型，与 json 二选一（优先使用 model） */
  model?: Model;
  /** 布局 JSON 配置，与 model 二选一 */
  json?: IJsonModel;
  /** 组件工厂，根据 TabNode 返回对应组件 */
  factory: BaseFlexLayoutFactory;
  /** 自定义类名（会与内置 wsl-flex-layout 合并） */
  className?: string;
}
