type Fa = FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2>; // [1, 2, 3, 4, [5]]. flattern 2 times
type Fb = FlattenDepth<[1, 2, [3, 4], [[[5]]]]>; // [1, 2, 3, 4, [[5]]]. Depth defaults to be 1

type FlattenDepth<T extends any[], AT extends number = 1, current extends number = 0> = T extends [
  infer H,
  ...infer R,
]
  ? H extends any[]
    ? current extends AT
      ? [H, ...FlattenDepth<R, AT, current>]
      : [...FlattenDepth<H, AT, PluseOne<current>>, ...FlattenDepth<R, AT, current>]
    : [H, ...FlattenDepth<R, AT, current>]
  : [];
