// 获取两个接口类型中的差值属性。
type Foo1 = {
  a: string;
  b: number;
  d: boolean;
  F: never;
};
type Bar = {
  a: string;
  c: boolean;
  d: number;
};
// type Result1 = Diff<Foo,Bar> // { b: number, c: boolean }
// type Result2 = Diff<Bar,Foo> // { b: number, c: boolean }

type Diff<T, R> = {
  [P in keyof T | keyof R as P extends keyof T
    ? P extends keyof R
      ? T[P] extends R[P]
        ? never
        : P
      : P
    : P]: P extends keyof T
    ? P extends keyof R
      ? T[P] extends R[P]
        ? R[P] extends T[P]
          ? never
          : R[P]
        : R[P] | T[P]
      : T[P]
    : P extends keyof R
      ? R[P]
      : never;
};

type res = Diff<Foo1, Bar>;
