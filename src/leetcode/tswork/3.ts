// 在 JavaScript 中我们经常会使用可串联（Chainable/Pipeline）的函数构造一个对象，但在 TypeScript 中，你能合理的给它赋上类型吗？

// 在这个挑战中，你可以使用任意你喜欢的方式实现这个类型 - Interface, Type 或 Class 都行。你需要提供两个函数 option(key, value) 和 get()。在 option 中你需要使用提供的 key 和 value 扩展当前的对象类型，通过 get 获取最终结果。

// 例如

// declare const config: Chainable

// const result = config
//   .option('foo', 123)
//   .option('name', 'type-challenges')
//   .option('bar', { value: 'Hello World' })
//   .get()
// // 期望 result 的类型是：
// interface Result {
//   foo: number
//   name: string
//   bar: {
//     value: string
//   }
// }
// 你只需要在类型层面实现这个功能 - 不需要实现任何 TS/JS 的实际逻辑。
// 你可以假设 key 只接受字符串而 value 接受任何类型，你只需要暴露它传递的类型而不需要进行任何处理。同样的 key 只会被使用一次。

class Config<T = {}> {
  private result: T;

  constructor(lastResult: T) {
    this.result = lastResult;
  }

  option<K extends string, V>(key: K, value: V): Config<T & Record<K, V>> {
    // JS 这里我们只存值；类型上返回新 Config，携带交叉后的类型
    const newObj = { ...this.result, [key]: value };
    return new Config(newObj) as Config<T & Record<K, V>>;
  }

  get(): T {
    return this.result;
  }
}

const config = new Config({});

const res = config.option("foo", 123).option("name", "abc").option("bar", { val: "hi" }).get();

type R = typeof res;
// { foo: number; name: string; bar: { val: string } }
const TR: R = {
  foo: 1,
  name: "30",
  bar: {
    val: "d",
  },
};

// type版本
type Chainable<T = {}> = {
  option<K extends string, V>(key: K, value: V): Chainable<T & Record<K, V>>;
  get(): T;
};

declare const configs: Chainable;

const result = configs.option("foo", 123).option("name", "abc").option("bar", { val: "hi" }).get();
// 初始实例，空对象
