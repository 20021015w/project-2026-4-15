// 从字符串中剔除指定字符。
// 例如：
type Butterfly = DropChar<" b u t t e r f l y ! ", " ">; // 'butterfly!'
type DropChar<T extends string, Target extends string> = T extends `${infer F}${infer R}`
  ? F extends Target
    ? `${DropChar<R, Target>}`
    : `${F}${DropChar<R, Target>}`
  : "";
