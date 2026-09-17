// BEM（块‑元素‑修饰符）是 CSS 里一种很流行的类名命名规范。
// 举例：
// - **块（block）**组件写作 `btn`；
// - 依赖于块的**元素（element）**写作 `btn__price`；
// - 修改块样式的**修饰符（modifier）**写作 `btn--big` 或者 `btn__price--warning`。
// 实现类型 `BEM<B, E, M>`，由这三个参数生成字符串联合类型。
// 其中：`B` 是字符串字面量；`E`、`M` 是字符串数组（可以为空数组）。
// 例：BEM<'btn', ['price'], ['big','warning']>
// 输出："btn" | "btn__price" | "btn--big" | "btn__price--big" | "btn--warning" | "btn__price--warning"
type StringCancatArr<
  T extends string,
  A extends string[],
  syl extends string = "",
> = `${T}${syl}${A[number]}`;
type BEM<B extends string, E extends string[], M extends string[]> = E extends any[]
  ? M extends any[]
    ? StringCancatArr<StringCancatArr<B, E, "__">, M, "--">
    : StringCancatArr<B, E, "__">
  : B;
type BB = BEM<"btn", ["price"], ["big", "warning"]>;
