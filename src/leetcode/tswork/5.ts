// 给函数PromiseAll指定类型，它接受元素为 Promise 或者类似 Promise 的对象的数组，返回值应为Promise<T>，其中T是这些 Promise 的结果组成的数组。
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise<string>((resolve, reject) => {
  setTimeout(resolve, 100, "foo");
});
type MyAwaited<T> = T extends Promise<infer U> ? U : T;
// // 应推导出 `Promise<[number, 42, string]>`
// const p = PromiseAll([promise1, promise2, promise3] as const)
declare const PromiseAll: <T extends readonly unknown[]>(
  values: T,
) => Promise<{
  [K in keyof T]: MyAwaited<T[K]>;
}>;

// declare const promise1: Promise<string>;
// declare const promise2: Promise<number>;
// declare const promise3: boolean; // 普通非Promise值也支持

// as const 保留元组字面量类型
const Prs = PromiseAll([promise1, promise2, promise3] as const);
