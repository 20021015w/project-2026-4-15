// 给定一个正整数作为类型的参数，要求返回的类型是该数字减 1。
// 例如:
// 元组工具：构建长度为 T 的元组
type BuildTuple<T extends number, A extends any[] = []> = A["length"] extends T
  ? A
  : BuildTuple<T, [...A, unknown]>;

// 减一：去掉元组最后一项，取长度
type MinusOne<T extends number> =
  BuildTuple<T> extends [...infer Rest, unknown] ? Rest["length"] : 0;

type Zero = MinusOne<1>; // 0
type FiftyFour = MinusOne<55>; // 54
type Ten = MinusOne<11>; // 10

type PluseOne<T extends number> =
  BuildTuple<T> extends [...infer R] ? [...R, unknown]["length"] : 0;
type Six = PluseOne<12>;
