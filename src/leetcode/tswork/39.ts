// 实现 lodash 的类型版本。_.flip
// 类型需要函数类型，并返回一个新的函数类型，该类型T的返回类型相同但参数相反。FlipArguments<T>T
// 例如：
type Flipped = FlipArguments<(arg0: string, arg1: number, arg2: boolean) => void>;
// // (arg0: boolean, arg1: number, arg2: string) => void
type FlipArguments<F extends (...args: any) => void> = (
  ...args: [...Reverse<Parameters<F>>]
) => ReturnType<F>;
