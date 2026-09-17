// 实现一个将接收到的String参数转换为一个字母Union的类型。
// 例如
// type Test = '123';
// type Result = StringToUnion<Test>; // expected to be "1" | "2" | "3"

type StringToUnion1<T extends string> = T extends `${infer D}${infer Rest}`
  ? D | StringToUnion1<Rest>
  : never;

type SSd = StringToUnion1<"123">;
