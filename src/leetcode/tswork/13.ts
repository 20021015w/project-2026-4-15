// 计算字符串的长度，类似于 String#length 。
type StringToTurple<T extends string> = T extends `${infer F}${infer R}`
  ? [F, ...StringToTurple<R>]
  : [];

type StringLength<T extends string> = StringToTurple<T>["length"];

type LL = StringLength<"123">;
