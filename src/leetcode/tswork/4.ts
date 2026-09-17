// 在此挑战中建议使用TypeScript 4.0
// 实现一个泛型Pop<T>，它接受一个数组T，并返回一个由数组T的前 N-1 项（N 为数组T的长度）以相同的顺序组成的数组。
// 例如
// type arr1 = ['a', 'b', 'c', 'd']
// type arr2 = [3, 2, 1]
// type re1 = Pop<arr1> // expected to be ['a', 'b', 'c']
// type re2 = Pop<arr2> // expected to be [3, 2]

type Pop<T extends any[]> = T extends [...infer head, infer F] ? head : never;

type PP = Pop<["s", 1, 3, 4, 5]>;
