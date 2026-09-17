// 找出目标数组中只出现过一次的元素。例如：输入[1,2,2,3,3,4,5,6,6,6]，输出[1,4,5]
type Find<E, T extends any[]> = T extends [infer F, ...infer Rest]
  ? E extends F
    ? true
    : Find<E, Rest>
  : false;
type FilterOut<T, Arr extends any[]> = Arr extends [infer First, ...infer Rest]
  ? First extends T
    ? FilterOut<T, Rest>
    : [First, ...FilterOut<T, Rest>]
  : [];
type FindOnlyDisPlayOnce<T, R extends any[] = [], D extends any[] = []> = T extends [
  infer F,
  ...infer Rs,
]
  ? Find<F, R> extends true
    ? // F在结果R中，现在遇到第二次，移入黑名单，从R剔除
      FindOnlyDisPlayOnce<Rs, FilterOut<F, R>, [...D, F]>
    : Find<F, D> extends true
      ? // F已经在黑名单（重复过>=2次），直接跳过，不处理
        FindOnlyDisPlayOnce<Rs, R, D>
      : // 首次见到F，加入结果R
        FindOnlyDisPlayOnce<Rs, [...R, F], D>
  : R;

type Once = FindOnlyDisPlayOnce<[1, 2, 2, 3, 3, 4, 5, 6, 6, 6]>;
