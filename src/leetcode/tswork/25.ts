// 实现一个类型，该类型接收输入类型并返回是否解析为联合类型。IsUnionTT
// 例如：
type case1 = IsUnion<string>; // false
type case2 = IsUnion<string | number>; // true
type case3 = IsUnion<[string | number]>; // false
type IsUnion<T, U = T> = [T] extends [never]
  ? false
  : T extends any
    ? [U] extends [T]
      ? false
      : true
    : never;
