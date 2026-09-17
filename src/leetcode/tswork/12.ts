type PromiseAll = <T extends any[]>(
  value: T,
) => Promise<{
  [P in keyof T]: MyAwaited<T[P]>;
}>;
declare const PAll: PromiseAll;
const d = PAll([promise1, promise2, promise3] as const);
