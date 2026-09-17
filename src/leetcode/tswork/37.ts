// 实现 的类型版本Array.shift

// 例如：

type Results = Shift<[3, 2, 1]>; // [2, 1]

type Shift<T extends any[]> = T extends [infer F, ...infer R] ? F : never;

// 给定一个仅包含字符串类型 的元组类型和一个类型 ，递归地构建一个对象。TU

type Ta = TupleToNestedObject<["a"], string>; // {a: string}
type Tb = TupleToNestedObject<["a", "b"], number>; // {a: {b: number}}
type Tc = TupleToNestedObject<[], boolean>; // boolean. if the tuple is empty, just return the U type

type TupleToNestedObject<T extends any[], U> = T extends [
  infer F extends string | number | symbol,
  ...infer R,
]
  ? { [P in F]: TupleToNestedObject<R, U> }
  : U;
