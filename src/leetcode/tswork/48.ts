// 在本挑战中，你应实现类型 ，T 和 U 必须是Zip<T, U>Tuple
type exp = Zip<[1, 2], [true, false]>; // expected to be [[1, true], [2, false]]

type Zip<T, U> = T extends [infer F, ...infer R]
  ? U extends [infer UF, ...infer RF]
    ? [[F, UF], ...Zip<R, RF>]
    : []
  : [];
