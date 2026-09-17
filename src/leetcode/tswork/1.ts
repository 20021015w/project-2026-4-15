type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
type M = MyPick<{ id: "1"; age: 18 }, "age">;
const D: MyPick<{ id: string; n: number }, "id"> = {
  id: "da",
};

type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

type MR = MyReadonly<{ id: string; n: number }>;

type TuoleToObject<T extends readonly any[]> = {
  readonly [P in T[number]]: P;
};
const tuple = ["tesla", "moddel", "model", "ss"] as const;
type TT = TuoleToObject<typeof tuple>;
type MyParameter<T> = T extends (...args: infer Args) => any ? Args : never;
type F = MyParameter<(id: string, age: number) => string>;
const FD: F = ["1", 18];
type Push<T extends any[], U> = [...T, U];

type P = Push<[12, 3, 5, 5], "4">;

type First<T extends any[]> = T extends [infer P, ...infer rest] ? P : never;

type S = First<[1, 3, 4, 5, 6]>;

type MyExclude<T, U> = T extends U ? never : T;
type ME = MyExclude<"a" | "s" | "n", "n">;
