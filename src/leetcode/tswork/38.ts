// 实现 的类型版本Array.reverse
// 例如：
type Ra = Reverse<["a", "b"]>; // ['b', 'a']
type Rb = Reverse<["a", "b", "c"]>; // ['c', 'b', 'a']

type Reverse<T extends any[]> = T extends [...infer F, infer R] ? [R, ...Reverse<F>] : [];
