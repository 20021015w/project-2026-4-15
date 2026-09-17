// 实现StartsWith<T, U>,接收两个string类型参数,然后判断T是否以U开头,根据结果返回true或false
// 例如:
type a = StartsWith2<"abc", "ac">; // expected to be false
type b = StartsWith2<"abc", "ab">; // expected to be true
type c = StartsWith2<"abc", "abaqcd">; // expected to be false

type StartsWith<T extends string, U extends string> = T extends `${infer F}${infer R}`
  ? U extends `${infer M}${infer N}`
    ? F extends M
      ? StartsWith<R, N>
      : false
    : true
  : false;
type StartsWith2<T, U extends string> = T extends `${U}${infer _R}` ? true : false;
