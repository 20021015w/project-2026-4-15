// 实现 的类型。示例：just-flip-object
// Flip<{ a: "x", b: "y", c: "z" }>; // {x: 'a', y: 'b', z: 'c'}
// Flip<{ a: 1, b: 2, c: 3 }>; // {1: 'a', 2: 'b', 3: 'c'}
// Flip<{ a: false, b: true }>; // {false: 'a', true: 'b'}
// 无需支持嵌套对象和无法成为对象键的值，如数组
type Flip<T extends Record<string | number | symbol, string | number | symbol>> = {
  [P in keyof T as T[P]]: P;
};

type aF = Flip<{ a: "x"; b: "y"; c: "z" }>;
