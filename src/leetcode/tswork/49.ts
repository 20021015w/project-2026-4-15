// 实现一个类型，该类型接收输入类型并返回是否元组类型。IsTupleTT
// 例如：
type ca = IsTuple<[number]>; // true
type c21 = IsTuple<readonly [number]>; // true
type s3 = IsTuple<number[]>; // false
type IsTuple<T> = [T] extends [readonly any[]]
  ? number extends T["length"]
    ? false
    : true
  : false;
