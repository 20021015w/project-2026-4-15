// 实现一个类型 IsNever，它接受输入类型 T。 如果类型 解析为never ，则返回 true，否则 false。
// 例如：
// type A = IsNever<never> // expected to be true
// type B = IsNever<undefined> // expected to be false
// type C = IsNever<null> // expected to be false
// type D = IsNever<[]> // expected to be false
// type E = IsNever<number> // expected to be false
type IsNever<T> = [T] extends [never] ? true : false;

type D = IsNever<never>;
