// 实现 ，将索引签名排除在对象类型中。RemoveIndexSignature<T>
// 例如：
type Foso = {
  [key: string]: any;
  foo(): void;
};

type A = RemoveIndexSignature<Foso>; // expected { foo(): void }

type RemoveIndexSignature<T> = {
  [K in keyof T as string extends K
    ? never
    : number extends K
      ? never
      : symbol extends K
        ? never
        : K]: T[K];
};
