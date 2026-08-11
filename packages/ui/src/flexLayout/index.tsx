import { Layout, Model } from "flexlayout-react";
import { FC, ForwardRefRenderFunction, forwardRef, useMemo } from "react";
import { IBaseFlexLayoutProps } from "./type";

/**
 * 基于 flexlayout-react 的 Layout 二次封装。
 * - 支持 model 或 json 两种入参方式（json 内部通过 Model.fromJson 转换）
 * - 通过 forwardRef 暴露 Layout 实例，方便调用 addTabToTabSet / addTabToActiveTabSet / redraw / getRootDiv 等方法
 * - 透传其余 ILayoutProps（factory / onAction / onModelChange / icons 等）
 */
const FlexLayoutRender: ForwardRefRenderFunction<
  Layout,
  IBaseFlexLayoutProps
> = ({ model, json, factory, className, ...rest }, ref) => {
  // 优先使用传入的 model；否则用 json 创建（memo 化避免重复创建）
  const resolvedModel = useMemo(() => {
    if (model) return model;
    if (json) return Model.fromJson(json);
    return undefined;
  }, [model, json]);

  if (!resolvedModel) {
    throw new Error("[BaseFlexLayout] 必须提供 model 或 json 属性");
  }

  const mergedClassName = useMemo(() => {
    return ["wsl-flex-layout", className].filter(Boolean).join(" ");
  }, [className]);

  return <Layout ref={ref} model={resolvedModel} factory={factory} {...rest} />;
};

export const BaseFlexLayout: FC<IBaseFlexLayoutProps> = forwardRef(
  FlexLayoutRender,
) as unknown as FC<IBaseFlexLayoutProps> & { ref?: React.Ref<Layout> };

export type { IBaseFlexLayoutProps };
export default BaseFlexLayout;
