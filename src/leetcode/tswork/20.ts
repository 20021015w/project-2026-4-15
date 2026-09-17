// 将 or 字符串替换为 。camelCasePascalCasekebab-case
// FooBarBaz -> foo-bar-baz
// 例如：
// type FooBarBaz = KebabCase<"FooBarBaz">
// const foobarbaz: FooBarBaz = "foo-bar-baz"

// type DoNothing = KebabCase<"do-nothing">
// const doNothing: DoNothing = "do-nothing"
type IsUpper<C extends string> =
  C extends Uppercase<C> ? (Lowercase<C> extends C ? false : true) : false;
type KebabCase<T extends string> = T extends `${infer F}${infer N}${infer R}`
  ? IsUpper<N> extends true
    ? `${Lowercase<F>}-${KebabCase<`${N}${R}`>}`
    : `${Lowercase<F>}${KebabCase<`${N}${R}`>}`
  : Lowercase<T>; // 只剩最后一个字符
type Foo = KebabCase<"doNothing">;
