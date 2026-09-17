// 实现 Replace<S, From, To> 将字符串 S 中的第一个子字符串 From 替换为 To 。
// 例如
// type replaced = Replace<'types are fun!', 'fun', 'awesome'> // 期望是 'types are awesome!'
type ReplaceAll<S extends string, From extends string, To extends string> = From extends ""
  ? S
  : S extends `${infer Head}${From}${infer Tail}`
    ? `${Head}${To}${ReplaceAll<Tail, From, To>}`
    : S;

type Replace<S, F extends string, T> = F extends ""
  ? S
  : S extends `${infer head} ${F} ${infer tail}`
    ? `${head}${F}${tail}`
    : S;
