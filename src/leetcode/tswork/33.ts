// 实现EndsWith<T, U>,接收两个string类型参数,然后判断T是否以U结尾,根据结果返回true或false
// 例如:
type Aa = EndsWith2<"abc", "bc">; // expected to be true
type Bb = EndsWith<"abc", "abc">; // expected to be true
type Vc = EndsWith<"abc", "d">; // expected to be false

type EndsWith<T, U> = T extends U
  ? true
  : T extends `${infer _}${infer R}`
    ? EndsWith<R, U>
    : false;

type EndsWith2<T extends string, U extends string> = T extends `${infer _Prefix}${U}`
  ? true
  : false;
