// 在这个挑战中，你需要写一个接受数组的类型，并且返回扁平化的数组类型。
// 例如:
// type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, 5]

type MyFlatten<T extends any[]> = T extends [infer Head, ...infer R]
  ? Head extends any[]
    ? [...MyFlatten<Head>, ...MyFlatten<R>]
    : [Head, ...MyFlatten<R>]
  : [];

type flatten = MyFlatten<[1, 2, [3, 4], [[[5]]]]>;
